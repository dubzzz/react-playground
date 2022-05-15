// Basic application using normal fetch via states and effects
// and without any render-as-you-fetch system

import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useClassicFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function App(props: Props) {
  return <Team {...props} />;
}

function Team(props: Props) {
  const users = useClassicFetch(retrieveUserIds, [props.cb]);

  if (users === undefined) {
    return <div>Please wait...</div>;
  }

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
        {users.map((userId) => (
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
  const userIdToName = useClassicFetch(retrieveUserName, [props.userId]);

  if (userIdToName === undefined) {
    return <li>Please wait...</li>;
  }

  return (
    <li>
      id({props.userId}) =&gt; {userIdToName}
    </li>
  );
}
