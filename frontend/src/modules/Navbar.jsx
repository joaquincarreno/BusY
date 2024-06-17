import React from "react";
import "./Navbar.css";

const Navbar = ({
  availableRoutes = [],
  routeSetter = () => {},
  availableBuses = [],
  busSetter = () => {},
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
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
      {/* selector de rut */}
      <select onChange={handleSelectRoute}>
        <option value="" hidden>
          Ruta
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
          Patente
        </option>
        {availableBuses.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Navbar;
