# Generated by Django 4.2.7 on 2023-12-20 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_remove_profile_projects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(default='untitled', max_length=35),
        ),
    ]
