import { React, useEffect } from "react";
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
  gpsData = [],
  movingBuses = {},
  zonesData = JSON.parse([]),
  mesh = null,
  time = 0,
}) {
  // console.log(gpsData);
  // console.log("moving buses @ deckglmap");
  // console.log(movingBuses);
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

  // useEffect(() => {
  //   console.log("alo alo");
  //   console.log(movingBuses), [movingBuses];
  // });

  const zonesLayer = new GeoJsonLayer({
    id: "zones",
    data: zonesData,
    // Styles
    stroked: true,
    filled: true,
    getLineColor: [60, 60, 60],
    getFillColor: [200, 200, 200],
    getElevation: 0.1,
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

  // console.log(movingBuses);
  const movingBusLayer = new SimpleMeshLayer({
    id: "moving-buses",
    data: gpsData,
    mesh: mesh,
    loaders: [OBJLoader],

    getPosition: (d) => {
      console.log(movingBuses.dict[d.patente]);
      // console.log(d);
      return movingBuses.getBus(d.patente).getPosition(time);
    },

    getColor: (d) => [255 * time * time, (1 - time) * 255, 255 * time * time],
    // getOrientation: (d) => {
    //   // console.log();
    //   return [0, 180 - movingBuses.getBus(d.patente).getOrientation(), 90];
    // },
    sizeScale: 50,
    visible: true,
  });

  // console.log(movingBuses);

  return (
    <DeckGL
      initialViewState={viewstate}
      layers={[countriesLayer, zonesLayer, busesLayer, movingBusLayer]}
      controller={true}
    />
  );
}

export default DeckGlMap;
