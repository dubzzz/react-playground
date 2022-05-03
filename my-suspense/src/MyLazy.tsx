import React, { useEffect, useState } from "react";

/**
 * Mimic the behaviour of `React.lazy`
 */
export function myLazy<TProps>(
  importer: () => Promise<{ default: React.ComponentType<TProps> }>
): React.ComponentType<TProps> {
  const awaited = importer();
  let Component: React.ComponentType<TProps> | undefined = undefined;

  console.info("[lazy] Starting awaited");
  awaited.then(
    (data) => {
      console.info("[lazy] awaited resolved with success", data);
      Component = data.default;
    },
    (err) => {
      console.info("[lazy] awaited resolved with error");
      // There is probably a better way to forward such error higher in the tree,
      // but let's keep it simple for now
      console.error(err);
    }
  );

  function MyAwaitedComponent(props: TProps) {
    if (Component === undefined) {
      console.info("[lazy] No Component to render");
      throw awaited;
    }
    console.info("[lazy] Rendering the Component");
    return <Component {...props} />;
  }
  return MyAwaitedComponent;
}
