import React from "react";
import "./Navbar.css";

const VEL_MIN = 1.0 / 24 / 60 / 60; // un segundo por segundo
const VEL_MAX = 90.0 / 24 / 60 / 60; // 1.5 min por segundo

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
  stopCount = 0,

  step = 0.001,
  stepSetter = (_) => {},

  time = 0,

  pause = false,
  pauseSetter = (_) => {},
}) => {
  const createHandler = (varName, setter, unSetterers = []) => {
    return (event) => {
      const value = event.target.value;
      unSetterers.map((setter) => {
        setter("");
      });
      setter(value);
      console.log("selected " + varName + ": " + value);
    };
  };

  const createSelector = (defaultValue, currentValue, options, handler) => {
    return (
      <select value={currentValue} onChange={handler}>
        <option value="">{defaultValue}</option>
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
    const log_out_min = Math.log10(VEL_MIN);
    const log_out_max = Math.log10(VEL_MAX);

    const log_x = Math.log10(x);

    const log_mapped =
      log_out_min +
      ((log_x - log_in_min) * (log_out_max - log_out_min)) /
        (log_in_max - log_in_min);

    // const log = Math.log10(0.001) + ()

    stepSetter(Math.pow(10, log_mapped));
    console.log(step * 3600 * 24 + " segundos/segundo");
  };

  const parseTimeToHoursMinutes = (time) => {
    if (time < 0 || time > 1) {
      throw new Error("[parseTimeToHour] Error: Time value out of range");
    }
    const tiempoEnHoras = time * 24;

    const horas = Math.floor(tiempoEnHoras);
    const minutos = Math.floor((tiempoEnHoras - horas) * 60);
    const segundos = Math.floor(((tiempoEnHoras - horas) * 60 - minutos) * 60);

    // Step 4: Return the formatted time
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
      2,
      "0"
    )}:${String(segundos).padStart(2, "0")}`;
  };

  const directionNames = {
    I: "Ida",
    R: "Retorno",
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="https://www.youtube.com/watch?v=GDw9_kIEDaY">Busy</a>
        <div className="navbar-item">
          {/* selector de ruta */}
          {createSelector(
            "Seleccione Servicio",
            selectedRoute,
            availableRoutes,
            createHandler("route", routeSetter, [directionSetter, busSetter])
          )}
        </div>
        <div className="navbar-item">
          {/* selector de bus */}
          {createSelector(
            selectedRoute != "" ? "Todos los buses" : "Seleccione Servicio",
            selectedBus,
            availableBuses,
            createHandler("bus", busSetter, [directionSetter])
          )}
        </div>

        <div className="navbar-item">
          {/* selector de sentido */}
          {availableDirections.length > 0 ? (
            <select
              value={selectedDirection}
              onChange={createHandler("direction", directionSetter)}
            >
              {availableDirections.length == 2 ? (
                <>
                  <option value={""}> Ambos Sentidos </option> +
                  <option value={"I"}>Ida</option> +
                  <option value={"R"}>Retorno</option>
                </>
              ) : (
                <option value={availableDirections[0]}>
                  Solo {directionNames[availableDirections[0]]} disponible
                </option>
              )}
            </select>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-item">
          <button
            onClick={() => pauseSetter(!pause)}
            className={pause ? "stop" : "play"}
          />
        </div>
        <div className="navbar-item">
          <p>
            Hora actual: <br />
            {parseTimeToHoursMinutes(time)}
          </p>
        </div>
        <div className="navbar-item">
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            defaultValue={10}
            onChange={handleStepChange}
          />
        </div>
        <div className="navbar-item">
          <button
            onClick={() => {
              setShowStops(!showStops);
            }}
          >
            {stopCount > 0
              ? showStops
                ? "ocultar paraderos"
                : "mostrar paraderos"
              : "no hay paraderos"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
