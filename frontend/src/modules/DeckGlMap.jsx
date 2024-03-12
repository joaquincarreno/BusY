import { React } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
// import { Interpolator } from "../utils/Interpolator";

function spaceInterpolator(start, end, time) {
  return [
    start[0] + (end[0] - start[0]) * time,
    start[1] + (end[1] - start[1]) * time,
  ];
}

function getRelativeTime(start, end, current) {
  end = end - start;
  current = current - start;
  return current / end;
}

// steps = [coord1, coord2, coord3]
// timestamps = [0, 0.4, 1]
// time = 0.5
function Interpolator(steps, timestamps, time) {
  // console.log(steps);
  // console.log(timestamps);
  var i = 0;
  while (time > timestamps[i + 1]) {
    i = i + 1;
    if (i >= timestamps.lenght) {
      return new Error("time out of range");
    }
  }
  console.log(i);
  const relTime = getRelativeTime(timestamps[i], timestamps[i + 1], time);
  return spaceInterpolator(steps[i], steps[i + 1], relTime);
}

// export default Interpolator;
// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: -33.443018,
  longitude: -70.65387,
  zoom: 11,
  minZoom: 2,
  maxZoom: 15,
  // zoom: 11,
  // maxZoom: 20,
  // pitch: 30,
  // bearing: 0,
  // longitude: -122.4,
  // latitude: 37.74,
};

function DeckGlMap({
  viewstate = INITIAL_VIEW_STATE,
  busData = [],
  mesh = null,
  time = 0,
}) {
  // console.log(busData);
  const countriesLayer = new GeoJsonLayer({
    id: "countries",
    data: COUNTRIES,
    // Styles
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    opacity: 0.4,
    getLineColor: [60, 60, 60],
    getFillColor: [200, 200, 200],
  });

  const busesLayer = new SimpleMeshLayer({
    id: "buses",
    data: busData,
    mesh: mesh,
    loaders: [OBJLoader],
    getPosition: (d) => d.coordinates,
    getColor: (d) => d.color,
    // getScale: (d) => [10, 10, 10],
    sizeScale: 50,
    visible: true,
    opacity: 0.2,
  });

  const intData = [
    {
      steps: [
        [-70.65387, -33.443018],
        [-70.66387, -33.443018],
        [-70.65387, -33.433018],
      ],
      timestamps: [0, 0.4, 1],
    },
    // { start: [0, 0], end: [0, 0] },
  ];
  const movingBus = new SimpleMeshLayer({
    id: "movingBus",
    // data: busData,
    data: intData,
    mesh: mesh,
    loaders: [OBJLoader],

    // getPosition: (d) => [d.start[0], d.start[1] + 0.1 * time],
    getPosition: (d) => {
      // console.log(d);
      return Interpolator(d.steps, d.timestamps, time);
    },
    getColor: (d) => [255, (1 - time) * 255, 255 * time],
    sizeScale: 50,
    visible: true,
  });

  return (
    <DeckGL
      initialViewState={viewstate}
      layers={[countriesLayer, busesLayer, movingBus]}
      controller={true}
    />
  );
}

export default DeckGlMap;
