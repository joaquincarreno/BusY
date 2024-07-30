from time import time

import geopandas as gpd
from shapely import Point, LineString, distance

from api.models import GPSRegistry, Routes, BusStops, DeviationScores

CRS_ORIG = "EPSG:9152"
CRS_PROJ = "EPSG:20048"


def pointListToGdf(points, data=None):

    gdf = gpd.GeoDataFrame(
        data=data, geometry=[Point(x[0], x[1]) for x in points], crs=CRS_ORIG
    )
    gdf.to_crs(CRS_PROJ, inplace=True)

    return gdf


def distanceList(gdf, line):
    return [distance(Point(x), line) for x in gdf["geometry"]]


def calculateDeviationScore(gps, stops):
    gps_df = pointListToGdf(gps)
    stops_df = pointListToGdf(stops)

    stops_line = LineString(stops_df["geometry"])
    distances = distanceList(gps_df, stops_line)
    n = len(distances)

    score = 0
    for d in distances:
        score += d / n

    return score


def objectToPoint(obj):
    return [obj.longitude, obj.latitude]


def setupDeviations(skip=True, refill=False, clear_scores=False):
    if clear_scores:
        print("purging scores")
        DeviationScores.objects.all().delete()

    if skip:
        print("skipping devations")
        return

    print("storing deviations")
    llaves = (
        GPSRegistry.objects.filter(deviation=None)
        .values_list("recorrido", "sentido")
        .distinct()
    )
    step_count = 0
    total_count = float(len(llaves)) / 100
    recorrido_count = 0
    reg_count = 0
    t0 = time()
    for r, s in llaves:
        step_count += 1
        print(r, s)
        try:
            paradas = list(
                Routes.objects.filter(serviceTSCode=r, serviceDirection=s)
                .order_by("order")
                .values_list("stop", flat=True)
            )

            for i in range(len(paradas)):
                try:
                    obj = BusStops.objects.get(id=paradas[i])
                    paradas[i] = [obj.positionX, obj.positionY]
                except:
                    print("no está la ruta completa para", r, s)
                    continue

            if not len(paradas) > 0:
                print("no hay información de paraderos para", r, s)
                continue

            rutaLine = LineString(pointListToGdf(paradas)["geometry"])

            def saveDeviationObj(row):
                row[0].deviation = distance(row["geometry"], rutaLine)
                row[0].save()

            if refill:
                gps = GPSRegistry.objects.filter(recorrido=r, sentido=s)
            else:
                gps = GPSRegistry.objects.filter(recorrido=r, sentido=s, deviation=None)

            if len(gps) == 0:
                print(r, s, "estaba listo")
            else:
                points = map(objectToPoint, gps)
                df = pointListToGdf(points, gps)
                df.apply(saveDeviationObj, axis=1)
                reg_count += len(gps)
                recorrido_count += 1
        except:
            continue
        print("progreso:", step_count / total_count, "%")
    print("recorridos con desviación:", recorrido_count)
    print("registros actualizados:", reg_count)
    print("tomó", time() - t0, "segundos")
