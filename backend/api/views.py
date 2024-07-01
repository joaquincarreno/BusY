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

from django.db.models import Q

@api_view(['GET'])
def getGPS(request, recorrido= '', patente='', sentido=''):
    # print(patente)

    objects = GPSRegistry.objects.filter(recorrido=recorrido).order_by('patente', 'date', 'time')
    
    if(patente != ''):
        objects = objects.filter(patente=patente)
    
    if(sentido != ''):
        objects = objects.filter(sentido=sentido)

    query = objects.query
    query.group_by = ['patente']
    results = QuerySet(query=query, model=GPSRegistry)

    # print(results)
    if(len(results) == 0):
        return Response([])

    data = []
    patente_actual = results[0].patente
    coords = []
    timestamps = []
    i=0
    for o in results:
        i+=1
        if(patente_actual != o.patente):
            if(len(timestamps) > 1):
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
            ids = list(paradas.values_list('stop', flat=True))
            objects = list(BusStops.objects.filter(id__in=ids).values())

            assert len(ids) == len(objects)

            for i in range(len(ids)):
                obj = objects[i]
                obj['direction'] = sentido
                objects[i] = obj

        else:
            paradas = Routes.objects.filter(serviceTSCode=recorrido, serviceDirection='I')
            idsIda = list(paradas.values_list('stop', flat=True))
            objectsIda = list(BusStops.objects.filter(id__in=idsIda).values())

            assert len(idsIda) == len(objectsIda)

            for i in range(len(idsIda)):
                obj = objectsIda[i]
                obj['direction'] = 'I'
                objectsIda[i] = obj

            paradas = Routes.objects.filter(serviceTSCode=recorrido, serviceDirection='R')
            idsRet = list(paradas.values_list('stop', flat=True))
            objectsRet = list(BusStops.objects.filter(id__in=idsRet).values())

            assert len(idsRet) == len(objectsRet)

            for i in range(len(idsRet)):
                obj = objectsRet[i]
                obj['direction'] = 'R'
                objectsRet[i] = obj

            objects = objectsIda + objectsRet
            
    return Response({'stops': objects})

@api_view(['GET'])
def getAvailableDirections(request, recorrido, patente):
    values = GPSRegistry.objects.filter(recorrido=recorrido, patente=patente).values_list('sentido', flat=True).distinct()

    return Response({'directions': values})