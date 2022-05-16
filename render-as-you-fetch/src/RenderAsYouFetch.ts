import { useEffect, useState } from "react";

export type AsYouFetch<T> = {
  get: () => T;
  derive: <U>(mapper: (value: T) => U) => AsYouFetch<U>;
};

type CachedValue<TOut> = {
  pRef: WeakRef<Promise<TOut>>;
  pValue: WeakRef<CachedOutput<TOut>>;
  result: { out?: TOut };
  deps: unknown[];
};
type CachedOutput<TOut, TOutPromise = TOut> = {
  p: Promise<TOutPromise>;
  result: { out?: TOut };
};

// While the key of this cache might live forever (case of "global functions"),
// if the passed function is a temporary variable like the output of `useCallback`
// it will be garbageable automatically by the GC when needed.
const cache = new WeakMap<(...args: any[]) => any, CachedValue<unknown>[]>();

function findOrCreateInCache<TDeps extends unknown[], TOut>(
  launcher: (...deps: TDeps) => Promise<TOut>,
  deps: TDeps
): CachedOutput<TOut> {
  let forLauncher = cache.get(launcher);
  if (forLauncher === undefined) {
    forLauncher = [];
    cache.set(launcher, forLauncher);
  } else {
    const newForLauncher = forLauncher.filter(
      (e) => e.pRef.deref() !== undefined && e.pValue.deref() !== undefined
    );
    if (newForLauncher.length !== forLauncher.length) {
      const num = forLauncher.length - newForLauncher.length;
      console.warn(`Cleaning ${num} cached value(s)`);
      forLauncher = newForLauncher;
      cache.set(launcher, forLauncher);
    }
  }

  const match = forLauncher.find((e) => {
    return (
      e.pRef.deref() !== undefined &&
      e.pValue.deref() !== undefined &&
      e.deps.length === deps.length &&
      e.deps.every((ee, i) => ee === deps[i])
    );
  });
  if (match !== undefined) {
    const value = (match as CachedValue<TOut>).pValue.deref()!;
    return value;
  }
  const value: CachedOutput<TOut> = {
    p: launcher(...deps).then((out) => (value.result.out = out)),
    result: {},
  };
  forLauncher.push({
    pRef: new WeakRef(value.p),
    pValue: new WeakRef(value),
    deps,
    result: value.result,
  });
  return value;
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
