import pandas as pd

from api.scripts.constants import current_paradas

from api.models import Routes, BusStops

def load_data():
    df = pd.read_excel(current_paradas, dtype={'Orden': int, 'Código TS': str, 'Variante': str, 'Sentido Servicio': str})

    # nonmbres columnas
    df = df.rename(columns={'Varian-te': 'Variante', 'Zonas Pagas (horario de operación)': 'Zonas Pagas'})

    # eliminamos paradas con datos faltantes 
    defined_code = df['Código paradero TS'] != 'POR DEFINIR'
    defined_x = df['x'] != 'POR DEFINIR'
    defined_y = df['y'] != 'POR DEFINIR'
    df = df[defined_code & defined_y & defined_x]

    # arreglar mayúsculas
    df['Sentido Servicio'] = df['Sentido Servicio'].apply(lambda x: x if x != 'ida' else 'Ida')

    # llenamos los vacíos con un string vacío
    df['Variante'] = df['Variante'].fillna('')

    return df

def setupRoutes(refill = False):

    if(refill):
        Routes.objects.all().delete()
        print('deleted all route data')

    if(len(Routes.objects.all()) > 0):
        print('routes model was filled, skipping')
        return
    else:
        print('routes model was empty')


    def fill_model(row):
        try:
            stop = BusStops.objects.get(TSCode=row['Código paradero TS'])
            object = Routes(
                stop = stop,
                serviceTSCode = row['Servicio TS'],
                serviceDirection = row['Sentido Servicio'],
                order = row['Orden'],
                variant = row['Variante'],
            )
            object.save()
        except BusStops.DoesNotExist:
            print('Stop {ts_code} not found'.format(ts_code=row['Código paradero TS']))
        except BusStops.MultipleObjectsReturned:
            print('Multiples stops found with the TS code {ts_code}'.format(ts_code=row['Código paradero TS']))

    print('Filling the Route model')
    df = load_data()
    df.apply(fill_model, axis=1)
    print('models.Routes filled with ', len(Routes.objects.all()), ' stops.')
    