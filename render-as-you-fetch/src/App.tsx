import { Suspense, useState } from "react";
import Team, { TeamNoIntermediateSpinner } from "./Team";
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
  const [type, setType] = useState(0);

  return (
    <div>
      <button onClick={() => setCb(Math.ceil(Math.random() * 10000))}>
        Run
      </button>{" "}
      — Current is {cb} — <span id="counter"></span>
      <Br />
      <button
        onClick={() => {
          setType((t) => (t + 1) % 3);
          setCb(Math.ceil(Math.random() * 10000));
        }}
      >
        Change
      </button>
      — {["As-You-Fetch (1)", "As-You-Fetch (2)", "Classic"][type]}
      <Br />
      {type === 2 ? (
        <TeamClassic cb={cb} />
      ) : type === 1 ? (
        <Suspense fallback={<div>Please wait...</div>}>
          <Team cb={cb} />
        </Suspense>
      ) : (
        <Suspense fallback={<div>Please wait...</div>}>
          <TeamNoIntermediateSpinner cb={cb} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
