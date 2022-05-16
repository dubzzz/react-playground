import { useEffect, useState } from "react";

export type AsYouFetch<T> = {
  get: () => T;
  derive: <U>(mapper: (value: T) => U) => AsYouFetch<U>;
};

type CachedValue<TOut> = {
  p: Promise<TOut>;
  result: { out?: TOut };
  deps: unknown[];
};
type CachedOutput<TOut, TOutPromise = TOut> = {
  p: Promise<TOutPromise>;
  result: { out?: TOut };
};

const cache = new Map<unknown, CachedValue<unknown>[]>();

function findOrCreateInCache<TDeps extends unknown[], TOut>(
  launcher: (...deps: TDeps) => Promise<TOut>,
  deps: TDeps
): CachedOutput<TOut> {
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
    return match as CachedOutput<TOut>;
  }
  const mismatch: CachedValue<TOut> = {
    p: launcher(...deps).then((out) => (mismatch.result.out = out)),
    deps,
    result: {},
  };
  forLauncher.push(mismatch);
  return mismatch;
}

function buildAsYouFetch<TOut, TMapped>(
  data: CachedOutput<TOut, unknown>,
  mapper: (value: TOut) => TMapped
): AsYouFetch<TMapped> {
  return {
    get: (): TMapped => {
      if ("out" in data.result) {
        return mapper(data.result.out!);
      }
      throw data.p;
    },
    derive: <U>(nextMapper: (value: TMapped) => U) => {
      const newData: CachedOutput<TMapped, unknown> = {
        p: data.p,
        result: {},
      };
      if ("out" in data.result) {
        const out = data.result.out!;
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
    if ("out" in data.result) {
      setFetched(data.result.out);
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
