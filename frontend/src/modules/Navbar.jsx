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

  time = 0,
  timeSetter = (_) => {},

  firstTimeStamp = new Date("2018/01/01"),
  lastTimeStamp = new Date("2019/12/31"),

  step = 0.001,
  stepSetter = (_) => {},

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
    const log_out_min = Math.log10(60); // vel min = 1 min/s
    const log_out_max = Math.log10(20 * 60); // vel max = 20 min/s

    const log_x = Math.log10(x);

    const log_mapped =
      log_out_min +
      ((log_x - log_in_min) * (log_out_max - log_out_min)) /
        (log_in_max - log_in_min);

    stepSetter(Math.pow(10, log_mapped));
    console.log("[handleStepChange] step =", step / 60, " minutos/segundo");
  };

  const getDateTime = (time) => {
    // time should be in seconds (how do we check this?)
    console.log(new Date(firstTimeStamp));
    console.log(new Date(lastTimeStamp));
    const currTime = new Date(firstTimeStamp + time * 1000);
    // console.log(currTime);
    // console.log("[currTime]", currTime);
    return `${currTime.getHours()}:${currTime.getMinutes()}:${currTime.getSeconds()} ${currTime.getDate()}/${currTime.getMonth()}/${currTime.getFullYear()}`;
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
          <button onClick={() => timeSetter(0)}>reset</button>
        </div>
        <div className="navbar-item">
          <button
            onClick={() => pauseSetter(!pause)}
            className={!pause ? "stop" : "play"}
          />
        </div>
        <div className="navbar-item">
          <p>
            Tiempo actual: <br />
            {getDateTime(time)}
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
