from rest_framework import serializers
from music.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_artist', 'member_since', 'photo']

class AlbumSerializer(serializers.ModelSerializer):
    #fans = UserSerializer(many=True, read_only=True)
    artist = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'photo', 'date', 'fans']

class SongSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(many=False, read_only=True)
    class Meta:
        model = Song
        fields = ['id', 'title', 'album', 'file', 'photo', 'date', 'fans']