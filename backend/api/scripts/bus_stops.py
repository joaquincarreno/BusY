import geopandas as gpd
import pandas as pd
import numpy as np
from shapely import Point
from rdp import rdp
import dask.dataframe as dd
import os

from api.scripts.constants import RAW_DATA



def setupBusStops(model):
    if(len(model.objects.all()) != 0):
        return
    df = pd.read_excel(RAW_DATA / 'paraderos_2018-1.xlsx')
    uniques = df.drop(columns=[
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
        'Paradas con Excepciones']).drop_duplicates(subset='Código paradero TS')
    for i in uniques.index:
        row = uniques.iloc[i, :]
        object = model(
            TSCode=row['Código paradero TS'],
            userCode=row['Código  paradero Usuario'],
            name=row['Nombre Paradero'],
            positionX=row['x'],
            positionY=row['y']
        )
        object.save()