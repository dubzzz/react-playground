import { useEffect, useLayoutEffect, useRef, useState } from "react";

let fullText = "";
const log = console.log;
const print = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  text: string
) => {
  fullText += "\n" + text;
  if (ref.current) {
    ref.current.innerText = fullText;
  }
  log(text);
};

function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState("");

  print(ref, "🏳️ render not effect(state=" + JSON.stringify(state) + ")");

  useEffect(() => {
    print(ref, "❤️ update(state=" + JSON.stringify(state) + ")");
    return () => print(ref, "☠️ update(state=" + JSON.stringify(state) + ")");
  }, [state]);
  useEffect(() => {
    print(ref, "❤️ mount");
    return () => print(ref, "☠️ mount");
  }, []);
  useEffect(() => {
    print(ref, "❤️ render");
    return () => print(ref, "☠️ render");
  });
  useEffect(() => {
    print(ref, "❤️ update(state=" + JSON.stringify(state) + ")(2)");
    return () =>
      print(ref, "☠️ update(state=" + JSON.stringify(state) + ")(2)");
  }, [state]);

  useLayoutEffect(() => {
    print(ref, "❤️ update(state=" + JSON.stringify(state) + ")(layout)");
    return () =>
      print(ref, "☠️ update(state=" + JSON.stringify(state) + ")(layout)");
  }, [state]);
  useLayoutEffect(() => {
    print(ref, "❤️ mount(layout)");
    return () => print(ref, "☠️ mount(layout)");
  }, []);
  useLayoutEffect(() => {
    print(ref, "❤️ render(layout)");
    return () => print(ref, "☠️ render(layout)");
  });
  useLayoutEffect(() => {
    print(ref, "❤️ update(state=" + JSON.stringify(state) + ")(2)(layout)");
    return () =>
      print(ref, "☠️ update(state=" + JSON.stringify(state) + ")(2)(layout)");
  }, [state]);

  /*
    Here is what we get in dev mode:
    
    🏳️ render not effect(state="")
    🏳️ render not effect(state="")
    ❤️ update(state="")(layout)
    ❤️ mount(layout)
    ❤️ render(layout)
    ❤️ update(state="")(2)(layout)
    ❤️ update(state="")
    ❤️ mount
    ❤️ render
    ❤️ update(state="")(2)
    ☠️ update(state="")(layout)
    ☠️ mount(layout)
    ☠️ render(layout)
    ☠️ update(state="")(2)(layout)
    ☠️ update(state="")
    ☠️ mount
    ☠️ render
    ☠️ update(state="")(2)
    ❤️ update(state="")(layout)
    ❤️ mount(layout)
    ❤️ render(layout)
    ❤️ update(state="")(2)(layout)
    ❤️ update(state="")
    ❤️ mount
    ❤️ render
    ❤️ update(state="")(2)
    ✍️ write(state="a")
    🏳️ render not effect(state="a")
    🏳️ render not effect(state="a")
    ☠️ update(state="")(layout)
    ☠️ render(layout)
    ☠️ update(state="")(2)(layout)
    ❤️ update(state="a")(layout)
    ❤️ render(layout)
    ❤️ update(state="a")(2)(layout)
    ☠️ update(state="")
    ☠️ render
    ☠️ update(state="")(2)
    ❤️ update(state="a")
    ❤️ render
    ❤️ update(state="a")(2)
  */

  /*
    Here is what we get in prod mode:
    
    🏳️ render not effect(state="")
    ❤️ update(state="")(layout)
    ❤️ mount(layout)
    ❤️ render(layout)
    ❤️ update(state="")(2)(layout)
    ❤️ update(state="")
    ❤️ mount
    ❤️ render
    ❤️ update(state="")(2)
    ✍️ write(state="a")
    🏳️ render not effect(state="a")
    ☠️ update(state="")(layout)
    ☠️ render(layout)
    ☠️ update(state="")(2)(layout)
    ❤️ update(state="a")(layout)
    ❤️ render(layout)
    ❤️ update(state="a")(2)(layout)
    ☠️ update(state="")
    ☠️ render
    ☠️ update(state="")(2)
    ❤️ update(state="a")
    ❤️ render
    ❤️ update(state="a")(2)
  */

  return (
    <div>
      <div>
        <input
          type="text"
          value={state}
          onChange={(e) => {
            print(
              ref,
              "✍️ write(state=" + JSON.stringify(e.target.value) + ")"
            );
            setState(e.target.value);
          }}
        />
      </div>
      <div ref={ref}></div>
    </div>
  );
}

export default App;
