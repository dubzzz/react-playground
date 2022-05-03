import { delayed } from "./Delayed";
import { MyError } from "./MyError";

import { myLazy as lazy } from "./MyLazy";
import Suspense from "./MySuspense";

const MyComponent = lazy(
  () => delayed(import("./MyComponent"), 10_000),
  (e) => MyError.from(e)
);

export default function App() {
  console.info("[App] Rendering the App");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
