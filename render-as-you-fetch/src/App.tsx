import { useState } from "react";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";
import App4 from "./App4";
import App5 from "./App5";
import App6 from "./App6";
import App7 from "./App7";
import App8 from "./App8";

const KnownTypes = [Hello, App1, App2, App3, App4, App5, App6, App7, App8];

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
          {index}
        </button>
      ))}{" "}
      — Current is {teamNumber} — <span id="counter"></span>
      <div
        style={{
          borderBottom: "1px black solid",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      ></div>
      {<SelectedApp teamNumber={teamNumber} />}
    </div>
  );
}

export default App;

function Hello() {
  return (
    <div>
      <p>
        <b>Welcome in my "render-as-you-fetch" playground</b>
      </p>
      <p>
        The aim is mostly to play around the feature not to implement THE
        perfect render-as-you-fetch patterns and helpers.
        <br />
        You can play with various iterations I made around the topic: from
        legacy way to handle requests to render-as-you-fetch.
        <br />
        Just press one of the buttons above to run one of the snippets: button{" "}
        <code>1</code> is for <code>App1.tsx</code>...
      </p>
    </div>
  );
}
