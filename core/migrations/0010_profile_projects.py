# Generated by Django 4.2.7 on 2023-12-05 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_project_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='projects',
            field=models.ManyToManyField(blank=True, related_name='profiles', to='core.project'),
        ),
    ]
