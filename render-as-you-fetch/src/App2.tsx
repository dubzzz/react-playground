// Pretty close to App1 but enabling render-as-you-fetch capabilities.
// It still performs the same way in terms of requests but the loading states
// are done handled via the parents through Suspense

import { Suspense } from "react";
import { retrieveTeam, retrieveMemberName } from "./api/Fetcher";
import { useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { teamNumber: number };

export default function App(props: Props) {
  return (
    <Suspense fallback={<div>Please wait...</div>}>
      <Page {...props} />
    </Suspense>
  );
}

type PageProps = { teamNumber: number };

function Page(props: PageProps) {
  const team = useRenderAsYouFetch(retrieveTeam, [props.teamNumber]);

  return (
    <div>
      <p>
        <b>Team:</b>
      </p>
      <p>Admin:</p>
      <ul>
        <Suspense fallback={<li>Please wait...</li>}>
          <Member id={`id:${props.teamNumber + 1000}`} />
        </Suspense>
      </ul>
      <p>Members:</p>
      <ul>
        {team.get().members.map((userId) => (
          <Suspense key={userId} fallback={<li>Please wait...</li>}>
            <Member id={userId} />
          </Suspense>
        ))}
      </ul>
      <p>Referee:</p>
      <ul>
        <Suspense fallback={<li>Please wait...</li>}>
          <Member id={`id:${props.teamNumber + 2000}`} />
        </Suspense>
      </ul>
    </div>
  );
}

type PropsMember = { id: string };

function Member(props: PropsMember) {
  const name = useRenderAsYouFetch(retrieveMemberName, [props.id]);

  return (
    <li>
      id({props.id}) =&gt; {name.get()}
    </li>
  );
}
