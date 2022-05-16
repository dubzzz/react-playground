import { useEffect, useState } from "react";

export type AsYouFetch<T> = {
  get: () => T;
  derive: <U>(mapper: (value: T) => U) => AsYouFetch<U>;
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

function buildAsYouFetch<TOut, TMapped>(
  data: {
    p: Promise<unknown>;
    out?: TOut | undefined;
  },
  mapper: (value: TOut) => TMapped
): AsYouFetch<TMapped> {
  return {
    get: (): TMapped => {
      if ("out" in data) {
        return mapper(data.out!);
      }
      throw data.p;
    },
    derive: <U>(nextMapper: (value: TMapped) => U) => {
      const newData: {
        p: Promise<unknown>;
        out?: TMapped | undefined;
      } = { p: data.p };
      if ("out" in data) {
        const out = data.out!;
        Object.defineProperty(newData, "out", {
          enumerable: true,
          configurable: false,
          // Only execute mapper when needed (on get on final derive)
          get: () => mapper(out),
        });
      }
      return buildAsYouFetch(newData, nextMapper);
    },
  };
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
  return buildAsYouFetch(data, (d) => d);
}

export function useClassicFetch<TDeps extends unknown[], TOut>(
  launcher: (...deps: TDeps) => Promise<TOut>,
  deps: TDeps
): TOut | undefined {
  const [data, setData] = useState(() => findOrCreateInCache(launcher, deps));
  const freshData = findOrCreateInCache(launcher, deps);
  if (freshData !== data) {
    setData(freshData);
  }

  const [fetched, setFetched] = useState<TOut>();
  useEffect(() => {
    const data = findOrCreateInCache(launcher, deps);
    if ("out" in data) {
      setFetched(data.out);
      return;
    }
    let canceled = false;
    setFetched(undefined);
    data.p.then((out) => {
      if (canceled) {
        return;
      }
      setFetched(out);
    });
    return () => {
      canceled = true;
    };
  }, [launcher, deps]);

  return fetched;
}
