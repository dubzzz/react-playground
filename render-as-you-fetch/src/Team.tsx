import { Suspense } from "react";
import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function Team(props: Props) {
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

export function TeamNoIntermediateSpinner(props: Props) {
  // To be wrapped into <Suspense />
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

type PropsItem = { userId: string };

export function User(props: PropsItem) {
  const userIdToName = useRenderAsYouFetch(retrieveUserName, [props.userId]);

  return (
    <li>
      id({props.userId}) =&gt; {userIdToName.get()}
    </li>
  );
}
