import { useState } from "react";
import DeckGlMap from "./modules/DeckGlMap";
import ExampleMeshMap from "./modules/ExampleMeshMap";
import "./App.css";

function App() {
  const data = [
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

  const exampleViewState = {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    maxZoom: 20,
    pitch: 30,
    bearing: 0,
  };
  const viewState = {
    latitude: -33.443018,
    longitude: -70.65387,
    zoom: 11,
    minZoom: 2,
    maxZoom: 15,
  };
  const [time, setTime] = useState(0);

  const exampleData =
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json";

  const bunnyMesh = "./src/assets/bunny.obj";
  const busMesh = "./src/assets/bus_mesh/BUS.obj";
  const exampleMesh =
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj";

  return (
    <>
      <div style={{ width: "100vw", height: "90vh", position: "relative" }}>
        <DeckGlMap
          busData={data}
          mesh={exampleMesh}
          viewstate={viewState}
          time={time}
        />
      </div>
      <div style={{ width: "100%", marginTop: "1.5rem" }}>
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
      </div>
    </>
  );
}

export default App;
