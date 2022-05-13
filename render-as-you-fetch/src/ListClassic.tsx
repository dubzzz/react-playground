import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useClassicFetch, useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function ListClassic(props: Props) {
  const users = useClassicFetch(retrieveUserIds, [props.cb]);

  if (users === undefined) {
    return <div>Please wait...</div>;
  }

  return (
    <ul>
      {users.map((userId) => (
        <ListItemClassic key={userId} userId={userId} />
      ))}
    </ul>
  );
}

type PropsItem = { userId: string };

export function ListItemClassic(props: PropsItem) {
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
