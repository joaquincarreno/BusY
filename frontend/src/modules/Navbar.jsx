import React from "react";
import "./Navbar.css";

const VEL_MIN = 1.0 / 24 / 60 / 60; // un segundo por segundo
const VEL_MAX = 90.0 / 24 / 60 / 60; // 1.5 min por segundo

const Navbar = ({
  routeProp: {
    selectedRoute = "",
    availableRoutes = [],
    routeSetter = (_) => {},
  },

  busesProp: { selectedBus = "", availableBuses = [], busSetter = (_) => {} },

  directionsProp: {
    availableDirections = [],
    selectedDirection = "",
    directionSetter = (_) => {},
  },

  stopsProp: { showStops = false, setShowStops = (_) => {}, stopCount = 0 },

  timeControlProp: {
    time = 0,
    timeResetter = (_) => {},

    firstTimeStamp = new Date("2018/01/01"),
    lastTimeStamp = new Date("2019/12/31"),

    step = 0.001,
    stepSetter = (_) => {},

    pause = false,
    pauseSetter = (_) => {},
  },

  visControlProp: {
    colorMode = 0,
    colorModeSetter = (_) => {},

    deviationsAvailable = false,

    heatMapOption = 0,
    heatMapOptionSetter = (_) => {},
  },
}) => {
  const createHandler = (varName, setter, unSetterers = []) => {
    return (event) => {
      const value = event.target.value;
      unSetterers.map((setter) => {
        setter("");
      });
      setter(value);
      console.log("selected", varName, ": ", value);
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
    // loop se actualiza 10 veces por segundo
    const loopSpeed = 10;
    const log_out_min = Math.log10(6 / loopSpeed); // vel min = 1 min/s
    const log_out_max = Math.log10((45 * 60) / loopSpeed); // vel max = 20 min/s

    const log_x = Math.log10(x);

    const log_mapped =
      log_out_min +
      ((log_x - log_in_min) * (log_out_max - log_out_min)) /
        (log_in_max - log_in_min);
    const newStep = Math.round(Math.pow(10, log_mapped));
    stepSetter(newStep);
    console.log(
      "[handleStepChange] step =",
      (newStep / 60) * 10,
      " minutos/segundo"
    );
  };

  const getDateTime = (time) => {
    // time should be in seconds (how do we check this?)
    // console.log(new Date(firstTimeStamp));
    // console.log(new Date(lastTimeStamp));
    const currTime = new Date(firstTimeStamp + time * 1000);
    // console.log("[currTime]", currTime);
    // console.log("[currMonth]", currTime.getMonth());
    // el +1 es porque los meses en Date() se indexan desde el 0
    return `${currTime.getHours()}:${currTime.getMinutes()}:${currTime.getSeconds()} ${currTime.getDate()}/${
      currTime.getMonth() + 1
    }/${currTime.getFullYear()}`;
  };

  const directionNames = {
    I: "Ida",
    R: "Retorno",
  };

  const textStyle = { fontSize: "12px" };

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
          {availableDirections.length > 0 && (
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
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-item">
          <p>
            Tiempo actual: <br />
            {getDateTime(time)}
          </p>
        </div>
        <div className="navbar-item">
          <button
            onClick={() => {
              console.log("time resetted");
              timeResetter(true);
              pauseSetter(true);
            }}
          >
            reset
          </button>
        </div>
        <div className="navbar-item">
          <button
            onClick={() => pauseSetter(!pause)}
            className={!pause ? "stop" : "play"}
          />
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
          {/* modo de color */}
          <div style={textStyle}>Selector de color</div>
          <select
            value={colorMode}
            onChange={createHandler("colorMode", colorModeSetter, [])}
          >
            <option value={0}>Progreso de ruta</option>
            {deviationsAvailable && <option value={1}>Desviación</option>}
          </select>
        </div>
        <div className="navbar-item">
          {/* control heatmap */}
          <div style={textStyle}>Heat Map</div>
          <select
            value={heatMapOption}
            onChange={createHandler("heat map option", heatMapOptionSetter, [])}
          >
            <option value={0}>Ocultar</option>
            {deviationsAvailable && <option value={1}>Desviación</option>}
            <option value={2}>Velocidades</option>
          </select>
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
