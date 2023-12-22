from django import forms
from django.forms import ModelForm
from core.models import Message


class ChatMessageForm(ModelForm):
    body = forms.CharField(
        widget=forms.Textarea(attrs={"class": "forms", "id": "id_body", "rows": 3, "placeholder": "message"}))

    class Meta:
        model = Message
        fields = ['body', ]
