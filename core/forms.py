from django import forms
from django.forms import ModelForm
from core.models import Message, Profile


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


class SettingsForm(ModelForm):

    class Meta:
        model = Profile
        fields = ['profileimg', 'name', 'bio',]

        # widgets = {
        #     'profileimg': forms.FileField(),
        #     'name': forms.CharField(),
        #     'bio': forms.Textarea(),
        # }

    # def __init__(self, *args, **kwargs):
    #     super(SettingsForm, self).__init__(*args, **kwargs)
    #     self.fields['profileimg'].label = ''


