import geopandas as gpd
import pandas as pd
from shapely import Point

from api.scripts.constants import current_paradas

from api.models import BusStops


def fix_crs(geodf):
    return geodf.set_crs().to_crs()


def setupBusStops(refill=False):
    if refill:
        print("emptying bus stops model for refill")
        BusStops.objects.all().delete()
    if BusStops.objects.count() > 0:
        print("bus stops models was filled, skipping")
        return

    print("setting stops")
    df = pd.read_excel(current_paradas)

    columnas_utiles = [
        "x",
        "y",
        "Código paradero TS",
        "Código  paradero Usuario",
        "Nombre Paradero",
    ]
    # nombres columnas
    df = df.rename(
        columns={
            "Varian-te": "Variante",
            "Zonas Pagas (horario de operación)": "Zonas Pagas",
        }
    )
    df = df[df.columns.intersection(columnas_utiles)]

    uniques = df.drop_duplicates(subset="Código paradero TS")
    defined_code = uniques["Código paradero TS"] != "POR DEFINIR"
    defined_x = uniques["x"] != "POR DEFINIR"
    defined_y = uniques["y"] != "POR DEFINIR"

    defined = (
        uniques[defined_code & defined_x & defined_y]
        .dropna(subset=["x", "y"], how="all")
        .reset_index()
    )
    # final = defined.to_crs()
    geoms = defined.apply(lambda row: Point(float(row["x"]), float(row["y"])), axis=1)
    # print(geoms)
    final = gpd.GeoDataFrame(
        data=defined.drop(columns=["x", "y"]), geometry=geoms, crs="epsg:5361"
    ).to_crs("EPSG:9152")
    for i in final.index:
        row = final.iloc[i, :]
        # print(i)
        object = BusStops(
            TSCode=row["Código paradero TS"],
            userCode=row["Código  paradero Usuario"],
            name=row["Nombre Paradero"],
            positionX=row["geometry"].x,
            positionY=row["geometry"].y,
        )
        object.save()
    print("stops ready")
