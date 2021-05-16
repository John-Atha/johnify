from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import BooleanField, CharField, DateField, EmailField
from datetime import date

from django.db.models.fields.files import FileField
from django.db.models.fields.related import ManyToManyField

class User(AbstractUser):
    is_artist = BooleanField(default=False)
    email = EmailField(max_length=100, unique=True, null=False)
    photo = models.ImageField(default=None, null=True)
    member_since = models.DateField(default=date.today)
    def __str__(self):
        return f"{self.id}, {self.username}, {self.is_artist}"
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'is_artist': self.is_artist,
        }
    class Meta:
        ordering = ['id']

class Album(models.Model):
    photo = models.ImageField(default='', null=True)
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name="albums", null=False)
    title = CharField(max_length=100, null=False)
    date = models.DateField(default=date.today)
    fans = models.ManyToManyField(User, related_name='fav_albums', blank=True)
    def __str__(self):
        return f"{self.id}, {self.title}"

class Kind(models.Model):
    title = models.CharField(unique=True, null=False, default='Unknown', max_length=100)

class Track(models.Model):
    photo = models.ImageField(default='', null=True)
    title = CharField(max_length=100, null=False)
    file = FileField(null = False, unique=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="tracks", null=False, blank=False)
    date = models.DateField(default=date.today)
    fans = models.ManyToManyField(User, related_name='fav_tracks', blank=True)
    kinds = models.ManyToManyField(Kind, related_name="tracks", blank=True, null=True)
    def __str__(self):
        return f"{self.id}, {self.title}"