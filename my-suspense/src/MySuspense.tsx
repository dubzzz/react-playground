import React from "react";
import { MyError } from "./MyError";

export type Props = {
  /** Fallback component to be mount in case the wrapped component is not ready yet */
  fallback: React.ReactElement;
  /** One children to be "awaited" */
  children: React.ReactElement;
};

type State = {
  /** Is the component awaiting something or not? */
  loading: boolean;
  /** The awaited entity if any */
  awaitedError: unknown | undefined;
};

/**
 * Mimic the behaviour of `React.Suspense`
 */
export default class MySuspense extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { loading: false, awaitedError: undefined };
  }
  componentDidCatch(error: unknown) {
    if (!MyError.isValid(error)) {
      // Unhandled exception, must be caught by another error boundary
      console.info("[Suspense] Caught an unhandled error", error);
      throw error;
    }
    console.info("[Suspense] Caught a 'Promise'", error);
    this.setState({ loading: true, awaitedError: error });
    MyError.toPromise(error).then(
      () => {
        console.info("[Suspense] Promise resolved successfully");
        this.setState((previousState) => {
          // The last awaited Promise is ours, we can go ahead
          if (previousState.awaitedError === error) {
            return { loading: false, awaitedError: undefined };
          }
          // We still need to wait, our Promise is not the one we really waited for
          return previousState;
        });
      },
      (err) => {
        console.info("[Suspense] Promise rejected");
        // This error must probably be handled in a different way so that it could be
        // caught by a component higher in the tree
        console.error(err);
      }
    );
  }
  render() {
    if (this.state.loading) {
      console.info("[Suspense] Render fallback");
      return this.props.fallback;
    }
    console.info("[Suspense] Render children");
    return this.props.children;
  }
}
