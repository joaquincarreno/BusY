from django.db import models

class Sentido(models.TextChoices):
    IDA = 'I', 'Ida'
    RET = 'R', 'Retorno'

class GPSRegistry(models.Model):
    patente = models.TextField()
    recorrido = models.TextField(blank=True)
    sentido = models.CharField(
        max_length=1,
        choices=Sentido.choices,
        default=Sentido.IDA
    )
    date = models.DateField()
    time = models.TimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()

class BusStops(models.Model):
    TSCode = models.TextField()
    userCode = models.TextField()
    name = models.TextField()
    positionX = models.FloatField()
    positionY = models.FloatField()

class Routes(models.Model):
    serviceUserCode = models.TextField()
    serviceTSCode = models.TextField()
    serviceDirection = models.TextField()
    order = models.IntegerField()
    variant = models.TextField()


