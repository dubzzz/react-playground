import { useState } from "react";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";

const KnownTypes = [App1, App2, App3];

function App() {
  const [cb, setCb] = useState(0);
  const [type, setType] = useState(0);

  const SelectedApp = KnownTypes[type];

  return (
    <div>
      {KnownTypes.map((_Compo, index) => (
        <button
          key={index}
          onClick={() => {
            setType(index);
            setCb(Math.ceil(Math.random() * 10000));
          }}
          style={type === index ? { border: "1px solid red" } : {}}
        >
          {index + 1}
        </button>
      ))}{" "}
      — Current is {cb} — <span id="counter"></span>
      <Br />
      {<SelectedApp cb={cb} />}
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
