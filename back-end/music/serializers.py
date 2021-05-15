from rest_framework import serializers
from music.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_artist', 'member_since']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'is_artist']

class AlbumSerializer(serializers.ModelSerializer):
    fans = UserSerializer(many=True, read_only=True)
    artist = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'date', 'fans']