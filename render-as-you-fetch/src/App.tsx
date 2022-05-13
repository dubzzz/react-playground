import { Suspense, useState } from "react";
import Team from "./Team";
import TeamClassic from "./TeamClassic";

function Br() {
  return (
    <div
      style={{
        borderBottom: "1px black solid",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    ></div>
  );
}

function App() {
  const [cb, setCb] = useState(0);
  const [classicMode, setClassicMode] = useState(false);

  return (
    <div>
      <button onClick={() => setCb(Math.ceil(Math.random() * 10000))}>
        Run
      </button>{" "}
      — Current is {cb} — <span id="counter"></span>
      <Br />
      <input
        type="checkbox"
        checked={classicMode}
        onChange={(e) => {
          setClassicMode(e.target.checked);
          setCb(Math.ceil(Math.random() * 10000));
        }}
      ></input>
      Enable classic mode
      <Br />
      {classicMode ? (
        <TeamClassic cb={cb} />
      ) : (
        <Suspense fallback={<div>Please wait...</div>}>
          <Team cb={cb} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
