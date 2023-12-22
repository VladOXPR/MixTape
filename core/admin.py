from django.contrib import admin
from .models import Profile, Project, Friend, Message

admin.site.register([Profile, Project, Friend, Message])
