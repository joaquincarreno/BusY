import { useState, useEffect } from "react";
import DeckGlMap from "./modules/DeckGlMap";
import Navbar from "./modules/Navbar";
import get from "axios";
import "./App.css";

// time managment constants
const intervalMS = 8;
const loopLength = 1;
const BACKEND_IP = "http://192.168.100.17:8000/";
const BACKEND_URL = BACKEND_IP + "api/";
const ZONES_API = BACKEND_URL + "zones777/";
const GPS_API = BACKEND_URL + "gps/";
const STOPS_API = BACKEND_URL + "stops/";
const ROUTES_API = BACKEND_URL + "availableRoutes/";
const BUSES_API = BACKEND_URL + "availableBuses/";
const DIRECTIONS_API = BACKEND_URL + "availableDirections/";

const ASSETS = "./src/assets/";

class MovingBus {
  constructor(info) {
    this.coordinates = info.coords;
    const first = Date.parse(info.timestamps[0]);
    const timeRange =
      Date.parse(info.timestamps[info.timestamps.length - 1]) - first;
    this.timestamps = info.timestamps.map(
      (x) => (Date.parse(x) - first) / timeRange
    );
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
    // console.log("-  logs  -");u
  }
  updateStep(time) {
    var i = 0;
    while (time > this.timestamps[i + 1]) {
      i = i + 1;
      if (i >= this.timestamps.lenght) {
        return new Error("time out of range");
      }
    }
    if (this.currentStep != i) {
      this.currentStep = i;
    }
  }
  getRelativeTime(start, end, current) {
    end = end - start;
    current = current - start;
    return current / end;
  }
  getCurrentCoordinates(step, relativeTime) {
    const start = this.coordinates[step];
    const end = this.coordinates[step + 1];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    // console.log("getCurrentCoords: dx=", dx, "dy=", dy);
    if (dx == 0) {
      this.orientation = dy >= 0 ? Math.PI : -Math.PI;
    } else {
      this.orientation = Math.atan(dy / dx);
    }
    return [start[1] + dy * relativeTime, start[0] + dx * relativeTime];
  }
  getPosition(time) {
    this.updateStep(time);
    const step = this.currentStep;
    const relTime = this.getRelativeTime(
      this.timestamps[step],
      this.timestamps[step + 1],
      time
    );
    return this.getCurrentCoordinates(step, relTime);
  }
  getOrientation() {
    return (360 * this.orientation) / (2 * Math.PI);
  }
}

class Buses {
  constructor(busList) {
    this.dict = {};
    // console.log(busList);
    busList.forEach((b) => {
      this.dict[b.patente] = new MovingBus(b);
    });
    // console.log(this);
  }
  getBus(patente) {
    return this.dict[patente];
  }
}

function App() {
  //
  const [time, setTime] = useState(0);
  const [step, setStep] = useState(0.005);

  const [zones, setZones] = useState({});
  const [zonesReady, setZonesReady] = useState(false);

  const [movingBuses, setMovingBuses] = useState(null);

  const [gpsData, setGpsData] = useState([{}]);
  const [gpsReady, setGpsReady] = useState(false);

  const [stopsData, setStopsData] = useState([{}]);
  const [stopsReady, setStopsReady] = useState(false);

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [routesReady, setRoutesReady] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");

  const [availableBuses, setAvailableBuses] = useState([]);
  const [availableBusesReady, setAvailableBusesReady] = useState(false);

  const [availableDirections, setAvailableDirections] = useState([]);

  const [showStops, setShowStops] = useState(false);
  const [selectedBus, setSelectedBus] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");

  useEffect(() => {
    get(ZONES_API).then((response) => {
      setZones(JSON.parse(response.data));
      setZonesReady(true);
    });
  }, []);

  // available bus routes API call
  useEffect(() => {
    get(ROUTES_API).then((response) => {
      const data = response.data;
      // console.log("Routes");
      // console.log(data);
      setAvailableRoutes(data);
      setRoutesReady(true);
    });
  }, []);

  // available buses API call
  useEffect(() => {
    get(
      BUSES_API +
        selectedRoute +
        (selectedRoute != "" && selectedDirection != ""
          ? "/" + selectedDirection
          : "")
    ).then((response) => {
      const data = response.data["buses"];
      setAvailableBuses(data);
      setAvailableBusesReady(true);
    });
  }, [selectedRoute, selectedDirection]);

  // available directions API call
  useEffect(() => {
    if (selectedRoute != "" && selectedBus != "") {
      get(DIRECTIONS_API + selectedRoute + "/" + selectedBus).then(
        (response) => {
          const data = response.data["directions"];
          console.log(data);
          setAvailableDirections(data);
        }
      );
    }
  }, [selectedBus]);

  // gps API call
  useEffect(() => {
    setGpsReady(false);
    if (selectedRoute != "") {
      get(
        GPS_API +
          selectedRoute +
          (selectedBus == "" ? "" : "/" + selectedBus) +
          (selectedDirection == "" ? "" : "/" + selectedDirection)
      ).then((response) => {
        const data = response.data;
        // console.log("gps");
        // console.log(data);
        setGpsData(data);
        setMovingBuses(new Buses(data));
        setGpsReady(true);
      });
    } else {
      setGpsData([]);
      setMovingBuses([]);
      setGpsReady(true);
    }
  }, [selectedRoute, selectedBus, selectedDirection]);

  // bus stops API call
  useEffect(() => {
    get(
      STOPS_API +
        selectedRoute +
        (selectedDirection == "" ? "" : "/" + selectedDirection)
    ).then((response) => {
      const data = response.data;
      // console.log("stops");
      // console.log(data);
      setStopsData(data);
      setStopsReady(true);
    });
  }, [selectedRoute, selectedDirection]);

  const initialViewState = {
    latitude: -33.443018,
    longitude: -70.65387,
    zoom: 10,
    minZoom: 2,
    maxZoom: 15,
  };

  const [viewState, setViewState] = useState(initialViewState);

  // time passing
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t + step) % loopLength);
      // console.log(time);
    }, intervalMS);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <>
      {zonesReady &&
      gpsReady &&
      stopsReady &&
      routesReady &&
      availableBusesReady ? (
        <div
        // style={{ width: "100vw", height: "90vh", position: "relative" }}
        >
          <div>
            <Navbar
              availableRoutes={availableRoutes}
              routeSetter={setSelectedRoute}
              selectedRoute={selectedRoute}
              availableBuses={availableBuses}
              selectedBus={selectedBus}
              busSetter={setSelectedBus}
              availableDirections={availableDirections}
              selectedDirection={selectedDirection}
              directionSetter={setSelectedDirection}
              showStops={showStops}
              setShowStops={setShowStops}
              time={time}
              step={step}
              stepSetter={setStep}
            />
          </div>
          <DeckGlMap
            // staticBusData={staticBusData}
            viewState={viewState}
            viewStateSetter={setViewState}
            movingBuses={movingBuses}
            gpsData={gpsData}
            stopsData={stopsData}
            zonesData={zones}
            busMesh={ASSETS + "bus/JETSET.obj"}
            busStopMesh={ASSETS + "bus_stop/bus_stop.obj"}
            time={time}
            showStops={showStops}
          />
        </div>
      ) : (
        <div>
          <p>loading:</p>
          {!zonesReady ? <p>waiting on zones</p> : <></>}
          {!gpsReady ? <p>waiting on gps</p> : <></>}
          {!stopsReady ? <p>waiting on stops</p> : <></>}
          {!routesReady ? <p>waiting on routes</p> : <></>}
          {!zonesReady ? <p>waiting on zones</p> : <></>}
          {!availableBusesReady ? <p>waiting on available buses</p> : <></>}
        </div>
      )}
    </>
  );
}

export default App;
