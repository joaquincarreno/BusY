import pandas as pd
import numpy as np
from rdp import rdp
import dask.dataframe as dd
import os

from api.scripts.constants import buses_raw, buses_processed

from api.models import GPSRegistry

def filter_points(points_df):
    # print(points_df)
    puntos = list(zip(list(points_df['lon']), list(points_df['lat'])))
    mascara = rdp(puntos, epsilon=0.0001, return_mask=True)
    filtered = points_df[mascara]
    # print(points_df['patente'].iloc[0])
    print('se liberaron {} puntos para la patente {}'.format(len(points_df) - len(filtered), points_df['patente'].iloc[0]))
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
    proccessed.to_csv(buses_processed / file_name, index=False, sep=',')
    print('done')
    


def read_gps(filename, sample=False):
    print('reading', buses_processed / filename)
    gps = pd.read_csv(buses_processed / filename, sep=',')

    print(gps.columns)

    value_counts = gps['patente'].value_counts()
    min_count = 10
    # todo: debería ser cambiado a mínimo 2? o mínimo 10?
    multiple_entries = value_counts[value_counts > min_count].index

    filtered = gps[gps['patente'].isin(multiple_entries)]

    print(str(len(gps) - len(filtered)) + ' buses with less than {filter} gps entry'.format(filter=min_count))

    return filtered
from time import time
        
def setupGPSEntries(refill=False):
    if not refill:
        print('GPS not refilling')
        return
    
    print('deleting all GPS entries for refill')
    GPSRegistry.objects.all().delete()
    files=os.listdir(buses_raw)
    
    print('files to process', files)
    for f in files:
        if(not (buses_processed / f).exists()):
            print('processing', f)
            process_file(f)   
        else:
            print(f, 'already processed')     
        data = read_gps(f)
        step = 0.0
        l = len(data)
        limiter = 0.0
        progress = 0.0
        t0 = time()
        for i in data.index:
            row = data.loc[i, :]
            datetime = row['datetime'].split(' ')
            recorrido = row['recorrido']
            object = GPSRegistry(
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
                estimated_time = round((l - step) * (time() - t0) / step, 1)
                print('progress: ' + str(100 * progress) + '%, elapsed time', round(time()-t0, 1), ', estimated time until finished:', estimated_time)
                limiter += 0.005
        print('done with ' + str(f))