from django.db import models

# Create your models here.
class GPSRegistry(models.Model):
    patente = models.TextField()
    recorrido = models.TextField(blank=True)
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


