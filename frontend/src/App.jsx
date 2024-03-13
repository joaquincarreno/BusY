import { useState, useEffect } from "react";
import DeckGlMap from "./modules/DeckGlMap";
import ExampleMeshMap from "./modules/ExampleMeshMap";
import "./App.css";

// time managment constants
const step = 0.001;
const intervalMS = 8;
const loopLength = 1;

class MovingBus {
  constructor(info) {
    // console.log(info);
    this.coordinates = info.steps;
    this.timestamps = info.timestamps;
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
  }
  updateStep(time) {
    var i = 0;
    while (time > this.timestamps[i + 1]) {
      i = i + 1;
      if (i >= this.timestamps.lenght) {
        return new Error("time out of range");
      }
    }
    this.currentStep = i;
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
    this.orientation = Math.atan(dx / dy);
    return [start[0] + dx * relativeTime, start[1] + dy * relativeTime];
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
    console.log(this.orientation);
    return (360 * this.orientation) / (2 * Math.PI);
  }
}

function App() {
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

  const movingBusData = [
    {
      steps: [
        [-70.64387, -33.453018],
        [-70.65387, -33.443018],
        [-70.66387, -33.443018],
        [-70.65387, -33.433018],
      ],
      timestamps: [0, 0.4, 0.9, 1],
      id: 0,
    },
    // { start: [0, 0], end: [0, 0] },
  ];
  const movingBus = new MovingBus(movingBusData[0]);
  const viewState = {
    latitude: -33.443018,
    longitude: -70.65387,
    zoom: 14,
    minZoom: 2,
    maxZoom: 15,
  };
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t + step) % loopLength);
    }, intervalMS);

    return () => clearInterval(interval);
  }, []);

  const exampleData =
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json";

  const bunnyMesh = "./src/assets/bunny.obj";
  const busMesh = "./src/assets/bus/JETSET.obj";
  const exampleMesh =
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj";

  return (
    <>
      {/*style={{ width: "100vw", height: "90vh", position: "relative" }}*/}
      <div>
        <DeckGlMap
          staticBusData={staticBusData}
          movingBuses={[movingBus]}
          movingBusData={movingBusData}
          mesh={busMesh}
          viewstate={viewState}
          time={time}
        />
      </div>
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
