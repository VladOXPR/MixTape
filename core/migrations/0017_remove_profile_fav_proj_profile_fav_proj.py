# Generated by Django 4.2.7 on 2024-03-06 16:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_profile_fav_proj_alter_project_coverimg'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='fav_proj',
        ),
        migrations.AddField(
            model_name='profile',
            name='fav_proj',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='favorite_project', to='core.project'),
        ),
    ]
