# Generated by Django 3.1.7 on 2021-05-16 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0009_auto_20210516_1532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='track',
            name='kinds',
            field=models.ManyToManyField(blank=True, null=True, related_name='tracks', to='music.Kind'),
        ),
    ]
