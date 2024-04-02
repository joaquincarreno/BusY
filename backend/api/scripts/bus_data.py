import geopandas as gpd
import pandas as pd
import numpy as np
from shapely import Point

from api.scripts.constants import buses_folder

def read_buses(date, sample=False):
    if sample:
        df = pd.read_csv(buses_folder / 'sample.gps.csv', sep=';')
    else:
        df = pd.read_csv(buses_folder / (date + '.gps.csv'))

    return df
        
def setup_buses(model):
    if len(model.objects.all()) > 0:
        return
    data = read_buses('', sample=True)
    for i in data.index:
        row = data.iloc[i, :]
        datetime = row['datetime'].split(' ')
        object = model(
            patente = row['patente'],
            recorrido = row['recorrido'],
            date = datetime[0],
            time = datetime[1],
            latitude = row['lat'], 
            longitud = row['lon'],
        )
        object.save()