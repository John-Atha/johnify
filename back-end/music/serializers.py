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

class KindSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kind
        fields = ['id', 'title']
        
class TrackSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(many=False, read_only=True)
    kinds = KindSerializer(many=True)
    class Meta:
        model = Track
        fields = ['id', 'title', 'album', 'file', 'kinds', 'photo', 'date', 'fans']
