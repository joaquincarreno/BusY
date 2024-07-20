import "./VisController.css";

import { useState } from "react";

import colormap from "colormap";

const posibleColorSchemes = [
  "jet",
  "hsv",
  "hot",
  "spring",
  "summer",
  "autumn",
  "winter",
  "bone",
  "copper",
  "greys",
  "yignbu",
  "greens",
  "yiorrd",
  "bluered",
  "rdbu",
  "picnic",
  "rainbow",
  "portland",
  "blackbody",
  "earth",
  "electric",
  "alpha",
  "viridis",
  "inferno",
  "magma",
  "plasma",
  "warm",
  "cool",
  "rainbow-soft",
  "bathymetry",
  "cdom",
  "chlorophyll",
  "density",
  "freesurface-blue",
  "freesurface-red",
  "oxygen",
  "par",
  "phase",
  "salinity",
  "temperature",
  "turbidity",
  "velocity-blue",
  "velocity-green",
  "cubehelix",
];

const genGradientStyle = (scheme) => {
  const colorMap = colormap({
    colormap: scheme,
    nshades: 20,
    format: "hex",
  });
  return `linear-gradient(to right, ${colorMap.join(", ")})`;
};

function VisController({
  baseMap = 1,
  setBaseMap = (_) => {},
  schemeBuses = "viridis",
  setSchemeBuses = (_) => {},
  schemeHeatMap = "inferno",
  setSchemeHeatMap = (_) => {},
}) {
  const [hide, setHide] = useState(true);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [styleBuses, setStyleBuses] = useState(genGradientStyle(schemeBuses));
  const [styleHeatMap, setStyleHeatMap] = useState(
    genGradientStyle(schemeHeatMap)
  );

  const updateSchemeOptionBuses = (scheme, style) => {
    setShowDropdown1(false);
    setStyleBuses(style);
    setSchemeBuses(scheme);
  };

  const updateSchemeHeatMap = (scheme, style) => {
    setShowDropdown2(false);
    setStyleHeatMap(style);
    setSchemeHeatMap(scheme);
  };

  if (hide) {
    return (
      <div className="controller-wrapper">
        <button onClick={() => setHide(false)}>⚙️</button>
      </div>
    );
  } else {
    return (
      <div className="controller-wrapper">
        <button onClick={() => setHide(true)}>⚙️</button>
        <div className="controller-element">
          <div>Mapa base:</div>
          <div>
            <select
              value={baseMap}
              onChange={(e) => {
                setBaseMap(e.target.value);
              }}
            >
              <option value={0}>Carto - Light</option>
              <option value={1}>Carto - Dark</option>
              <option value={2}>OSM Standard</option>
              <option value={3}>OSM Humanitario</option>
            </select>
          </div>
          <div>Esquema de color Buses</div>
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown1(!showDropdown1)}
              style={{ background: styleBuses }}
            >
              {schemeBuses}
            </button>
            {showDropdown1 && (
              <ul className="dropdown-menu">
                {posibleColorSchemes.map((scheme) => {
                  const style = genGradientStyle(scheme);
                  return (
                    <li
                      key={scheme}
                      className="dropdown-item"
                      onClick={() => updateSchemeOptionBuses(scheme, style)}
                    >
                      <div className="gradient" style={{ background: style }} />
                      <span className="scheme-name">{scheme}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div>Esquema de color HeatMap</div>
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown2(!showDropdown2)}
              style={{ background: styleHeatMap }}
            >
              {schemeHeatMap}
            </button>
            {showDropdown2 && (
              <ul className="dropdown-menu">
                {posibleColorSchemes.map((scheme) => {
                  const style = genGradientStyle(scheme);
                  return (
                    <li
                      key={scheme}
                      className="dropdown-item"
                      onClick={() => updateSchemeHeatMap(scheme, style)}
                    >
                      <div className="gradient" style={{ background: style }} />
                      <span className="scheme-name">{scheme}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default VisController;
