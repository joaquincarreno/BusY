# scripts para preprocesar los csv así no pesan tanto
# este código serán refactorizaciones de los notebooks

import numpy as np
import pandas as pd
import geopandas as gpd
import dask.dataframe as dd
from pathlib import Path
from rdp import rdp
from os import listdir, chdir
from sys import argv

DATA_DIR = Path('./backend/api/data')
RAW_DATA = DATA_DIR / 'raw'
PROCESSED_DATA = DATA_DIR / 'processed'
RAW_BUSES = RAW_DATA / 'buses'
SPLIT_FOLDER = RAW_BUSES / 'splitted'

file_name = argv[1]

def filter_points(points_df):
    # print(points_df)
    puntos = list(zip(list(points_df['lat']), list(points_df['lon'])))
    mascara = rdp(puntos, epsilon=0.0001, return_mask=True)
    filtered = points_df[mascara]
    # print('se liberaron {} puntos para la patente {}'.format(len(points_df) - len(filtered), points_df['patente']))
    if(len(filtered) > 2):
        return filtered
    else:
        return pd.DataFrame(data=None, columns=points_df.columns)




df = dd.read_csv(RAW_DATA / 'buses' / file_name, sep=';') #meta = (str, str, str, float, float))
df['id'] = df['patente'] + '---' + df['recorrido']
df = df.drop(columns=['nose', 'nose1', 'nose2', 'nose3','nose4']).replace(' ', np.nan).dropna()

proccessed = df.groupby('id').apply(filter_points).drop(columns=['id']).compute()
proccessed.to_csv(PROCESSED_DATA / 'buses' / file_name)  
