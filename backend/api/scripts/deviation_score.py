import numpy as np
import geopandas as gpd
import pandas as pd
from shapely import Point, LineString, distance

def calculateDeviationScore(gps, stops):
    stops_line = LineString(stops)
    distances = [distance(Point(x), stops_line) for x in gps]
    n = len(distances)

    score = 0
    for d in distances:
        score += d/n

    return score