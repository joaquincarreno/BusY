from api.models import GPSRegistry, BusStops, Routes
from api.scripts.zones import setUpZones
from api.scripts.bus_data import setupGPSEntries
from api.scripts.bus_stops import setupBusStops
from api.scripts.bus_routes import setupRoutes


def run():
    setUpZones()
    setupGPSEntries(GPSRegistry)
    setupBusStops(BusStops)
    setupRoutes(Routes, BusStops)
    print()
    print('[startup.py] scripts run succesfully')
    print()