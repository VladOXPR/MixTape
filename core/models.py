from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_user = models.IntegerField()
    bio = models.TextField(blank=True)
    profileimg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_model = models.IntegerField()
    title = models.CharField(max_length=35, blank=True)
    vocal = models.FileField(upload_to='vocal_files')
    instru = models.FileField(upload_to='instru_files')
    final = models.FileField(upload_to='final_files')
    coverimg = models.ImageField(upload_to='cover_images', default='blank-profile-picture.png')

    def __str__(self):
        return self.user.username
