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
    deviation = models.FloatField(default=None, blank=True, null=True)

class BusStops(models.Model):
    TSCode = models.TextField()
    userCode = models.TextField()
    name = models.TextField()
    positionX = models.FloatField()
    positionY = models.FloatField()

class Routes(models.Model):
    stop = models.ForeignKey(BusStops, null=True, on_delete=models.CASCADE)
    serviceTSCode = models.TextField()
    serviceDirection = models.TextField()
    order = models.IntegerField()
    variant = models.TextField()

class DeviationScores(models.Model):
    score = models.FloatField()
    # como se dice patente en inglés? licence plate no me gusta
    busID = models.TextField()
    serviceTSCode = models.TextField()
    serviceDirection = models.CharField(
        max_length=1,
        choices=Sentido.choices,
        default=Sentido.IDA
    )

