import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useClassicFetch, useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function TeamClassic(props: Props) {
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
        <UserClassic userId={`id:${props.cb + 1000}`} />
      </ul>
      <p>Users:</p>
      <ul>
        {users.map((userId) => (
          <UserClassic key={userId} userId={userId} />
        ))}
      </ul>
      <p>Referee:</p>
      <ul>
        <UserClassic userId={`id:${props.cb + 2000}`} />
      </ul>
    </div>
  );
}

type PropsItem = { userId: string };

export function UserClassic(props: PropsItem) {
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
