import geopandas as gpd
import pandas as pd
import numpy as np
from shapely import Point
from rdp import rdp
import dask.dataframe as dd
import os

from api.scripts.constants import RAW_DATA

def fix_crs(geodf):
    return geodf.set_crs().to_crs()

def setupBusStops(model):
    # model.objects.all().delete()
    if(len(model.objects.all()) != 0):
        return
    print('setting stops')
    df = pd.read_excel(RAW_DATA / 'paraderos_2018-1.xlsx').drop(columns=[
        'Orden\nCirc.',
        'Sentido Servicio',
        'Varian-te',
        'UN',
        'Código TS',
        'Código Usuario',
        'Comuna',
        'Eje',
        'Desde ( Cruce 1)',
        'Hacia ( Cruce 2)',
        'Operación con Zona Paga',
        'Paradas con Excepciones'])
    uniques = df.drop_duplicates(subset='Código paradero TS')
    defined_code = uniques['Código paradero TS'] != 'POR DEFINIR'
    defined_x = uniques['x'] != 'POR DEFINIR'
    defined_y = uniques['y'] != 'POR DEFINIR'

    defined = uniques[defined_code & defined_x & defined_y].dropna(subset=['x', 'y'], how='all').reset_index()
    # final = defined.to_crs()
    geoms = defined.apply(lambda row: Point(float(row['x']), float(row['y'])), axis=1)
    # print(geoms)
    final = gpd.GeoDataFrame(data=defined.drop(columns=['x', 'y']), geometry=geoms, crs='epsg:5361').to_crs('EPSG:9152')
    for i in final.index:
        row = final.iloc[i, :]
        # print(i)
        object = model(
            TSCode=row['Código paradero TS'],
            userCode=row['Código  paradero Usuario'],
            name=row['Nombre Paradero'],
            positionX=row['geometry'].x,
            positionY=row['geometry'].y
        )
        object.save()
    print('stops ready')