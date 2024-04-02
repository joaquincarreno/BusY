
from pathlib import Path

# folders
DATA_PATH = Path('./api/data')
RAW_DATA = DATA_PATH / 'raw'
PROCESSED_DATA = DATA_PATH / 'processed'

# raw data paths
zones777_file = RAW_DATA / 'Zonas777' / 'Shape' / 'Zonas777_V07_04_2014.shp'
buses_folder = RAW_DATA / 'infobuses'

# processed data paths
zones_csv_file = PROCESSED_DATA / 'zones_scl.csv'