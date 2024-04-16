import geopandas as gpd
import pandas as pd
import numpy as np
from shapely import Point
from rdp import rdp
import dask.dataframe as dd
import os

from api.scripts.constants import buses_raw, buses_processed, buses_sample

def filter_points(points_df):
    # print(points_df)
    puntos = list(zip(list(points_df['lat']), list(points_df['lon'])))
    mascara = rdp(puntos, epsilon=0.0001, return_mask=True)
    filtered = points_df[mascara]
    print('se liberaron {} puntos para la patente {}'.format(len(points_df) - len(filtered), points_df['patente'][0]))
    if(len(filtered) > 2):
        return filtered
    else:
        return pd.DataFrame(data=None, columns=points_df.columns)


def process_file(file_name):
    ddf = dd.read_csv(buses_raw / file_name, sep=';')
    ddf = ddf.drop(columns=['nose', 'nose1', 'nose2', 'nose3','nose4']).replace(' ', np.nan).dropna()
    ddf['id'] = ddf['patente']+'-:-'+ddf['recorrido']
    # print(len(ddf))
    proccessed = ddf.groupby('id').apply(filter_points).drop(columns=['id']).compute()
    proccessed.to_csv(buses_processed / file_name)
    print('done')
    


def read_buses(date, sample=False):
    # if sample:
    #     return pd.read_csv(buses_processed / 'sample.gps.csv', sep=';')
    return pd.read_csv(buses_raw / date, sep=';')

        
def setup_buses(model):
    if len(model.objects.all()) > 0:
        return
    files=os.listdir(process_file)
    print(files)
    for f in files:
        if(not (process_file / f).exists()):
            process_file(f)        
        data = read_buses(f)
        for i in data.index:
            row = data.iloc[i, :]
            datetime = row['datetime'].split(' ')
            object = model(
                patente = row['patente'],
                recorrido = row['recorrido'],
                date = datetime[0],
                time = datetime[1],
                latitude = row['lat'], 
                longitude = row['lon'],
            )
            object.save() 