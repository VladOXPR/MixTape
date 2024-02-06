from django.contrib import admin
from .models import Profile, Project, Track, Message

admin.site.register([Profile, Project, Track, Message])
