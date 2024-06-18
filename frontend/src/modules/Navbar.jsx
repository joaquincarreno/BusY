import React from "react";
import "./Navbar.css";

const Navbar = ({
  availableRoutes = [],
  availableBuses = [],

  selectedRoute = "",
  routeSetter = () => {},

  selectedBus = "",
  busSetter = () => {},

  selectedDirection = "",
  directionSetter = () => {},

  showStops = false,
  setShowStops = () => {},
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

  return (
    <div className="navbar">
      <a href="https://www.youtube.com/watch?v=GDw9_kIEDaY">Busy</a>

      {/* selector de ruta */}
      {createSelector(
        "Servicio",
        selectedRoute,
        availableRoutes,
        createHandler("route", routeSetter)
      )}
      {/* selector de bus */}
      {createSelector(
        "Patente",
        selectedBus,
        availableBuses,
        createHandler("bus", busSetter)
      )}

      <select onClick={createHandler("direction", directionSetter)}>
        <option value=""> Ambos sentidos </option>
        <option value="I"> Ida </option>
        <option value="R"> Retorno </option>
      </select>

      <button
        onClick={() => {
          setShowStops(!showStops);
        }}
      >
        {showStops ? "ocultar paraderos" : "mostrar paraderos"}{" "}
      </button>
    </div>
  );
};

export default Navbar;
