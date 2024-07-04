import { React, useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, BitmapLayer } from "@deck.gl/layers";

import { IconLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

function DeckGlMap({
  viewState,
  viewStateSetter = () => {},
  movingBuses = {},
  stopsData = JSON.parse([]),
  busMesh = null,
  time = 0,
  showStops = true,
}) {
  const [scale, setScale] = useState(1);
  const onViewStateChange = ({ viewState, interactionState, oldViewState }) => {
    // console.log("viewState changed: ", viewState);
    viewStateSetter(viewState);
    setScale((viewState.zoom - 2) / 13);
    // console.log(viewState.zoom);
  };

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

  const stopsLayer = new IconLayer({
    id: "IconLayer",
    data: stopsData["stops"],
    getColor: (d) => {
      const s = d.direction;
      if (s == "I") {
        return [255, 80, 80];
      } else if (s == "R") {
        return [80, 80, 255];
      } else {
        return [80, 255, 80];
      }
    },
    getIcon: (d) => "marker",
    getPosition: (d) => {
      // console.log(d);
      return [d.positionX, d.positionY];
    },
    getSize: (d) => {
      // console.log("updated size");
      return 50 - 25 * scale;
    },
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json",
    pickable: true,

    visible: showStops,

    updateTriggers: {
      getSize: [scale],
    },
  });

  // console.log(gpsData);
  // console.log(movingBuses);
  const movingBusLayer = new SimpleMeshLayer({
    id: "moving-buses",
    data: Object.keys(movingBuses.dict),
    mesh: busMesh,
    loaders: [OBJLoader],
    getPosition: (d) => {
      // console.log(d);
      // console.log(movingBuses);
      const bus = movingBuses.getBus(d);
      // console.log(bus);
      if (bus) {
        return bus.getPosition();
      } else {
        console.log("patente", d, "no fue encontrado entre", movingBuses.dict);
        return [0, 0];
      }
    },

    getColor: (d) => {
      const bus = movingBuses.getBus(d);
      return bus.getColor();
    },
    getOrientation: (d) => {
      const bus = movingBuses.getBus(d);
      return [0, bus.getOrientation(), 90];
    },
    getScale: (d) => {
      const s = 120 - 60 * scale;
      // console.log("scale updated", s);
      return [s, s, s];
    },
    visible: true,
    updateTriggers: {
      getPosition: [time],
      getColor: [time],
      getOrientation: [time],
      getScale: [scale],
    },
  });

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={[osmMapLayer, movingBusLayer, stopsLayer]}
      controller={true}
    />
  );
}

export default DeckGlMap;
