from django.urls import path
from . import views

urlpatterns = [
    path('users', views.Users.as_view(), name='users'),
    path('users/<int:id>', views.OneUser.as_view(), name='oneUser'),
]