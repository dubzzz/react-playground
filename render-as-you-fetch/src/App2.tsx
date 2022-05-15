// Pretty close to App1 but enabling render-as-you-fetch capabilities.
// It still performs the same way in terms of requests but the loading states
// are done handled via the parents through Suspense

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
        <Suspense fallback={<li>Please wait...</li>}>
          <User userId={`id:${props.cb + 1000}`} />
        </Suspense>
      </ul>
      <p>Users:</p>
      <ul>
        {users.get().map((userId) => (
          <Suspense key={userId} fallback={<li>Please wait...</li>}>
            <User userId={userId} />
          </Suspense>
        ))}
      </ul>
      <p>Referee:</p>
      <ul>
        <Suspense fallback={<li>Please wait...</li>}>
          <User userId={`id:${props.cb + 2000}`} />
        </Suspense>
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
