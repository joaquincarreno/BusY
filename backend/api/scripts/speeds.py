from api.models import GPSRegistry

import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

from datetime import datetime

def getTimeStamp(row):
    return datetime.combine(row['date'], row['time'])

def fillTimes(group):
    diffs = group['timestamp'].diff()
    group['dt'] = diffs.apply(lambda x: x.total_seconds()/60 /60) # dt en segundos->minutos->horas
    return group

def fillDistances(group):
    distancias = group['geometry'].distance(group['geometry'].shift(1))
    group['distancia'] = distancias / 1000 # pasamos m->km
    return group

def fillSpeedsAux(element):
    try:
        if(pd.isna(element['dt']) or pd.isna(element['dt'])):
            return 0
        else:
            return element['distancia'] / element['dt']
    except:
        print('alo')

def fillSpeeds(group):
    group['speed'] = [0] + group.iloc[0:].apply(fillSpeedsAux, axis=1)
    return group

def saveSpeeds(row):
    obj = row['obj']
    obj.speed = row['speed']
    obj.save()

CRS_ORIG = 'EPSG:9152'
CRS_PROJ = 'EPSG:20048'
from time import time
def setupSpeeds(skip=True, force=False):
    if skip:
        print('skipping speeds')
        return

    print('setting speeds')
    if(force):
        llaves = GPSRegistry.objects.all().values_list('recorrido', 'sentido').distinct()
    else:
        llaves = GPSRegistry.objects.all().filter(speed=None).values_list('recorrido', 'sentido').distinct()
    
    total_steps = len(llaves)
    current_step = 0
    print('total steps:', total_steps)
    t0 = time()
    for r, s in llaves:
        if r == '' or s == '':
            continue
        gps = GPSRegistry.objects.filter(recorrido=r, sentido=s)
        n = len(gps)
        print(n, 'registries for', r, s)

        df = gpd.GeoDataFrame(data=gps.values())
        df.set_geometry([Point(xy) for xy in zip(df['longitude'], df['latitude'])], inplace=True)
        df.drop(columns=['speed', 'latitude', 'longitude', 'recorrido', 'deviation', 'sentido', 'id'], inplace=True)
        df['obj'] = gps
        df.crs = CRS_ORIG
        df.to_crs(crs=CRS_PROJ, inplace=True)

        df['timestamp'] = df.apply(getTimeStamp, axis=1)

        grouped_df = df.drop(columns=['date', 'time']).groupby('patente').apply(fillTimes).reset_index(drop=True).groupby('patente')
        grouped_df = grouped_df.apply(fillDistances).reset_index(drop=True).drop(columns=['geometry', 'timestamp']).groupby('patente')
        grouped_df = grouped_df.apply(fillSpeeds).reset_index(drop=True).drop(columns=['dt', 'distancia', 'patente'])
        
        grouped_df.apply(saveSpeeds, axis=1)
        current_step += 1
        print('done, progress:', 100 * current_step / total_steps)
    print('total time elapsed: {time}'.format(round(time()-t0, 1)))
