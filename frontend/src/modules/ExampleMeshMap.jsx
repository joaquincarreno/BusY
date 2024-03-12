/*
 * https://deck.gl/docs/api-reference/mesh-layers/simple-mesh-layer
 */
import { React } from "react";
import { DeckGL } from "@deck.gl/react";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

function ExampleMeshMap({
  data = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",
  mesh = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj",
  initialViewState = {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    maxZoom: 20,
    pitch: 30,
    bearing: 0,
  },
}) {
  const layer = new SimpleMeshLayer({
    id: "SimpleMeshLayer",
    data: data,

    /* props from SimpleMeshLayer class */

    getColor: (d) => [Math.sqrt(d.exits), 140, 0],
    getOrientation: (d) => [0, Math.random() * 180, 0],
    getPosition: (d) => d.coordinates,
    // getScale: [1, 1, 1],
    // getTransformMatrix: [],
    // getTranslation: [0, 0, 0],
    // material: true,
    mesh: mesh,
    sizeScale: 30,
    // texture: null,
    // textureParameters: null,
    // wireframe: false,

    /* props inherited from Layer class */

    // autoHighlight: false,
    // coordinateOrigin: [0, 0, 0],
    // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    // highlightColor: [0, 0, 128, 128],
    loaders: [OBJLoader],
    // modelMatrix: null,
    // opacity: 1,
    pickable: true,
    // visible: true,
    // wrapLongitude: false,
  });

  return (
    <DeckGL
      layers={[layer]}
      mapStyle={"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"}
      initialViewState={initialViewState}
      controller={true}
      getTooltip={({ object }) =>
        object &&
        `${object.name}
        ${object.address}`
      }
    ></DeckGL>
  );
}
export default ExampleMeshMap;
