import numpy as np
import geopandas as gpd
import pandas as pd
from shapely import Point, LineString, distance

CRS_ORIG = 'EPSG:9152'
CRS_PROJ = 'EPSG:20048'

def pointListToGdf(points):
    
    gdf = gpd.GeoDataFrame(geometry=[Point(x[0], x[1]) for x in points], crs=CRS_ORIG)
    gdf.to_crs(CRS_PROJ, inplace=True)

    return gdf

def distanceList(gdf, line):
    return [distance(Point(x), line) for x in gdf['geometry']]

def calculateDeviationScore(gps, stops):
    gps_df = pointListToGdf(gps)
    stops_df = pointListToGdf(stops)

    stops_line = LineString(stops_df['geometry'])
    distances = distanceList(gps_df, stops_line)
    n = len(distances)

    score = 0
    for d in distances:
        score += d/n

    return score

