import numpy as np
import geopandas as gpd
import pandas as pd
from shapely import Point, LineString, distance

CRS_ORIG = 'EPSG:9152'
CRS_PROJ = 'EPSG:20048'

def calculateDeviationScore(gps, stops):
    # print(gps)
    gps_df = gpd.GeoDataFrame(geometry=[Point(x[0], x[1]) for x in gps], crs=CRS_ORIG)
    gps_df.to_crs(CRS_PROJ, inplace=True)
    stops_df = gpd.GeoDataFrame(geometry=[Point(x[0], x[1]) for x in stops], crs=CRS_ORIG)
    stops_df.to_crs(CRS_PROJ, inplace=True)
    stops_line = LineString(stops_df['geometry'])
    distances = [distance(Point(x), stops_line) for x in gps_df['geometry']]
    n = len(distances)

    score = 0
    for d in distances:
        score += d/n

    return score