import json
from music.serializers import UserSerializer, AlbumSerializer, UserCreateSerializer
from music.models import *
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.http import JsonResponse
from django.db import transaction

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
            if 'is_artist' in request.POST:
                is_artist = request.POST['is_artist']==1
            else:
                is_artist = False
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
    
    # I expect title and artist id
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
                        album = Album(artist=user, title=title)
                        album.save()
                        return Response(AlbumSerializer(album).data, status=status.HTTP_200_OK)
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
        pass
    
    @transaction.atomic
    def delete(self, request, id):
        pass