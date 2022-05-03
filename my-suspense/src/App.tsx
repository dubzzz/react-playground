import { delayed } from "./Delayed";
import { myLazy as lazy } from "./MyLazy";
//import { lazy } from "react";
import Suspense from "./MySuspense";
//import { Suspense } from "react";

const MyComponent = lazy(() => delayed(import("./MyComponent"), 10_000));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
