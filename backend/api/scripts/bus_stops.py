import geopandas as gpd
import pandas as pd
import numpy as np
from shapely import Point
from rdp import rdp
import dask.dataframe as dd
import os

from api.scripts.constants import RAW_DATA


df = pd.read_excel(RAW_DATA / 'paraderos_2018-1.xlsx')


geom =  df.apply(lambda row: Point(row['x'], row['y']), axis=1)
geopd = gpd.GeoDataFrame(data=df.drop(columns=[
    'x', 
    'y', 
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
    'Paradas con Excepciones'
    ]), geometry=geom, crs='epsg:5361')
uniques = 