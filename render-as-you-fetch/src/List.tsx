import { Suspense } from "react";
import { retrieveUserIds, retrieveUserName } from "./api/Fetcher";
import { useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { cb: number };

export default function List(props: Props) {
  const users = useRenderAsYouFetch(retrieveUserIds, [props.cb]);

  return (
    <ul>
      <Suspense fallback={<li>Please wait...</li>}>
        {users.get().map((userId) => (
          <ListItem key={userId} userId={userId} />
        ))}
      </Suspense>
    </ul>
  );
}

type PropsItem = { userId: string };

export function ListItem(props: PropsItem) {
  const userIdToName = useRenderAsYouFetch(retrieveUserName, [props.userId]);

  return (
    <li>
      id({props.userId}) =&gt; {userIdToName.get()}
    </li>
  );
}
