import React from "react";
import "./Navbar.css";

const Navbar = ({
  availableRoutes = [],
  routeSetter = () => {},
  selectedRoute = "",
  availableBuses = [],
  busSetter = () => {},
  selectedBus = "",
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
      <select onChange={handleSelectBus}>
        <option value="" hidden>
          {selectedBus != "" ? selectedBus : "Patente"}
        </option>
        {availableBuses.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
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
