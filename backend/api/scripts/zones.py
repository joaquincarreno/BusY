import geopandas as gpd
from api.scripts.constants import zones777_file, zones_csv_file

def setUpZones():
    if not zones_csv_file.exists():
        if zones777_file.exists():
            zones = gpd.read_file(zones777_file)
            zones.to_file(zones_csv_file, driver="GeoJSON")
        else:
            Exception('zones777 file not found')

def getZonesGdf():
    return gpd.read_file(zones_csv_file)