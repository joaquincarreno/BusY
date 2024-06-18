from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.core import serializers

from django.db.models.query import QuerySet

from api.serializers import GPSRegistrySerializer
from api.scripts.zones import getZonesGdf

from api.models import GPSRegistry, BusStops

from time import time

import pandas as pd
import geopandas as gpd

@api_view(['GET'])
def apiTest(request):
    return Response(data="todo parece funcionar bien :D")

@api_view(['GET'])
def getZones777(request): 
    zones = getZonesGdf()
    json = zones.to_json()
    return Response(json)

@api_view(['GET'])
def getAvailableRoutes(request):
    objects = GPSRegistry.objects.values_list('recorrido', flat=True).distinct()

    return Response(list(objects))

@api_view(['GET'])
def getAvailableBuses(request, route='X00', direction='X'):
    if route == 'X00':
        values = GPSRegistry.objects.values_list('patente', flat=True).distinct()
    else:
        if(direction == 'X'):
            values = GPSRegistry.objects.filter(recorrido=route).values_list('patente', flat=True).distinct()
        else:
            values = GPSRegistry.objects.filter(recorrido=route, sentido=direction).values_list('patente', flat=True).distinct()

    return Response({'buses': values})


@api_view(['GET'])
def getGPS(request, patente='ZN-6498'):
    # print(patente)
    objects = GPSRegistry.objects.filter(patente=patente)

    query = objects.query
    query.group_by = ['patente']
    results = QuerySet(query=query, model=GPSRegistry)

    # print(results)

    data = []
    patente_actual = results[0].patente
    coords = []
    timestamps = []
    i=0
    for o in results:
        i+=1
        if(patente_actual != o.patente):
            data += [
                {
                    'patente': patente_actual,
                    'timestamps': timestamps,
                    'coords': coords
                }
            ]
            patente_actual = o.patente
            coords = []
            timestamps = []
        timestamps += [str(o.date) + ' ' + str(o.time)]
        coords += [[o.latitude, o.longitude]]
    data += [{
        'patente': patente_actual,
        'timestamps': timestamps,
        'coords': coords
    }]

    
    return Response(data)

@api_view(['GET'])
def getStops(request):
    objects = list(BusStops.objects.all().values())
    
    return Response({'stops': objects})

