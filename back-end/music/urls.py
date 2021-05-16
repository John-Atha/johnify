from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('users', views.Users.as_view(), name='users'),
    path('users/<int:id>', views.OneUser.as_view(), name='one-user'),
    path('users/<int:id>/albums', views.UserAlbums.as_view(), name='user-albums'),
    path('users/<int:id>/albums/fav', views.UserFavAlbums.as_view(), name='user-fav-albums'),
    path('users/<int:id>/tracks', views.UserTracks.as_view(), name='user-tracks'),
    path('users/<int:id>/tracks/fav', views.UserFavTracks.as_view(), name='user-fav-tracks'),
    path('albums', views.Albums.as_view(), name='albums'),
    path('albums/<int:id>', views.OneAlbum.as_view(), name='one-album'),
    path('albums/<int:id>/tracks', views.AlbumTracks.as_view(), name='album-tracks'),
    path('albums/<int:id>/fans', views.AlbumFans.as_view(), name='album-fans'),
    path('albums/ranking', views.AlbumsRanking.as_view(), name='albums-ranking'),
    path('tracks', views.Tracks.as_view(), name='tracks'),
    path('tracks/<int:id>', views.OneTrack.as_view(), name='one-track'),
    path('tracks/<int:id>/fans', views.TrackFans.as_view(), name='track-fans'),
    path('tracks/<int:id>/kinds', views.TrackKinds.as_view(), name='track-kinds'),
    path('tracks/ranking', views.TracksRanking.as_view(), name='tracks-ranking'),
    path('kinds', views.Kinds.as_view(), name='kinds'),
    path('kinds/<int:id>', views.OneKind.as_view(), name='one-kind'),
    path('kinds/<int:id>/tracks', views.KindTracks.as_view(), name='one-kind'),
]