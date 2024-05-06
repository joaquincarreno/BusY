import { React, useEffect } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: -33.443018,
  longitude: -70.65387,
  zoom: 7,
  minZoom: 2,
  maxZoom: 15,
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
  // console.log(time);
  // console.log("moving buses @ deckglmap");
  // console.log(movingBuses);

  // console.log(movingBuses.getBus("CJRR-25").getPosition(time));
  // console.log(movingBuses.getBus("BKXV-89").coordinates);
  // console.log(time);

  const getPosition = (d) => {
    {
      // console.log(movingBuses.dict[d.patente]);
      // console.log(d);
      console.log("holaa");
      console.log(d.patente);
      console.log(time);

      return movingBuses.getBus(d.patente).getPosition(time);
    }
  };

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

  const osmMapLayer = new TileLayer({
    id: "TileLayer",
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    minZoom: 0,

    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
    pickable: true,
  });

  // console.log(movingBuses);
  const movingBusLayer = new SimpleMeshLayer({
    id: "moving-buses",
    data: gpsData,
    mesh: mesh,
    loaders: [OBJLoader],

    getPosition: (d) => {
      {
        console.log("holaa");
        console.log(d.patente);
        console.log(time);

        return movingBuses.getBus(d.patente).getPosition(time);
      }
    },

    getColor: (d) => [255 * time * time, (1 - time) * 255, 255 * time * time],
    getOrientation: (d) => {
      return [0, movingBuses.getBus(d.patente).getOrientation(), 90];
    },
    sizeScale: 50,
    visible: true,
    updateTriggers: {
      getPosition: [time],
      getColor: [time],
      getOrientation: [time],
    },
  });

  // console.log(movingBuses);

  return (
    <DeckGL
      initialViewState={viewstate}
      layers={[osmMapLayer, busesLayer, movingBusLayer]}
      controller={true}
    />
  );
}

export default DeckGlMap;
