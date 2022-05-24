import { useDeferredValue, useMemo, useState, useTransition } from "react";
import fc from "fast-check";

const items = [
  ...new Set(fc.sample(fc.lorem({ mode: "sentences" }), { numRuns: 10_000 })),
].map((i) => `Lorem is: ${i}`);

function App() {
  const [deferred, setDeferred] = useState(false);
  const [transition, setTransition] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredItems = useMemo(
    () =>
      filterText !== ""
        ? items.filter((i) =>
            i.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
          )
        : items,
    [items, filterText]
  );

  return (
    <div>
      <div>
        <input
          id="deferred"
          type="checkbox"
          checked={deferred}
          onChange={(e) => setDeferred(e.target.checked)}
        />
        <label htmlFor="deferred">Deffered</label>
      </div>
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
      <div>
        {/* REMARK: This input is uncontrolled, we need that for transition to work well with e.target.value */}
        <input
          type="text"
          onChange={(e) => {
            if (!transition) {
              setFilterText(e.target.value);
            } else {
              startTransition(() => {
                setFilterText(e.target.value);
              });
            }
          }}
        />
      </div>
      <List deffered={deferred} items={filteredItems} />
    </div>
  );
}

type ListProps = {
  deffered: boolean;
  items: string[];
};

function List(props: ListProps) {
  // React core team recommend to use useDeferredValue on state we do not control
  // for instance coming from external libraries.
  const deferredItems = useDeferredValue(props.items);
  const items = props.deffered ? deferredItems : props.items;
  return (
    <div>
      <div>{items.length} items</div>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
