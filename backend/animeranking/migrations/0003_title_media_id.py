# Generated by Django 3.2.21 on 2023-09-06 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('animeranking', '0002_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='title',
            name='media_id',
            field=models.IntegerField(default=0),
        ),
    ]
