# Generated by Django 3.1.7 on 2021-05-13 15:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='song',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
