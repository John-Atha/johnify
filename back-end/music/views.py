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

class Users(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        users = paginate(request.GET.get('start'), request.GET.get('end'), User.objects.all())
        # pagination successfull
        try:
            users = [UserSerializer(user).data for user in users]
        # exception here -> pagination had returned an error
        except Exception:
            return users
        return Response(users, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        if 'username' in request.POST and 'password' in request.POST and 'confirmation' in request.POST and 'email' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            confirmation = request.POST['confirmation']
            email = request.POST['email']
            if password==confirmation:
                user = UserCreateSerializer(data=request.POST)
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
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user==user:
            body = json.loads(request.body)
            user = UserSerializer(user, data=body, partial=True)
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
        albums = paginate(request.GET.get('start'), request.GET.get('end'), Album.objects.all())
        # pagination successfull
        try:
            albums = [AlbumSerializer(album).data for album in albums]
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
                        album = AlbumSerializer(album, data=data)
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
        return Response(AlbumSerializer(album).data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def put(self, request, id):
        # for photo update
        pass
    
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

class Songs(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        songs = paginate(request.GET.get('start'), request.GET.get('end'), Song.objects.all())
        try:
            songs = [SongSerializer(song).data for song in songs]
        except Exception:
            return songs
        return Response(songs, status=status.HTTP_200_OK)

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
                    song = Song.objects.get(album=album, title=request.POST['title'])
                    return Response("Song with this title already exists inside this album.", status=status.HTTP_400_BAD_REQUEST)
                except Song.DoesNotExist:
                    pass
                # validate sound file
                file = request.FILES['file']
                mime_type = get_mime_type(file)
                if 'audio' not in mime_type:
                    return Response('Invalid audio file.', status=status.HTTP_400_BAD_REQUEST)
                # try serialize
                data = {
                    'file': request.FILES['file'],
                    'album': AlbumSerializer(album).data,
                    'title': request.POST['title'],
                }
                print(data)
                song = Song(album = album)
                song = SongSerializer(song, data=data)
                if song.is_valid():
                    song.save()
                    return Response(song.data, status=status.HTTP_200_OK)
                else:
                    return Response(song.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(SongSerializer(song).data, status=status.HTTP_200_OK)
            else:
                return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response("Compulsory fields missing", status=status.HTTP_400_BAD_REQUEST)

class OneSong(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            song = Song.objects.get(id=id)
        except Song.DoesNotExist:
            return Response(f"Song '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        return Response(SongSerializer(song).data, status=status.HTTP_200_OK)

    # for updating photo and/or title
    def put(self, request, id):
        try:
            song = Song.objects.get(id=id)
        except Song.DoesNotExist:
            return Response(f"Song '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        # validate user
        if request.user != song.album.artist:
            print(request.user)
            print(song.album.artist)
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        # validate title
        if song.title!=request.POST['title']:
            try:
                duplicate = Song.objects.get(album=song.album, title=request.POST['title'])
                return Response("Song with this title already exists inside this album.", status=status.HTTP_400_BAD_REQUEST)
            except Song.DoesNotExist:
                pass
        data = {
            'photo': request.FILES['photo'],
            'title': request.POST['title'],
        }
        song = SongSerializer(song, data=data, partial=True)
        if song.is_valid():
            song.save()
            return Response(song.data, status=status.HTTP_200_OK)
        else:
            return Response(song.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            song = Song.objects.get(id=id)
        except Song.DoesNotExist:
            return Response(f"Song '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
        if request.user != song.album.artist:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        operation = song.delete()
        if operation:
            return Response("Song deleted successfully.", status=status.HTTP_200_OK)
        else:
            return Response("Could not delete song '{id}'.", status=status.HTTP_400_BAD_REQUEST)