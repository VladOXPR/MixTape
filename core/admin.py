from django.contrib import admin
from .models import Profile, Project, Track, Friend, Message

admin.site.register([Profile, Project, Track, Friend, Message])
