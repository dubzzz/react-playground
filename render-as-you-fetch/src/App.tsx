import { Suspense, useState } from "react";
import List, { ListItem } from "./List";

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

  return (
    <div>
      <button onClick={() => setCb((cb) => cb + 1)}>+1</button> — Current is{" "}
      {cb}
      <Br />
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
        </div>
      </Suspense>
    </div>
  );
}

export default App;
