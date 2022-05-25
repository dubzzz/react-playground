import { useState, useTransition } from "react";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";
import App4 from "./App4";
import App5 from "./App5";
import App6 from "./App6";
import App7 from "./App7";
import App8 from "./App8";

const KnownTypes = [
  { Compo: Hello, bgColor: "#ffffff" },
  { Compo: App1, bgColor: "#ffffaa" },
  { Compo: App2, bgColor: "#aaffaa" },
  { Compo: App3, bgColor: "#aaffaa" },
  { Compo: App4, bgColor: "#ffffaa" },
  { Compo: App5, bgColor: "#aaffaa" },
  { Compo: App6, bgColor: "#aaffaa" },
  { Compo: App7, bgColor: "#aaffaa" },
  { Compo: App8, bgColor: "#aaffaa" },
];

function App() {
  const [teamNumber, setTeamNumber] = useState(0);
  const [type, setType] = useState(0);
  const [transition, setTransition] = useState(false);
  const [isPending, startTransition] = useTransition();

  const SelectedApp = KnownTypes[type].Compo;

  return (
    <div>
      {KnownTypes.map(({ bgColor }, index) => (
        <button
          key={index}
          onClick={() => {
            function update() {
              setType(index);
              setTeamNumber(Math.ceil(Math.random() * 10000));
            }
            if (transition) startTransition(update);
            else update();
          }}
          style={{
            border: `1px solid ${type === index ? "red" : bgColor}`,
            backgroundColor: bgColor,
          }}
        >
          {index}
        </button>
      ))}{" "}
      — Current is {teamNumber} — <span id="counter"></span>
      <div>
        <input
          id="transition"
          type="checkbox"
          checked={transition}
          onChange={(e) => setTransition(e.target.checked)}
        />
        <label htmlFor="transition">Transition</label>
        {isPending ? <span>...</span> : null}
      </div>
      <div
        style={{
          borderBottom: "1px black solid",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      ></div>
      <SelectedApp teamNumber={teamNumber} />
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
