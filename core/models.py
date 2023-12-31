from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_user = models.IntegerField()

    projects = models.ManyToManyField('Project', related_name='user_projects', blank=True)
    friends = models.ManyToManyField('Friend', related_name='user_friends', blank=True)

    bio = models.TextField(blank=True)
    profileimg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username


class Project(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=35, default='untitled')
    coverimg = models.ImageField(upload_to='cover_images', default='blank-profile-picture.png')

    def __str__(self):
        return self.title


class Friend(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.profile.user.username


class Message(models.Model):
    body = models.TextField()
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='recipient')
    seen = models.BooleanField(default=False)

    def __str__(self):
        return self.body

# class Published(models.Model):
#     title = models.CharField(max_length=35, blank=True)
#     vocal = models.FileField(upload_to='vocal_files', blank=True, null=True)
#     instru = models.FileField(upload_to='instru_files', blank=True, null=True)
#     final = models.FileField(upload_to='final_files', blank=True, null=True)
#     coverimg = models.ImageField(upload_to='cover_images', default='blank-profile-picture.png')
#     listens = models.IntegerField()
#
#     def __str__(self):
#         return self.title
