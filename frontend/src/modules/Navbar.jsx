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
  const handleSelectRoute = (event) => {
    routeSetter(event.target.value);
    console.log("selected route: " + event.target.value);
  };

  const handleSelectBus = (event) => {
    busSetter(event.target.value);
    console.log("selected bus: " + event.target.value);
  };
  // console.log("navbar log");
  // console.log(availableBuses);
  // console.log(availableRoutes);
  return (
    <div className="navbar">
      <a href="https://www.youtube.com/watch?v=GDw9_kIEDaY">Busy</a>

      {/* selector de rut */}
      <select onChange={handleSelectRoute}>
        <option value="" hidden>
          {selectedRoute != "" ? selectedRoute : "Servicio"}
        </option>
        {availableRoutes.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
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
