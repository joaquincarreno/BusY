# Generated by Django 5.0.6 on 2024-06-21 16:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_gpsregistry_sentido'),
    ]

    operations = [
        migrations.RenameField(
            model_name='Routes',
            old_name='serviceUserCode',
            new_name='stopTSCode'
        ),
    ]
