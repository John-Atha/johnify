from rest_framework import serializers
from music.models import *

class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_artist', 'member_since', 'photo_url']

    def get_photo_url(self, user):
        if user.photo:
            request = self.context.get('request')
            photo_url = user.photo.url
            return request.build_absolute_uri(photo_url)
        else:
            return None

class AlbumSerializer(serializers.ModelSerializer):
    #fans = UserSerializer(many=True, read_only=True)
    artist = UserSerializer(many=False, read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'photo_url', 'date', 'fans']

    def get_photo_url(self, album):
        if album.photo:
            request = self.context.get('request')
            photo_url = album.photo.url
            return request.build_absolute_uri(photo_url)
        else:
            return None

class KindSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kind
        fields = ['id', 'title']
        
class TrackSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(many=False, read_only=True)
    kinds = KindSerializer(many=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ['id', 'title', 'album', 'file', 'kinds', 'photo_url', 'date', 'fans']

    def get_photo_url(self, track):
        if track.photo:
            request = self.context.get('request')
            photo_url = track.photo.url
            return request.build_absolute_uri(photo_url)
        else:
            return None