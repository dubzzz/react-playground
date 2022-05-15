// Basic application using normal fetch via states and effects
// and without any render-as-you-fetch system

import { retrieveTeam, retrieveMemberName } from "./api/Fetcher";
import { useClassicFetch } from "./RenderAsYouFetch";

type Props = { teamNumber: number };

export default function App(props: Props) {
  return <Page {...props} />;
}

type PageProps = { teamNumber: number };

function Page(props: PageProps) {
  const team = useClassicFetch(retrieveTeam, [props.teamNumber]);

  if (team === undefined) {
    return <div>Please wait...</div>;
  }

  return (
    <div>
      <p>
        <b>Team:</b>
      </p>
      <p>Admin:</p>
      <ul>
        <Member id={`id:${props.teamNumber + 1000}`} />
      </ul>
      <p>Member:</p>
      <ul>
        {team.members.map((userId) => (
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
  const name = useClassicFetch(retrieveMemberName, [props.id]);

  if (name === undefined) {
    return <li>Please wait...</li>;
  }

  return (
    <li>
      id({props.id}) =&gt; {name}
    </li>
  );
}
