import { React } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

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
  staticBusData = [],
  movingBusData = [],
  movingBuses = [],
  mesh = null,
  time = 0,
}) {
  // console.log(staticBusData);
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
    id: "static-buses",
    data: staticBusData,
    mesh: mesh,
    loaders: [OBJLoader],
    getPosition: (d) => d.coordinates,
    getColor: (d) => d.color,
    sizeScale: 50,
    visible: true,
    opacity: 0.2,
  });

  // const bus = buses[0];
  const movingBus = new SimpleMeshLayer({
    id: "moving-buses",
    data: movingBusData,
    mesh: mesh,
    loaders: [OBJLoader],

    getPosition: (d) => movingBuses[d.id].getPosition(time),

    getColor: (d) => [255 * time * time, (1 - time) * 255, 255 * time * time],
    getOrientation: (d) => {
      // console.log();
      return [0, 180 - movingBuses[d.id].getOrientation(), 90];
    },
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
