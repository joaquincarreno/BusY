import pandas as pd

from api.scripts.constants import current_paradas

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

    

ALLREADY_FILLED = False

def setupRoutes(routeModel, stopsModel, empty_and_refill = False):
    global ALLREADY_FILLED

    if(not ALLREADY_FILLED and empty_and_refill):
        routeModel.objects.all().delete()
    elif(len(routeModel.objects.all()) > 0):
        return


    def fill_model(row):
        try:
            stop = stopsModel.obje.get(TSCode=row['Código paradero TS'])
            object = routeModel(
                stop = stop,
                serviceTSCode = row['Servicio TS'],
                serviceDirection = row['Sentido Servicio'],
                order =  row['Orden'],
                variant =  row['Variante'],
            )
            object.save()
        except stopsModel.DoesNotExist:
            print('Stop {ts_code} not found'.format(ts_code=row['Código paradero TS']))
        except stopsModel.MultipleObjectsReturned:
            print('Multiples stops found with the TS code {ts_code}'.format(ts_code=row['Código paradero TS']))

    print('Filling the Stops routeModel')
    df = load_data()
    df.apply(fill_model, axis=1)
    print('Stops routeModel filled with ', len(routeModel.objects.all()), ' stops.')
    ALLREADY_FILLED = True
    