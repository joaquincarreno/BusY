import "./App.css";
import DeckGlMap from "./modules/DeckGlMap";
import Navbar from "./modules/Navbar";
import get from "axios";
import Buses from "./classes/Buses";
import Leyend from "./modules/Leyend";

import { useState, useEffect } from "react";

// time managment constants
// const intervalMS = 8;
// const loopLength = 1;
// const BACKEND_IP = "http://localhost:8000/";
const BACKEND_IP = "http://192.168.100.17:8000/";
const API_URL = BACKEND_IP + "api/";
const GPS_API = API_URL + "gps/";
const STOPS_API = API_URL + "stops/";
const ROUTES_API = API_URL + "availableRoutes/";
const BUSES_API = API_URL + "availableBuses/";
const DIRECTIONS_API = API_URL + "availableDirections/";

const ASSETS = "./src/assets/";

function App() {
  //
  const [time, setTime] = useState(0);
  const [resetTime, setResetTime] = useState(false);
  const [step, setStep] = useState(5);
  const intervalMS = 10;

  const [firstDate, setFirstDate] = useState("1970/01/01");
  const [lastDate, setLastDate] = useState("3000/01/01");

  const [loopLength, setLoopLenght] = useState(
    (new Date(lastDate) - new Date(firstDate)) / 1000
  );

  const [gpsData, setGpsData] = useState([]);
  const [gpsReady, setGpsReady] = useState(false);

  const [movingBuses, setMovingBuses] = useState(() => new Buses(gpsData));

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

  const [deviationsAvailable, setDeviationsAvailable] = useState(false);

  const [colorMode, setColorMode] = useState(0);
  const [heatMapOption, setHeatMapOption] = useState(0);

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
    } else {
      setAvailableDirections([]);
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
        console.log("[GPS data]", data);
        setGpsData(data);
        if (data.length == 0) {
          alert(
            "No hay datos GPS para " +
              selectedRoute +
              " " +
              selectedBus +
              " " +
              selectedDirection
          );
        }
      });
      setGpsReady(true);
    }
    setGpsReady(true);
  }, [selectedRoute, selectedBus, selectedDirection]);

  useEffect(() => {
    if (selectedRoute != "") {
      const newBuses = new Buses(gpsData);
      console.log(
        "[gps api call] updating movingBuses with new gps data",
        newBuses
      );
      setMovingBuses(newBuses);
      setFirstDate(newBuses.earliestTimeStamp);
      setLastDate(newBuses.latestTimeStamp);
      setLoopLenght(newBuses.timeRange / 1000);
      console.log("[gps api call] created buses, logging data");
      console.log("data step count:", newBuses.totalSteps);
      console.log("time start", newBuses.earliestTimeStamp);
      console.log("time end", newBuses.latestTimeStamp);
      console.log("loop lenght", newBuses.timeRange / 1000);
    }
  }, [gpsData]);

  // bus stops API call
  useEffect(() => {
    const url =
      STOPS_API +
      selectedRoute +
      (selectedDirection == "" ? "" : "/" + selectedDirection);
    // console.log("[get stops]", url);
    // console.log("[get stops]", availableDirections);
    get(url).then((response) => {
      const data = response.data;
      // console.log("stops");
      // console.log(data);
      setStopsData(data);
      setStopsReady(true);
    });
  }, [selectedRoute, selectedDirection]);

  // check deviations available
  useEffect(() => {
    setDeviationsAvailable(movingBuses.allBusesHaveDeviation);
  }, [movingBuses]);

  const initialViewState = {
    latitude: -33.443018,
    longitude: -70.65387,
    zoom: 10,
    minZoom: 2,
    maxZoom: 15,
  };

  const [viewState, setViewState] = useState(initialViewState);

  useEffect(() => {
    if (selectedBus != "" && movingBuses.getBus(selectedBus)) {
      const bus = movingBuses.getBus(selectedBus);
      const coords = bus.getPosition();
      const bearing = bus.getOrientation();
      setViewState({
        latitude: coords[1],
        longitude: coords[0],
        zoom: viewState.zoom,
        minZoom: 12,
        maxZoom: 15,
        pitch: 50,
        bearing: 180 - bearing,
      });
    }
  }, [time]);

  const [pause, setPause] = useState(true);

  // time passing
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        setTime((t) => {
          if (resetTime) {
            t = 0;
            setResetTime(false);
          }
          // console.log("[time management]");
          // console.log("time", t);
          // console.log("loopLenght", loopLength);
          return (t + step) % loopLength;
        });
      }
      // console.log(time);
    }, intervalMS);
    return () => clearInterval(interval);
  }, [step, pause, resetTime]);

  useEffect(() => {
    movingBuses.updateBuses(time, colorMode);
  }, [time]);

  return (
    <>
      {gpsReady && stopsReady && routesReady && availableBusesReady ? (
        <div
        // style={{ width: "100vw", height: "90vh", position: "relative" }}
        >
          <div>
            <Navbar
              routeProp={{
                selectedRoute: selectedRoute,
                availableRoutes: availableRoutes,
                routeSetter: setSelectedRoute,
              }}
              busesProp={{
                selectedBus: selectedBus,
                availableBuses: availableBuses,
                busSetter: setSelectedBus,
              }}
              directionsProp={{
                availableDirections: availableDirections,
                selectedDirection: selectedDirection,
                directionSetter: setSelectedDirection,
              }}
              stopsProp={{
                showStops: showStops,
                setShowStops: setShowStops,
                stopCount: stopsData["stops"].length,
              }}
              timeControlProp={{
                time: time,
                timeResetter: setResetTime,
                firstTimeStamp: firstDate,
                lastTimeStamp: lastDate,
                step: step,
                stepSetter: setStep,
                pause: pause,
                pauseSetter: setPause,
              }}
              visControlProp={{
                colorMode: colorMode,
                colorModeSetter: setColorMode,
                deviationsAvailable: deviationsAvailable,
                heatMapOption: heatMapOption,
                heatMapOptionSetter: setHeatMapOption,
              }}
            />
          </div>
          <DeckGlMap
            renderProp={{
              viewState: viewState,
              viewStateSetter: setViewState,
              time: time,
              showStops: showStops,
            }}
            dataProp={{
              movingBuses: movingBuses,
              stopsData: stopsData["stops"],
              busMesh: ASSETS + "bus/JETSET.obj",
              deviationsAvailable: deviationsAvailable,
              heatMapOption: heatMapOption,
            }}
          />
          <Leyend />
        </div>
      ) : (
        <div>
          <p>loading:</p>
          {!gpsReady ? <p>waiting on gps</p> : <></>}
          {!stopsReady ? <p>waiting on stops</p> : <></>}
          {!routesReady ? <p>waiting on routes</p> : <></>}
          {!availableBusesReady ? <p>waiting on available buses</p> : <></>}
        </div>
      )}
    </>
  );
}

export default App;
