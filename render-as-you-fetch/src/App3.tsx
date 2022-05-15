// Pretty close to App2 but this time the page will only render when evrything is ready.
// Such things would be pretty much more complex to do with the classical approach.
// There we are easily able to wait for a whole block to be ready before rendering it into the DOM.

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
        <Member id={`id:${props.teamNumber + 1000}`} />
      </ul>
      <p>Members:</p>
      <ul>
        {team.get().members.map((userId) => (
          <Member key={userId} id={userId} />
        ))}
      </ul>
      <p>Referee:</p>
      <ul>
        <Member id={`id:${props.teamNumber + 2000}`} />
      </ul>
    </div>
  );
}

type PropsMember = { id: string };

function Member(props: PropsMember) {
  const memberName = useRenderAsYouFetch(retrieveMemberName, [props.id]);

  return (
    <li>
      id({props.id}) =&gt; {memberName.get()}
    </li>
  );
}
