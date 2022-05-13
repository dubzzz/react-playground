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
      <button onClick={() => setCb((cb) => cb + 100)}>Run</button>
      <button onClick={() => setCb((cb) => cb + 1)}>+1</button> — Current is{" "}
      {cb}
      <Br />
      <input
        type="checkbox"
        checked={classicMode}
        onChange={(e) => {
          setClassicMode(e.target.checked);
          setCb((cb) => cb + 100);
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
        <Suspense fallback={<div>Loading {cb}...</div>}>
          <div>
            <div>
              Current user is: <ListItem userId={"id:current"} />
            </div>
            <Br />
            <div>
              Other users are:
              <List cb={cb} />
            </div>
            <Br />
            <div>
              Yet other users are:
              <List cb={cb + 10} />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default App;
