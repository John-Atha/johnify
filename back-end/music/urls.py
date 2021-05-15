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
    path('albums', views.Albums.as_view(), name='albums'),
    path('albums/<int:id>', views.OneAlbum.as_view(), name='one-album'),
    path('songs', views.Songs.as_view(), name='songs'),
    path('songs/<int:id>', views.OneSong.as_view(), name='one-song'),
]