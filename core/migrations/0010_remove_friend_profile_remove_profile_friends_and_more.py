# Generated by Django 4.2.7 on 2024-01-31 23:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_profile_profileimg'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend',
            name='profile',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='friends',
        ),
        migrations.AddField(
            model_name='friend',
            name='recieved',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='request_receiver', to='core.profile'),
        ),
        migrations.AddField(
            model_name='friend',
            name='sent',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='request_sender', to='core.profile'),
        ),
    ]
