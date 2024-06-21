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
    


def read_gps(date, sample=False):
    # if sample:
    #     return pd.read_csv(buses_processed / 'sample.gps.csv', sep=';')
    gps = pd.read_csv(buses_raw / date, sep=';')

    value_counts = gps['patente'].value_counts()
    multiple_entries = value_counts[value_counts > 1].index

    filtered = gps[gps['patente'].isin(multiple_entries)]

    print(str(len(gps) - len(filtered)) + ' buses with single gps entry')

    return filtered

        
def setupGPSEntries(model, fill=False):
    # model.objects.all().delete()
    if not fill:
        return
    files=os.listdir(buses_raw)
    print(files)
    for f in files:
        if(not (buses_processed / f).exists()):
            print('processing ' + f)
            process_file(f)   
        else:
            print(f + ' already processed')     
        data = read_gps(f)
        step = 0.0
        l = len(data)
        limiter = 0.0
        progress = 0.0
        for i in data.index:
            row = data.iloc[i, :]
            datetime = row['datetime'].split(' ')
            recorrido = row['recorrido']
            object = model(
                patente = row['patente'],
                recorrido = recorrido.split(' ')[0],
                sentido = recorrido[-1],
                date = datetime[0],
                time = datetime[1],
                latitude = row['lat'], 
                longitude = row['lon'],
            )
            object.save() 
            step+=1
            progress = step / l
            if(progress > limiter):
                print('progress: ' + str(progress) + '%')
                limiter += 0.01
        print('done with ' + str(f))