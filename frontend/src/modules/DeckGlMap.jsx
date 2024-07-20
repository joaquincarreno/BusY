import { React, useState } from "react";

import { DeckGL } from "@deck.gl/react";
import { BitmapLayer, IconLayer, LineLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

import iconMapping from "../assets/icon-atlas.json";
import iconAtlas from "../assets/icon-atlas.png";
// por transaparencia, estos archivos se obtuvieron originalmente de:
// "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
// y posterioremente se les agregó el logo del bus

// distintas alternativas de mapas libres encontradas en https://wiki.openstreetmap.org/wiki/Raster_tile_providers
const mapProviders = [
  "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
];

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
  renderProp: {
    viewState = {
      latitude: -33.443018,
      longitude: -70.65387,
      zoom: 10,
      minZoom: 2,
      maxZoom: 15,
    },
    viewStateSetter = () => {},
    time = 0,
    showStops = true,
  },
  dataProp: {
    movingBuses = {},
    stopsData = JSON.parse([]),
    deviationsAvailable = false,
    heatMapOption = 0,
  },
  baseMap = 1,
}) {
  const [scale, setScale] = useState(1);
  const patentes = movingBuses.patentes;

  const onViewStateChange = ({ viewState, interactionState, oldViewState }) => {
    // console.log("viewState changed: ", viewState);
    viewStateSetter(viewState);
    setScale((viewState.zoom - 2) / 13);
    // console.log(viewState.zoom);
  };

  const baseMapLayer = new TileLayer({
    id: "base-map",
    data: mapProviders[baseMap],
    // maxZoom: 19,
    // minZoom: 0,

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

  // si hay orden en los paraderos entonces se pueden hacer líneas
  const routeLines =
    stopsData[0] && stopsData[0].order
      ? createStopsLines(stopsData)
      : [{ from: [0, 0], to: [0, 0], color: [0, 0, 0] }];

  const routesLayer = new LineLayer({
    id: "routes-layer",
    data: routeLines,

    getColor: (d) => d.color,
    getSourcePosition: (d) => {
      // console.log(d);
      return d.from;
    },
    getTargetPosition: (d) => d.to,

    visible: showStops,
    getWidth: 12,
    pickable: true,
  });

  // const iconMapping = require("../assets/icon-atlas.json");

  const stopsLayer = new IconLayer({
    id: "stops-layer",
    data: stopsData,
    getIcon: (d) => "marker",
    getPosition: (d) => {
      return [d.positionX, d.positionY];
    },
    getColor: (d) => {
      const s = d.direction;
      if (s == "I") {
        return [240, 120, 120];
      } else if (s == "R") {
        return [120, 120, 240];
      } else {
        return [120, 240, 120];
      }
    },
    getSize: (d) => {
      // console.log("updated size");
      return 50 - 25 * scale;
    },
    iconAtlas: iconAtlas,
    iconMapping: iconMapping,

    visible: showStops,

    pickable: true,

    updateTriggers: {
      getSize: [scale],
    },
  });

  const movingBusLayer = new IconLayer({
    id: "buses-layer",
    data: patentes,
    getIcon: (_) => "bus",
    getPosition: (d) => {
      const bus = movingBuses.getBus(d);
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
    getSize: (d) => {
      return 80 - 40 * scale;
    },
    iconAtlas: iconAtlas,
    iconMapping: iconMapping,
    visible: true,

    pickable: true,

    updateTriggers: {
      getPosition: [time],
      getColor: [time],
      getScale: [scale],
    },
  });

  const colorRangeHeatmapDevs = [
    [186, 163, 104, 255],
    [163, 21, 21, 255],
  ];
  const deviationLayer = new HeatmapLayer({
    id: "deviation-layer",
    data: movingBuses.getDeviations(),
    aggregation: "MEAN",

    visible: deviationsAvailable && heatMapOption == 1,

    getPosition: (d) => {
      return d.position;
    },
    getWeight: (d) => {
      return d.weight;
    },

    colorRange: colorRangeHeatmapDevs,

    radiusPixels: 15,
  });

  const colorRangeHeatmapSpeeds = [
    [165, 165, 165, 255],
    [135, 195, 135, 255],
  ];
  const speedsLayer = new HeatmapLayer({
    id: "speeds-layer",
    data: movingBuses.getSpeeds(),
    aggregation: "MEAN",

    visible: heatMapOption == 2,

    getPosition: (d) => {
      return d.position;
    },
    getWeight: (d) => {
      return d.weight;
    },

    colorRange: colorRangeHeatmapSpeeds,
    // threshold: 0.5,
    radiusPixels: 25,
  });

  const toolTip = (element) => {
    if (element.layer && element.picked) {
      // console.log(element);
      if (element.layer.id == "buses-layer") {
        return element.object;
      } else if (element.layer.id == "stops-layer") {
        // console.log(element);
        return element.object.name;
      }
    }
  };

  return (
    // <div className="map">
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={[
        baseMapLayer,
        deviationLayer,
        speedsLayer,
        routesLayer,
        stopsLayer,
        movingBusLayer,
      ]}
      getTooltip={toolTip}
      controller={true}
    ></DeckGL>
    // </div>
  );
}

export default DeckGlMap;
