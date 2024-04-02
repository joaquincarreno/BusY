from django.db import models

# Create your models here.
class GPSRegistry(models.Model):
    patente = models.TextField()
    recorrido = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()