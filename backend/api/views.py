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
def getGPS(request, patente='XXXX-XX'):
    # print(patente)
    if patente == 'XXXX-XX':
        objects = GPSRegistry.objects.all()
    else:
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

from shapely import Point
@api_view(['GET'])
def getStops(request):

    df = pd.DataFrame(list(BusStops.objects.all().values()))
    # print(df.columns)
    geoms = df.apply(lambda x: Point(x['positionX'], x['positionY']), axis=1)
    print(geoms)
    geodf = gpd.GeoDataFrame(data=df.drop(columns=['positionX', 'positionY']), geometry=geoms)

    return Response(geodf.to_json())

