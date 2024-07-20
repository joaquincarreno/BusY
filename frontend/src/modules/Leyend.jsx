import { useState } from "react";

import "./Leyend.css";

const generateGradientStyle = (colors) => {
  var colorScale = "linear-gradient(to right";
  colors.forEach((c) => {
    colorScale += ", " + `rgb(${c.join(",")})`;
  });
  colorScale += ")";
  return colorScale;
};

const createContinuousScale = (scaleTitle, min, max, colorRange) => {
  return (
    <div className="continuous-scale-container">
      {scaleTitle}
      <div className="continuous-scale">
        <div
          className="scale-gradient"
          style={{
            backgroundImage: generateGradientStyle(colorRange),
          }}
        />
        <div className="continuous-scale-ranges">
          <div>{min.toFixed(1)}</div>
          <div>{max.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

const createDiscreteScale = (scaleTitle, valueRanges, nRows, colorRange) => {
  const rowSize = Math.ceil(valueRanges.length / nRows);
  const rows = Array.from({ length: nRows }, (v, i) =>
    valueRanges.slice(i * rowSize, i * rowSize + rowSize)
  );
  const indexMult = Math.floor(colorRange.length / valueRanges.length);
  return (
    <div className="discrete-scale-container">
      {scaleTitle}
      {rows.map((row, i) => {
        return (
          <div className="discrete-scale-row">
            {row.map((range, j) => {
              return (
                <div className="discrete-scale-element">
                  <div> {range} </div>
                  <div
                    className="box"
                    style={{
                      background: `rgb(${colorRange[
                        (i * rowSize + j) * indexMult
                      ].join(",")})`,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function Leyend({
  busProp: {
    // 0: progress, 1: deviation, 2: speeds
    busColorMode = 0,
    busMin = 0,
    busMax = 1,
    busColorRange,
  },
  heatMapProp: {
    // 0: hidden, 1: deviation, 2: speeds
    heatMapMode = 0,
    heatMapMin = 0,
    heatMapMax = 1,
    heatMapColorRange,
  },
}) {
  const [display, setDisplay] = useState(true);

  const discreteSpeedsRange = [
    "0-5",
    "5-10",
    "10-15",
    "15-20",
    "20-30",
    "30-60",
    ">60",
  ];

  const busColorLeyend =
    busColorMode == 2
      ? createDiscreteScale(
          "Color de buses (km/h)",
          discreteSpeedsRange,
          2,
          busColorRange
        )
      : createContinuousScale(
          busColorMode == 0 ? "Progreso del recorrido" : "Desviación (km)",
          busMin,
          busMax,
          busColorRange
        );

  const heatMapLeyend =
    heatMapMode == 1
      ? createContinuousScale(
          "Escala de Heat Map (km)",
          heatMapMin,
          heatMapMin,
          heatMapColorRange
        )
      : createDiscreteScale(
          "Escala de Heat Map (km/h)",
          discreteSpeedsRange,
          2,
          heatMapColorRange
        );

  if (display) {
    return (
      <div className="legend">
        <div className="legend-open">
          <div className="button-wrapper">
            <button className="leyend-button" onClick={() => setDisplay(false)}>
              ❔
            </button>
          </div>
          <div className="leyend-content">
            <div className="stops-container">
              {/* cajas que indican sentido */}
              Colores de Paraderos
              <div className="stops-row">
                <div className="box" style={{ background: "#f07878" }} />
                Ida
              </div>
              <div className="stops-row">
                <div className="box" style={{ background: "#7878f0" }} />
                Vuelta
              </div>
              <div className="stops-row">
                <div className="box" style={{ background: "#78f078" }} />
                Sin sentido
              </div>
            </div>
            {busColorLeyend}
            {heatMapMode != 0 && heatMapLeyend}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="legend">
        <div className="legend-closed">
          <div className="button-wrapper">
            <button className="leyend-button" onClick={() => setDisplay(true)}>
              ❔
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Leyend;
