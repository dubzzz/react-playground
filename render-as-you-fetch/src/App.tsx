import { useState } from "react";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";
import App4 from "./App4";
import App5 from "./App5";
import App6 from "./App6";
import App7 from "./App7";

const KnownTypes = [App1, App2, App3, App4, App5, App6, App7];

function App() {
  const [teamNumber, setTeamNumber] = useState(0);
  const [type, setType] = useState(0);

  const SelectedApp = KnownTypes[type];

  return (
    <div>
      {KnownTypes.map((_Compo, index) => (
        <button
          key={index}
          onClick={() => {
            setType(index);
            setTeamNumber(Math.ceil(Math.random() * 10000));
          }}
          style={type === index ? { border: "1px solid red" } : {}}
        >
          {index + 1}
        </button>
      ))}{" "}
      — Current is {teamNumber} — <span id="counter"></span>
      <Br />
      {<SelectedApp teamNumber={teamNumber} />}
    </div>
  );
}

export default App;

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
