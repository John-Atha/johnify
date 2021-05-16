import json
from music.serializers import *
from music.models import *
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.http import JsonResponse
from django.db import transaction
import magic

def paginate(start, end, items):
    if start is not None:
        try:
            start = int(start)
            if start<1:
                return JsonResponse({"error": "Invalid start parameter."}, status=400)
        except ValueError:
            return JsonResponse({"error": "Invalid start parameter."}, status=400)
        items = items[start-1:]
    if end is not None:
        try:
            end = int(end)
            if start:
                if end<start:
                    return JsonResponse({"error": "End parameter must be larger or equal to start parameter."}, status=400)
                else:
                    items = items[:end-start+1]
            else:
                if end>0:
                    items = items[:end]
                else:
                    return JsonResponse({"error": "Invalid end parameter."}, status=400)
        except ValueError:
            return JsonResponse({"error": "Invalid end parameter."}, status=400)
    return items

def get_mime_type(file):
    initial_pos = file.tell()
    file.seek(0)
    mime_type = magic.from_buffer(file.read(1024), mime=True)
    file.seek(initial_pos)
    print(mime_type)
    return mime_type

class Logged(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data, status=status.HTTP_200_OK)


class Users(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        users = paginate(request.GET.get('start'), request.GET.get('end'), User.objects.all())
        # pagination successfull
        try:
            users = [UserSerializer(user, context={"request": request}).data for user in users]
        # exception here -> pagination had returned an error
        except Exception as e:
            return users
        return Response(users, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        if 'username' in request.POST and 'password' in request.POST and 'confirmation' in request.POST and 'email' in request.POST:
            confirmation = request.POST['confirmation']
            data =  {
                'username': request.POST['username'],
                'email': request.POST['email'],
            }
            if request.POST['password']==request.POST['confirmation']:
                if 'photo' in request.FILES:
                    mime_type = get_mime_type(request.FILES['photo'])
                    if 'image' not in mime_type:
                        return Response('Invalid image file.', status=status.HTTP_400_BAD_REQUEST)
                    data['photo'] = request.FILES['photo']
                user = User.objects.create_user(username='dummy', password=request.POST['password'])
                user = UserSerializer(user, data=data, context={"request": request})
                if user.is_valid():
                    user.save()
                    return Response(user.data, status.HTTP_200_OK)
                else:
                    return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Passwords don't match", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Compulsory fields missing.", status=status.HTTP_400_BAD_REQUEST)

class OneUser(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user, context={"request": request}).data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user==user:
            data = request.POST.copy()
            if 'photo' in request.FILES:
                mime_type = get_mime_type(request.FILES['photo'])
                if 'image' not in mime_type:
                    return Response('Invalid image file.', status=status.HTTP_400_BAD_REQUEST)
                data['photo'] = request.FILES['photo']
            user = UserSerializer(user, data=data, partial=True, context={"request": request})
            if user.is_valid():
                user.save()
                return Response(user.data, status=status.HTTP_200_OK)
            else:
                return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
    
    @transaction.atomic
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user==user:
            operation = user.delete()
            if operation:
                return Response('User deleted successfully', status=status.HTTP_200_OK)
            else:
                return Response('Deletion failed', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

class Albums(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        albums = paginate(request.GET.get('start'), request.GET.get('end'), Album.objects.all().order_by('-date'))
        # pagination successfull
        try:
            albums = [AlbumSerializer(album, context={"request": request}).data for album in albums]
        # exception here -> pagination had returned an error
        except Exception:
            return albums
        return Response(albums, status=status.HTTP_200_OK)
    
    # I expect title 
    @transaction.atomic
    def post(self, request):
        if request.user.is_anonymous:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = request.user
            if not user.is_artist:
                return Response("Only artists can create albums.", status=status.HTTP_400_BAD_REQUEST)
            else:
                if 'title' in request.POST:
                    title = request.POST['title']
                    try:
                        album = user.albums.get(title=title)
                        return Response('You cannot have two albums with the same title.', status=status.HTTP_400_BAD_REQUEST)
                    except Album.DoesNotExist:
                        album = Album(artist=user)
                        data={
                            'title': title,
                        }
                        if 'photo' in request.FILES:
                            mime_type = get_mime_type(request.FILES['photo'])
                            if 'image' not in mime_type:
                                return Response('Invalid image file.', status=status.HTTP_400_BAD_REQUEST)
                            data['photo'] = request.FILES['photo']
                        album = AlbumSerializer(album, data=data, context={"request": request})
                        if album.is_valid():
                            album.save()
                            return Response(album.data, status=status.HTTP_200_OK)
                        else:
                            return Response(album.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response('Title missing', status=status.HTTP_400_BAD_REQUEST)

class OneAlbum(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, id):
        try:
            album = Album.objects.get(id=id)
        except Album.DoesNotExist:
            return Response(f"Album '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        return Response(AlbumSerializer(album, context={"request": request}).data, status=status.HTTP_200_OK)
    
    # for updating title and/or photo of the album
    @transaction.atomic
    def put(self, request, id):
        try:
            album = Album.objects.get(id=id)
        except Album.DoesNotExist:
            return Response(f"Album '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user != album.artist:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        data = {}
        if 'title' in request.POST:
            data['title'] = request.POST['title']
        if  'photo' in request.FILES:
            mime_type = get_mime_type(request.FILES['photo'])
            if 'image' not in mime_type:
                return Response('Invalid image file.', status=status.HTTP_400_BAD_REQUEST)
            data['photo'] = request.FILES['photo']
        if data:
            album = AlbumSerializer(album, data=data, partial=True, context={"request": request})
            if album.is_valid():
                album.save()
                return Response(album.data, status=status.HTTP_200_OK)
            else:
                return Response(album.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('No new data were given.', status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def delete(self, request, id):
        try:
            album = Album.objects.get(id=id)
        except Album.DoesNotExist:
            return Response(f"Album '{id}' not found.", status=status.HTTP_400_BAD_REQUEST)
        if request.user == album.artist:
            operation = album.delete()    
            if operation:
                return Response('Album deleted succesfully', status=status.HTTP_200_OK)
            else:
                return Response('Deletion failed.', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

class Tracks(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), Track.objects.all().order_by('-date'))
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
        except Exception:
            return tracks
        return Response(tracks, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        if 'file' in request.FILES and 'album' in request.POST and 'title' in request.POST:
            if not request.user.is_anonymous:
                user = request.user
                # validate album
                try:
                    album = Album.objects.get(id=int(request.POST['album']))
                except Album.DoesNotExist:
                    return Response("Invalid album.", status=status.HTTP_400_BAD_REQUEST)
                if album.artist!=user:
                    return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
                # validate uniqie title inside album
                try:
                    track = Track.objects.get(album=album, title=request.POST['title'])
                    return Response("Track with this title already exists inside this album.", status=status.HTTP_400_BAD_REQUEST)
                except Track.DoesNotExist:
                    pass
                # validate sound file
                file = request.FILES['file']
                mime_type = get_mime_type(file)
                if 'audio' not in mime_type:
                    return Response('Invalid audio file.', status=status.HTTP_400_BAD_REQUEST)
                # try serialize
                data = {
                    'file': request.FILES['file'],
                    'album': AlbumSerializer(album, context={"request": request}).data,
                    'title': request.POST['title'],
                }
                track = Track(album = album)
                track = TrackSerializer(track, data=data, context={"request": request}, partial=True)
                if track.is_valid():
                    track.save()
                    return Response(track.data, status=status.HTTP_200_OK)
                else:
                    return Response(track.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(TrackSerializer(track, context={"request": request}).data, status=status.HTTP_200_OK)
            else:
                return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response("Compulsory fields missing", status=status.HTTP_400_BAD_REQUEST)

class OneTrack(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        return Response(TrackSerializer(track, context={"request": request}).data, status=status.HTTP_200_OK)

    # for updating photo and/or title
    def put(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        # validate user
        if request.user != track.album.artist:
            print(request.user)
            print(track.album.artist)
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        data = {}
        # validate title
        if 'title' in request.POST:
            if track.title!=request.POST['title']:
                try:
                    duplicate = Track.objects.get(album=track.album, title=request.POST['title'])
                    return Response("Track with this title already exists inside this album.", status=status.HTTP_400_BAD_REQUEST)
                except Track.DoesNotExist:
                    data['title'] = request.POST['title']
        # validate photo
        if 'photo' in request.FILES:
            mime_type = get_mime_type(request.FILES['photo'])
            if 'image' not in mime_type:
                return Response("Invalid image file.", status=status.HTTP_400_BAD_REQUEST)
            data['photo'] = request.FILES['photo']
        if data:
            track = TrackSerializer(track, data=data, partial=True, context={"request": request})
            if track.is_valid():
                track.save()
                return Response(track.data, status=status.HTTP_200_OK)
            else:
                return Response(track.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("No new data were given.", status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user != track.album.artist:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        operation = track.delete()
        if operation:
            return Response("Track deleted successfully.", status=status.HTTP_200_OK)
        else:
            return Response("Could not delete track '{id}'.", status=status.HTTP_400_BAD_REQUEST)

class AlbumTracks(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            album = Album.objects.get(id=id)
        except Album.DoesNotExist:
            return Response(f"Album '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), album.tracks.all())
        # pagination successfull
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
        # error in pagination
        except Exception:
            return tracks
        return Response(tracks, status=status.HTTP_200_OK)

class UserAlbums(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if not user.is_artist:
            return Response(f"User '{id}' is not an artist.", status=status.HTTP_400_BAD_REQUEST)
        albums = paginate(request.GET.get('start'), request.GET.get('end'), user.albums.all())
        try:
            albums = [AlbumSerializer(album, context={"request": request}).data for album in albums]
        except Exception:
            return albums
        return Response(albums, status=status.HTTP_200_OK)

class UserTracks(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if not user.is_artist:
            return Response(f"User '{id}' is not an artist.", status=status.HTTP_400_BAD_REQUEST)
        albums = user.albums.all()
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), Track.objects.filter(album__in=albums))
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
        except Exception:
            return tracks
        return Response(tracks, status=status.HTTP_200_OK)

class UserFavAlbums(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        albums = paginate(request.GET.get('start'), request.GET.get('end'), user.fav_albums.all())
        try:
            albums = [AlbumSerializer(album, context={"request": request}).data for album in albums]
            print(albums)
        except Exception:
            return albums
        return Response(albums, status=status.HTTP_200_OK)

    # expects album id
    def post(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            if 'album' in request.POST:
                try:
                    album = Album.objects.get(id=request.POST['album'])
                except Album.DoesNotExist:
                    return Response(f"Album '{request.POST['album']}' not found.", status=status.HTTP_400_BAD_REQUEST)
                if album not in user.fav_albums.all():
                    user.fav_albums.add(album)
                    user.save()
                res = [album.id for album in user.fav_albums.all()]
                return Response({'albums': res}, status=status.HTTP_200_OK)
            else:
                return Response("Album id not given.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            if 'album' in request.POST:
                try:
                    album = Album.objects.get(id=request.POST['album'])
                except Album.DoesNotExist:
                    return Response(f"Album '{request.POST['album']}' not found.", status=status.HTTP_400_BAD_REQUEST)
                if album in user.fav_albums.all():
                    user.fav_albums.remove(album)
                    user.save()
                res = { 'albums': [album.id for album in user.fav_albums.all()]}
                return Response(res, status=status.HTTP_200_OK)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)    

class UserFavTracks(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), user.fav_tracks.all())
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
            print(tracks)
        except Exception:
            return tracks
        return Response(tracks, status=status.HTTP_200_OK)

    # expects track id
    def post(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            if 'track' in request.POST:
                try:
                    track = Track.objects.get(id=request.POST['track'])
                except Track.DoesNotExist:
                    return Response(f"Track '{request.POST['track']}' not found.", status=status.HTTP_400_BAD_REQUEST)
                if track not in user.fav_tracks.all():
                    user.fav_tracks.add(track)
                    user.save()
                res = [track.id for track in user.fav_tracks.all()]
                return Response({'tracks': res}, status=status.HTTP_200_OK)
            else:
                return Response("Track id not given.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

    # expects track id
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            if 'track' in request.POST:
                try:
                    track = Track.objects.get(id=request.POST['track'])
                except Track.DoesNotExist:
                    return Response(f"Track '{request.POST['track']}' not found.", status=status.HTTP_400_BAD_REQUEST)
                if track in user.fav_tracks.all():
                    user.fav_tracks.remove(track)
                    user.save()
                res = [track.id for track in user.fav_tracks.all()]
                return Response({'tracks': res}, status=status.HTTP_200_OK)
            else:
                return Response("Track id not given.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

class AlbumFans(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            album = Album.objects.get(id=id)
        except Album.DoesNotExist:
            return Response(f"Album '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        fans = paginate(request.GET.get('start'), request.GET.get('end'), album.fans.all())
        try:
            fans = [UserSerializer(fan, context={"request": request}).data for fan in fans]
        except Exception:
            return fans
        return Response(fans, status=status.HTTP_200_OK)

class TrackFans(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        fans = paginate(request.GET.get('start'), request.GET.get('end'), track.fans.all())
        try:
            fans = [UserSerializer(fan, context={"request": request}).data for fan in fans]
        except Exception:
            return fans
        return Response(fans, status=status.HTTP_200_OK)

class AlbumsRanking(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        albums = paginate(request.GET.get('start'), request.GET.get('end'), Album.objects.all().order_by('-fans'))
        try:
            albums = [AlbumSerializer(album, context={"request": request}).data for album in albums]
        except Exception:
            return albums
        return Response(albums, status=status.HTTP_200_OK)

class TracksRanking(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), Track.objects.all().order_by('-fans'))
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
        except Exception:
            return tracks
        return Response(tracks, status=status.HTTP_200_OK)

class Kinds(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        kinds = paginate(request.GET.get('start'), request.GET.get('end'), Kind.objects.all())
        try:
            kinds = [KindSerializer(kind).data for kind in kinds]
        except Exception:
            return kinds
        return Response(kinds, status=status.HTTP_200_OK)
    
    def post(self, request):
        if not request.user.is_anonymous:
            if request.user.is_artist:
                if 'title' in request.POST:
                    data = request.POST
                    kind = KindSerializer(data=data)
                    if kind.is_valid():
                        kind.save()
                        return Response(kind.data, status=status.HTTP_200_OK)
                    else:
                        return Response(kind.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response('No title given.', status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Only artists can create new kinds.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

class OneKind(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            kind = Kind.objects.get(id=id)
        except Kind.DoesNotExist:
            return Response(f"Kind '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        return Response(KindSerializer(kind).data, status=status.HTTP_200_OK)

class KindTracks(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            kind = Kind.objects.get(id=id)
        except Kind.DoesNotExist:
            return Response(f"Kind '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        tracks = paginate(request.GET.get('start'), request.GET.get('end'), kind.tracks.all())
        try:
            tracks = [TrackSerializer(track, context={"request": request}).data for track in tracks]
        except Exception:
            tracks
        return Response(tracks, status=status.HTTP_200_OK)

class TrackKinds(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user == track.album.artist:
            if request.body:
                body = json.loads(request.body)
                kinds_ids = body['kinds']
                for kind_id in kinds_ids:
                    try:
                        kind = Kind.objects.get(id=kind_id)
                    except Kind.DoesNotExist:
                        pass
                    track.kinds.add(kind)
                track.save()
                return Response(TrackSerializer(track, context={"request": request}).data, status=status.HTTP_200_OK)
            else:
                return Response("Empty body.", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        try:
            track = Track.objects.get(id=id)
        except Track.DoesNotExist:
            return Response(f"Track '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user == track.album.artist:
            if 'kind' in request.POST:
                try:
                    kind = Kind.objects.get(id=request.POST['kind'])
                except Kind.DoesNotExist:
                    return Response(f"Kind '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
                if kind in track.kinds.all():
                    track.kinds.remove(kind)
                    track.save()
            return Response([KindSerializer(kind).data for kind in track.kinds.all()], status=status.HTTP_200_OK)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)