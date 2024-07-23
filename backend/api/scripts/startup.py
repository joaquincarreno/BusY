from api.scripts.zones import setUpZones
from api.scripts.bus_data import setupGPSEntries
from api.scripts.bus_stops import setupBusStops
from api.scripts.bus_routes import setupRoutes
from api.scripts.deviation_score import setupDeviations
from api.scripts.speeds import setupSpeeds


def run():
    setUpZones()

    setupGPSEntries(refill=False)
    print()

    setupBusStops(refill=False)
    print()

    setupRoutes(refill=False)
    print()
    
    setupDeviations(skip=True, refill=False, clear_scores=False)
    print()

    setupSpeeds(skip=True, force=False)
    print()

    print('[startup.py] scripts run succesfully')
    print()