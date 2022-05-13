import { Suspense, useState } from "react";
import List, { ListItem } from "./List";
import ListClassic, { ListItemClassic } from "./ListClassic";

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
      — Current is {cb}
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
        <div>
          <div>
            Current user is:{" "}
            <ListItemClassic userId={`id:current:${classicMode}`} />
          </div>
          <Br />
          <div>
            Other users are:
            <ListClassic cb={cb} />
          </div>
          <Br />
          <div>
            Yet other users are:
            <ListClassic cb={cb + 10} />
          </div>
        </div>
      ) : (
        <div>
          <div>
            Current user is:{" "}
            <Suspense fallback={<div>Please wait...</div>}>
              <ListItem userId={"id:current"} />
            </Suspense>
          </div>
          <Br />
          <div>
            Other users are:
            <Suspense fallback={<div>Please wait...</div>}>
              <List cb={cb} />
            </Suspense>
          </div>
          <Br />
          <div>
            Yet other users are:
            <Suspense fallback={<div>Please wait...</div>}>
              <List cb={cb + 10} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
