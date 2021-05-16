from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_artist', 'email')

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist', 'date')

class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'album', 'date')

admin.site.register(User, UserAdmin)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Track, TrackAdmin)