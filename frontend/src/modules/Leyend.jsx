import { useState } from "react";

import "./Leyend.css";

const generateGradientStyle = (colors) => {
  var colorScale = "linear-gradient(to right";
  colors.forEach((c) => {
    colorScale += ", " + c;
  });
  colorScale += ")";
  return colorScale;
};

const heatMapColorScale = (mode) => {
  const color1deviations = "#baa368";
  const color2deviations = "#a31515";

  const color1speeds = "#a5a5a5";
  const color2speeds = "#87c387";

  const colorList =
    mode == 1
      ? [color1deviations, color2deviations]
      : mode == 2
      ? [color1speeds, color2speeds]
      : ["#FF0000", "#0000FF"];
  return generateGradientStyle(colorList);
};

const busColorScale = (mode) => {
  const color1progress = "#00ff95";
  const color2progress = "#ff0095";

  const color1deviations = "#baa368";
  const color2deviations = "#a31515";

  const color1speeds = "#a5a5a5";
  const color2speeds = "#87c387";

  const colorList =
    mode == 0
      ? [color1progress, color2progress]
      : mode == 1
      ? [color1deviations, color2deviations]
      : mode == 2
      ? [color1speeds, color2speeds]
      : ["#FF0000", "#0000FF"];

  return generateGradientStyle(colorList);
};

function Leyend({
  busProp: { busColorMode = 0, busMin = 0, busMax = 1 },
  heatMapProp: { heatMapMode = 0, heatMapMin = 0, heatMapMax = 1 },
}) {
  const [display, setDisplay] = useState(true);

  if (display) {
    return (
      <div className="wrapper">
        <div className="button-wrapper">
          <button className="leyend-button" onClick={() => setDisplay(false)}>
            x
          </button>
        </div>
        <div className="leyend-content">
          <div className="stops-leyend">
            {/* cajas que indican sentido */}
            Colores de Paraderos
            <div>
              <div className="box ida" />
              Ida
            </div>
            <div>
              <div className="box vuelta" />
              Vuelta
            </div>
            <div>
              <div className="box no-info" />
              Sin sentido
            </div>
            {heatMapMode != 0 && (
              <div>
                {"Escala color Heatmap " +
                  (heatMapMode == 1 ? "(km):" : "") +
                  (heatMapMode == 2 ? "(km/h):" : "")}
                <div style={{ position: "relative" }}>
                  <span className="heatmap-limits heatmap-min">
                    {heatMapMin.toFixed(1)}
                  </span>
                  <div
                    className="gradient"
                    style={{
                      backgroundImage: heatMapColorScale(heatMapMode),
                    }}
                  />
                  <span className="heatmap-limits heatmap-max">
                    {heatMapMax.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            {busColorMode == 0 && "Progreso de bus"}
            {busColorMode == 1 && "Desviación (km)"}
            {busColorMode == 2 && "Velocidad (km/h)"}
            <div style={{ position: "relative" }}>
              <span className="heatmap-limits heatmap-min">
                {busMin.toFixed(1)}
              </span>
              <div
                className="gradient"
                style={{
                  backgroundImage: busColorScale(busColorMode),
                }}
              />
              <span className="heatmap-limits heatmap-max">
                {busMax.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="wrapper">
        <div className="button-wrapper">
          <button className="leyend-element" onClick={() => setDisplay(true)}>
            ?
          </button>
        </div>
      </div>
    );
  }
}
export default Leyend;
