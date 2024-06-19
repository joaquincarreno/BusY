import React from "react";
import "./Navbar.css";

const Navbar = ({
  availableRoutes = [],
  availableBuses = [],

  selectedRoute = "",
  routeSetter = (_) => {},

  selectedBus = "",
  busSetter = (_) => {},

  availableDirections = [],
  selectedDirection = "",
  directionSetter = (_) => {},

  showStops = false,
  setShowStops = (_) => {},

  step = 0.001,
  stepSetter = (_) => {},

  time = 0,
}) => {
  const createHandler = (varName, setter) => {
    return (event) => {
      const value = event.target.value;
      setter(value);
      console.log("selected " + varName + ": " + value);
    };
  };

  const createSelector = (defaultValue, currentValue, options, handler) => {
    return (
      <select onChange={handler}>
        <option value="" hidden>
          {currentValue != "" ? currentValue : defaultValue}
        </option>
        {options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  };

  const handleStepChange = (e) => {
    const x = Number(e.target.value);

    const log_in_min = Math.log10(1);
    const log_in_max = Math.log10(100);
    const log_out_min = Math.log10(1.0 / 24 / 60 / 60);
    const log_out_max = Math.log10(0.01);

    const log_x = Math.log10(x);

    const log_mapped =
      log_out_min +
      ((log_x - log_in_min) * (log_out_max - log_out_min)) /
        (log_in_max - log_in_min);

    // const log = Math.log10(0.001) + ()

    stepSetter(Math.pow(10, log_mapped));
    console.log(step);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="https://www.youtube.com/watch?v=GDw9_kIEDaY">Busy</a>
        <div className="navbar-item">
          {/* selector de ruta */}
          {createSelector(
            "Servicio",
            selectedRoute,
            availableRoutes,
            createHandler("route", routeSetter)
          )}
        </div>
        <div className="navbar-item">
          {/* selector de bus */}
          {createSelector(
            "Patente",
            selectedBus,
            availableBuses,
            createHandler("bus", busSetter)
          )}
        </div>

        <div className="navbar-item">
          {/* selector de sentido */}
          {availableDirections.length > 0 ? (
            <select onChange={createHandler("direction", directionSetter)}>
              <option value=""> Cualquier sentido </option> +
              availableDirections.includes("I") ? (
              <option value="I"> Ida </option>) : <></> +
              availableDirections.includes("R") ? (
              <option value="R"> Retorno </option>) : (<></>)
            </select>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-item">
          <p>current time: {time}</p>
        </div>
        <div className="navbar-item">
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            // value={step}
            onChange={handleStepChange}
          />
        </div>
        <div className="navbar-item">
          <button
            onClick={() => {
              setShowStops(!showStops);
            }}
          >
            {showStops ? "ocultar paraderos" : "mostrar paraderos"}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
