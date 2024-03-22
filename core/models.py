from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_user = models.IntegerField()

    friends = models.ManyToManyField("self", blank=True)
    fav_proj = models.ForeignKey("Project", blank=True, null=True, on_delete=models.SET_NULL,
                                 related_name='favorite_project')

    profileimg = models.ImageField(upload_to='profile_images', default='blank-pfp.png')
    name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


class Project(models.Model):
    profile = models.ManyToManyField(Profile, blank=True)

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=35, default='untitled')
    coverimg = models.ImageField(upload_to='cover_images', default='blank-project.png')

    def get_first_track(self):
        return self.track_set.first()

    def __str__(self):
        return str(self.title)


class Track(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)

    id = models.AutoField(primary_key=True)
    mp3 = models.FileField(upload_to='mp3_tracks/')

    def __str__(self):
        return str(self.id)


class Message(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='recipient')

    body = models.TextField()
    seen = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.body
