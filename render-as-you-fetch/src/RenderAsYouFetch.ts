import { useState } from "react";

type AsYouFetch<T> = {
  get: () => T;
};

const cache = new Map<
  unknown,
  { p: Promise<unknown>; out?: unknown; deps: unknown[] }[]
>();

function findOrCreateInCache<TDeps extends unknown[], TOut>(
  launcher: (...deps: TDeps) => Promise<TOut>,
  deps: TDeps
): { p: Promise<TOut>; out?: TOut } {
  let forLauncher = cache.get(launcher);
  if (forLauncher === undefined) {
    forLauncher = [];
    cache.set(launcher, forLauncher);
  }
  const match = forLauncher.find((e) => {
    return (
      e.deps.length === deps.length && e.deps.every((ee, i) => ee === deps[i])
    );
  });
  if (match !== undefined) {
    return match as { p: Promise<TOut>; out?: TOut };
  }
  const mismatch: { p: Promise<TOut>; out?: TOut; deps: TDeps } = {
    p: launcher(...deps).then((out) => (mismatch.out = out)),
    deps,
  };
  forLauncher.push(mismatch);
  return mismatch;
}

export function useRenderAsYouFetch<TDeps extends unknown[], TOut>(
  launcher: (...deps: TDeps) => Promise<TOut>,
  deps: TDeps
): AsYouFetch<TOut> {
  const [data, setData] = useState(() => findOrCreateInCache(launcher, deps));
  const freshData = findOrCreateInCache(launcher, deps);
  if (freshData !== data) {
    setData(freshData);
  }

  return {
    get: (): TOut => {
      if ("out" in data) {
        return data.out!;
      }
      throw data.p;
    },
  };
}
