# Generated by Django 4.2.7 on 2024-01-30 21:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_message_timestamp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='timestamp',
        ),
    ]
