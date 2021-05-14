from music.serializers import UserSerializer
from music.models import *
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

class Users(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self):
        users = User.objects.all()
        return Response([UserSerializer(user).data for user in users], status=status.HTTP_200_OK)
    def post(self, request):
        pass

class OneUser(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(f"User '{id}' not found.", status=status.HTTP_404_NOT_FOUND)
    def put(self, request, id):
        pass
    def delete(self, request, id):
        pass


