// Pretty close to App2 but this time the page will only render when evrything is ready.
// Such things would be pretty much more complex to do with the classical approach.
// There we are easily able to wait for a whole block to be ready before rendering it into the DOM.

import { Suspense } from "react";
import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function App(props: Props) {
  return (
    <Suspense fallback={<div>Please wait...</div>}>
      <Team {...props} />
    </Suspense>
  );
}

function Team(props: Props) {
  const users = useRenderAsYouFetch(retrieveUserIds, [props.cb]);

  return (
    <div>
      <p>
        <b>Team:</b>
      </p>
      <p>Admin:</p>
      <ul>
        <User userId={`id:${props.cb + 1000}`} />
      </ul>
      <p>Users:</p>
      <ul>
        {users.get().map((userId) => (
          <User key={userId} userId={userId} />
        ))}
      </ul>
      <p>Referee:</p>
      <ul>
        <User userId={`id:${props.cb + 2000}`} />
      </ul>
    </div>
  );
}

type PropsUser = { userId: string };

export function User(props: PropsUser) {
  const userIdToName = useRenderAsYouFetch(retrieveUserName, [props.userId]);

  return (
    <li>
      id({props.userId}) =&gt; {userIdToName.get()}
    </li>
  );
}
