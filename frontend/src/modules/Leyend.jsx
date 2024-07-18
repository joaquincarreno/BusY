import { useState } from "react";

import "./Leyend.css";

function Leyend({
  colorMode = 0,
  heatMapOption = 0,
  heatMapMin = 0,
  heatMapMax = 1,
}) {
  const [display, setDisplay] = useState(true);

  heatMapOption = 1;

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
            {heatMapOption != 0 && (
              <div>
                Escala del Heatmap:
                <div style={{ position: "relative" }}>
                  <span className="heatmap-limits heatmap-min">
                    {heatMapMin}
                  </span>
                  <div
                    className="gradient"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #4880EC, #019CAD)",
                    }}
                  />
                  <span className="heatmap-limits heatmap-max">
                    {heatMapMax}
                  </span>
                </div>
              </div>
            )}
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
