import { useState } from "react";

import "./Leyend.css";

function Leyend({}) {
  const [display, setDisplay] = useState(false);

  if (display) {
    return (
      <div className="box">
        <div>leyendas!!</div>
        <button onClick={() => setDisplay(false)}>x</button>
      </div>
    );
  } else {
    return (
      <div className="box">
        <button onClick={() => setDisplay(true)}> ? </button>
      </div>
    );
  }
}
export default Leyend;
