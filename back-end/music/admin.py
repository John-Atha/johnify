from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_artist', 'email')

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist', 'date')

class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'album', 'date')

class KindAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')

admin.site.register(User, UserAdmin)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Track, TrackAdmin)
admin.site.register(Kind, KindAdmin)