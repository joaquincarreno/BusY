import { useState, useEffect, useRef } from "react";
import DeckGlMap from "./modules/DeckGlMap";
import get from "axios";
import "./App.css";

// time managment constants
const step = 0.003;
const intervalMS = 8;
const loopLength = 1;

const BACKEND_URL = "http://0.0.0.0:8000/api/";
const ZONES_API = BACKEND_URL + "zones777/";
const GPS_API = BACKEND_URL + "gps/";

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
    this.orientation = Math.atan(dy / dx);
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
    // console.log(this.orientation);
    return (360 * this.orientation) / (2 * Math.PI);
  }
}
// const bunnyMesh = "./src/assets/bunny.obj";
// const exampleData =
//   "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json";
// const exampleMesh =
//   "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj";

class Buses {
  constructor(busList) {
    this.dict = {};
    console.log(busList);
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
  const [time, setTime] = useState(0);
  const timeRef = useRef(time);
  const [zones, setZones] = useState({});
  const [gpsData, setGpsData] = useState([{}]);
  // const [apiData, setApiData] = useState([{}]);
  const [movingBuses, setMovingBuses] = useState(null);
  const [zonesReady, setZonesReady] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);

  useEffect(() => {
    get(ZONES_API).then((response) => {
      setZones(JSON.parse(response.data));
      setZonesReady(true);
    });
  }, []);
  // CJRR-25    35
  // CJRB-69    35
  // BJFD-98    35
  // FLXK-24    35
  // BKXV-89    35

  useEffect(() => {
    get(GPS_API + "BKXV-89").then((response) => {
      const data = response.data;
      // console.log(data);
      setGpsData(data);
      setMovingBuses(new Buses(data));
      setGpsReady(true);
    });
  }, []);

  useEffect(() => {
    console.log("holaa");
    console.log(movingBuses);
  }, [movingBuses]);

  const staticBusData = [
    {
      coordinates: [-70.65387, -33.443018],
      color: [255, 1, 1],
      scale: [1, 1, 1],
    },
    {
      coordinates: [-70.66387, -33.443018],
      color: [1, 255, 1],
      scale: [10, 10, 10],
    },
    {
      coordinates: [-70.65387, -33.433018],
      color: [1, 1, 255],
      scale: [100, 100, 100],
    },
  ];
  const viewState = {
    latitude: -33.443018,
    longitude: -70.65387,
    zoom: 11,
    minZoom: 2,
    maxZoom: 15,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t + step) % loopLength);
    }, intervalMS);

    return () => clearInterval(interval);
  }, []);

  const busMesh = "./src/assets/bus/JETSET.obj";

  return (
    <>
      {zonesReady && gpsReady ? (
        <div
        // style={{ width: "100vw", height: "90vh", position: "relative" }}
        >
          <DeckGlMap
            staticBusData={staticBusData}
            movingBuses={movingBuses}
            gpsData={gpsData}
            zonesData={zones}
            mesh={busMesh}
            viewstate={viewState}
            time={time}
          />
        </div>
      ) : (
        <p>loading</p>
      )}
      {/* <div style={{ width: "100%", marginTop: "1.5rem" }}>
        <input
          style={{ width: "100%" }}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
          }}
        />
      </div> */}
    </>
  );
}

export default App;
