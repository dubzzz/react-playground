import React, { useEffect, useState } from "react";

/**
 * Mimic the behaviour of `React.lazy`
 */
export function myLazy<TProps>(
  importer: () => Promise<{ default: React.ComponentType<TProps> }>,
  promiseWrapper: (
    p: Promise<{ default: React.ComponentType<TProps> }>
  ) => unknown
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
      console.info("[lazy] No Component to render, throwing...");
      // In theory, `React.lazy` is supposed to throw instances of Promises, that will be
      // captured and caught by a boundary defined via the `React.Suspense`.
      // If we want to build our own `React.Suspense` we cannot directly use this trick as
      // React somehow catches any thrown Promise. We need to rewrap it into another instance
      // not shaped as a Promise but making the Promise accessible for our own `React.Suspense`.
      // Here is the code capturing any error thrown during render:
      // >   } catch (originalError) {
      // >       if (originalError !== null && typeof originalError === 'object' && typeof originalError.then === 'function') {
      // >         // Don't replay promises. Treat everything else like an error.
      // >         throw originalError;
      // >       } // Keep this code in sync with handleError; any changes here must have
      throw promiseWrapper(awaited);
    }
    console.info("[lazy] Rendering the Component");
    return <Component {...props} />;
  }
  return MyAwaitedComponent;
}
