import pandas as pd

from api.scripts.constants import RAW_DATA

def load_data():
    df = pd.read_excel(RAW_DATA / 'paraderos_2018-1.xlsx', dtype={'Orden\\nCirc.': int, 'Código TS': str, 'Variante': str, 'Sentido Servicio': str})

    # nonmbres columnas
    df = df.rename(columns={'Varian-te': 'Variante'})

    # eliminamos paradas con datos faltantes 
    defined_code = df['Código paradero TS'] != 'POR DEFINIR'
    defined_x = df['x'] != 'POR DEFINIR'
    defined_y = df['y'] != 'POR DEFINIR'
    df = df[defined_code & defined_y & defined_x]

    # arreglar mayúsculas
    df['Sentido Servicio'] = df['Sentido Servicio'].apply(lambda x: x if x != 'ida' else 'Ida')

    # llenamos los vacíos con un string vacío
    df['Variante'] = df['Variante'].fillna('-')
    return df

    

ALLREADY_FILLED = False

def setupRoutes(model, refill = False):
    global ALLREADY_FILLED

    if(not ALLREADY_FILLED and refill):
        model.objects.all().delete()
    elif(len(model.objects.all()) > 0):
        return

    df = load_data()

    def fill_model(row):
        object = model(
            serviceUserCode = row['Código Usuario'],
            serviceTSCode = row['Código TS'],
            serviceDirection = row['Sentido Servicio'],
            order =  row['Orden\nCirc.'],
            variant =  row['Variante'],
        )
        object.save()
    print('Filling the Stops model')
    df.apply(fill_model, axis=1)
    print('Stops model filled with ', len(model.objects.all()), ' stops.')
    ALLREADY_FILLED = True