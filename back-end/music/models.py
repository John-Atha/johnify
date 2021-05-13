from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import BooleanField, CharField, DateField
from datetime import date

from django.db.models.fields.files import FileField
from django.db.models.fields.related import ManyToManyField

class User(AbstractUser):
    is_artist = BooleanField(default=False)
    def __str__(self):
        return f"{self.id}, {self.username}, {self.is_artist}"

class Album(models.Model):
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name="albums", null=False)
    title = CharField(max_length=100, null=False)
    date = models.DateField(default=date.today)
    fans = models.ManyToManyField(User, related_name='fav_albums')
    def __str__(self):
        return f"{self.id}, {self.title}"

class Song(models.Model):
    title = CharField(max_length=100, null=False)
    file = FileField(null = False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="songs", null=False)
    date = models.DateField(default=date.today)
    fans = models.ManyToManyField(User, related_name='fav_songs')
    def __str__(self):
        return f"{self.id}, {self.title}"