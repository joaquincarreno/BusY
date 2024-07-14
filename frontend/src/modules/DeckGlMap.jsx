import { React, useState } from "react";

import { DeckGL } from "@deck.gl/react";
import { BitmapLayer, IconLayer, LineLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

import { OBJLoader } from "@loaders.gl/obj";

const createStopsLines = (stops) => {
  const n = stops.length;
  const data = new Array(n - 2);
  var i = 0;
  var sep = 0;
  var prev = 0;
  // pasamos por todas las stops menos la última, que se agrega con la penúltima
  while (i < n - 1) {
    // caso terminamos un sentido: reiniciamos el paso previo
    if (prev > stops[i].order) {
      sep = 1;
      prev = 0;
    } else {
      data[i - sep] = {
        from: [stops[i].positionX, stops[i].positionY],
        to: [stops[i + 1].positionX, stops[i + 1].positionY],
        color:
          stops[i].direction == "I"
            ? [255, 80, 80]
            : stops[i].direction == "R"
            ? [80, 80, 255]
            : [80, 255, 80],
      };
      prev = stops[i].order;
    }
    i += 1;
  }
  return data;
};

function DeckGlMap({
  viewState,
  viewStateSetter = () => {},
  movingBuses = {},
  stopsData = JSON.parse([]),
  busMesh = null,
  time = 0,
  showStops = true,
  deviationsAvailable = false,
}) {
  const [scale, setScale] = useState(1);
  const patentes = movingBuses.patentes;

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
    pickable: false,
  });

  const routeLines = stopsData[0].order
    ? createStopsLines(stopsData)
    : [{ from: [0, 0], to: [0, 0], color: [0, 0, 0] }];

  console.log(routeLines);

  const routesLayer = new LineLayer({
    id: "routes-layer",
    data: routeLines,

    getColor: (d) => d.color,
    getSourcePosition: (d) => {
      // console.log(d);
      return d.from;
    },
    getTargetPosition: (d) => d.to,
    getWidth: 12,
    pickable: true,
  });

  const stopsLayer = new IconLayer({
    id: "stops-layer",
    data: stopsData,
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

  const movingBusLayer = new SimpleMeshLayer({
    id: "buses-layer",
    data: patentes,
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
    pickable: true,
    updateTriggers: {
      getPosition: [time],
      getColor: [time],
      getOrientation: [time],
      getScale: [scale],
    },
  });

  const toolTip = (object) => {
    if (object.layer && object.picked) {
      // console.log(object);
      if (object.layer.id == "buses-layer") {
        return patentes[object.index];
      } else if (object.layer.id == "stops-layer") {
        // console.log(stopsData["stops"][object.index]);
        return stopsData[object.index].name;
      }
    }
  };

  const deviationLayer = new HeatmapLayer({
    id: "deviation-layer",
    // data: movingBuses.getDeviations(),
    data: movingBuses.getDeviations(),
    aggregation: "MEAN",

    visible: deviationsAvailable,

    getPosition: (d) => {
      return d.position;
    },
    getWeight: (d) => {
      // console.log(d.position);
      return d.weight;
    },

    radiusPixels: 15,
  });

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={[
        osmMapLayer,
        routesLayer,
        stopsLayer,
        deviationLayer,
        movingBusLayer,
      ]}
      getTooltip={toolTip}
      controller={true}
    />
  );
}

export default DeckGlMap;
