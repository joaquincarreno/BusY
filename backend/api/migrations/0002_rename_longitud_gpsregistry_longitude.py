# Generated by Django 5.0.3 on 2024-03-14 11:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gpsregistry',
            old_name='longitud',
            new_name='longitude',
        ),
    ]