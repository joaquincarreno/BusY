import React from "react";
import "./Navbar.css";

const Navbar = ({ availableRoutes = [], routeSetter = () => {} }) => {
  const handleSelectRoute = (event) => {
    routeSetter(event.target.value);
    console.log("selected route: " + event.target.value);
  };

  return (
    <div className="navbar">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
      <select onChange={handleSelectRoute}>
        <option value="" select disables hidden>
          Ruta
        </option>
        {availableRoutes.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Navbar;
