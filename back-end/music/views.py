import json
from music.serializers import UserSerializer
from music.models import *
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

def register(request):
    pass

class Users(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        users = User.objects.all()
        return Response([UserSerializer(user).data for user in users], status=status.HTTP_200_OK)
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
