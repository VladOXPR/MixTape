from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.forms import ModelForm
from core.models import User, Profile, Project, Track, Message


class ChatMessageForm(ModelForm):
    body = forms.CharField(
        widget=forms.Textarea(attrs={"class": "forms",
                                     "id": "id_body",
                                     "rows": 1,
                                     "style": "height: 100%; width: 80%; font-size: 22px; margin-left: 10px",
                                     "placeholder": "message"}))

    class Meta:
        model = Message
        fields = ['body', ]


class TrackForm(ModelForm):
    class Meta:
        model = Track
        fields = ['mp3', ]

        widgets = {
            'mp3': forms.ClearableFileInput(attrs={'class': 'trackform'}),
        }


class ProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = ['coverimg', 'title', ]

        widgets = {
            'coverimg': forms.ClearableFileInput(attrs={'class': 'cviform'}),
            'title': forms.TextInput(attrs={'class': 'titleform'}),
        }


class CreateProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = ['coverimg', 'title', ]

        widgets = {
            'coverimg': forms.ClearableFileInput(attrs={'class': 'cviform'}),
            'title': forms.TextInput(attrs={'class': 'titleform'}),
        }


class SettingsForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['profileimg', 'name', 'bio', ]

        widgets = {
            'profileimg': forms.FileInput(),
            'name': forms.TextInput(),
            'bio': forms.Textarea(),
        }


class SignInForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ['username', 'password', ]
