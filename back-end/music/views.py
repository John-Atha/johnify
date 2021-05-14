import json
from music.serializers import UserSerializer
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
        users = User.objects.all()
        users = paginate(request.GET.get('start'), request.GET.get('end'), users)
        try:
            users = [UserSerializer(user).data for user in users]
        except Exception:
            return users
        return Response(users, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        body = json.loads(request.body)
        user = UserSerializer(data=body)
        if user.is_valid():
            user.save()
            return Response(user.data, status=status.HTTP_200_OK)
        else:
            return Response(user.errors, status=status.HTTP_400_BAD_REQUEST) 

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
            return Response(f"User '{id}' does not exist.", status=status.HTTP_400_BAD_REQUEST)
        if request.user==user:
            operation = user.delete()
            if operation:
                return Response('User deleted successfully', status=status.HTTP_200_OK)
            else:
                return Response('Deletion failed', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
