# Generated by Django 4.2.7 on 2023-12-22 04:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='recipient',
            new_name='receiver',
        ),
    ]
