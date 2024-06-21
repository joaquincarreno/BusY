from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.core import serializers

from django.db.models.query import QuerySet

from api.serializers import GPSRegistrySerializer
from api.scripts.zones import getZonesGdf

from api.models import GPSRegistry, BusStops, Routes

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
def getAvailableBuses(request, recorrido='X00', sentido='X'):
    if recorrido == 'X00':
        values = GPSRegistry.objects.values_list('patente', flat=True).distinct()
    else:
        if(sentido == 'X'):
            values = GPSRegistry.objects.filter(recorrido=recorrido).values_list('patente', flat=True).distinct()
        else:
            values = GPSRegistry.objects.filter(recorrido=recorrido, sentido=sentido).values_list('patente', flat=True).distinct()

    return Response({'buses': values})


@api_view(['GET'])
def getGPS(request, patente='ZN-6498', sentido=''):
    # print(patente)
    if(sentido == ''):
        objects = GPSRegistry.objects.filter(patente=patente)
    else:
        objects = GPSRegistry.objects.filter(patente=patente, sentido=sentido)

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
def getStops(request, recorrido='', sentido=''):
    if(recorrido == ''):
        objects = list(BusStops.objects.all().values())

    else:
        recorrido = recorrido[1:] if recorrido[0] == 'T' else recorrido
        if(sentido != ''):
            paradas = Routes.objects.filter(serviceTSCode=recorrido, serviceDirection=sentido)
        else:
            paradas = Routes.objects.filter(serviceTSCode=recorrido)
            
        ids = list(paradas.values_list('stop', flat=True))

        objects = list(BusStops.objects.filter(id__in=ids).values())


    
    return Response({'stops': objects})

@api_view(['GET'])
def getAvailableDirections(request, recorrido, patente):
    values = GPSRegistry.objects.filter(recorrido=recorrido, patente=patente).values_list('sentido', flat=True).distinct()

    return Response({'directions': values})