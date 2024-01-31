from django import forms
from django.forms import ModelForm
from core.models import Profile, Project, Track, Message


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
    mp3 = forms.FileField()

    class Meta:
        model = Track
        fields = ['mp3', ]


class ProjectForm(ModelForm):
    coverimg = forms.ImageField()
    title = forms.CharField()

    class Meta:
        model = Project
        fields = ['coverimg', 'title', ]

class SettingsForm(ModelForm):

    class Meta:
        model = Profile
        fields = ['profileimg', 'name', 'bio', ]

        widgets = {
            'profileimg': forms.ClearableFileInput(attrs={'class': 'pfiform'}),
            'name': forms.TextInput(attrs={'class': 'nameform'}),
            'bio': forms.Textarea(attrs={'class': 'bioform'}),
        }

    # def __init__(self, *args, **kwargs):
    #     super(SettingsForm, self).__init__(*args, **kwargs)
    #     self.fields['profileimg'].label = ''

