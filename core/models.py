from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    projects = models.ManyToManyField('Project', related_name='user_projects')

    id_user = models.IntegerField()
    bio = models.TextField(blank=True)
    profileimg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username

class Project(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=35, default='untitled')
    coverimg = models.ImageField(upload_to='cover_images', default='blank-profile-picture.png')

    # vocal = models.FileField(upload_to='vocal_files', blank=True, null=True)
    # instru = models.FileField(upload_to='instru_files', blank=True, null=True)
    # final = models.FileField(upload_to='final_files', blank=True, null=True)

    def __str__(self):
        return self.title


class Thread(models.Model):
    participants = models.ManyToManyField(User, related_name='threads')
    last_updated = models.DateTimeField(auto_now=True)

class Message(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

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





