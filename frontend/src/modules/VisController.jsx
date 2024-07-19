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

function VisController({}) {
  const [hide, setHide] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(posibleColorSchemes[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentStyle, setCurrentSyle] = useState(
    genGradientStyle(posibleColorSchemes[0])
  );

  const handleOptionClick = (scheme, style) => {
    setSelectedScheme(scheme);
    setShowDropdown(false);
    setCurrentSyle(style);
  };

  //   console.log(gradients);

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
            <select>
              <option value={0}>Carto - Light</option>
              <option value={1}>Carto - Dark</option>
              <option value={2}>OSM Standard</option>
              <option value={3}>OSM Humanitario</option>
            </select>
          </div>
          <div>Selección de color</div>
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ background: currentStyle }}
            >
              {selectedScheme}
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                {posibleColorSchemes.map((scheme) => {
                  const style = genGradientStyle(scheme);
                  return (
                    <li
                      key={scheme}
                      className="dropdown-item"
                      onClick={() => handleOptionClick(scheme, style)}
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
