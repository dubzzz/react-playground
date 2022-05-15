// App1 with optimized fetching of data.
// Some data will be fetched before what it does in App1.

import {
  retrieveTeam,
  retrieveMemberName,
  Team,
  retrieveCurrentUser,
  retrieveNews,
} from "./api/Fetcher";
import Card from "./Card";
import { useClassicFetch } from "./RenderAsYouFetch";

type Props = { teamNumber: number };

export default function App(props: Props) {
  return <Page {...props} />;
}

type PageProps = { teamNumber: number };

function Page(props: PageProps) {
  const team = useClassicFetch(retrieveTeam, [props.teamNumber]);

  return (
    <div>
      <Header teamNumber={props.teamNumber} team={team} />
      <Content team={team} />
      <Footer teamNumber={props.teamNumber} />
    </div>
  );
}

type PropsHeader = {
  teamNumber: number;
  team: Team | undefined;
};

function Header(props: PropsHeader) {
  const currentUser = useClassicFetch(retrieveCurrentUser, [props.teamNumber]);

  if (props.team === undefined || currentUser === undefined) {
    return <Card>Please wait...</Card>;
  }

  return (
    <Card>
      <p>Welcome {currentUser}</p>
      <p>Team name: {props.team.teamName}</p>
    </Card>
  );
}

type PropsContent = {
  team: Team | undefined;
};

function Content(props: PropsContent) {
  if (props.team === undefined) {
    return <Card>Please wait...</Card>;
  }

  return (
    <Card>
      Team members are:
      <ul>
        {props.team.members.map((memberId) => (
          <li key={memberId}>
            <Member id={memberId} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

type PropsMember = { id: string };

function Member(props: PropsMember) {
  const name = useClassicFetch(retrieveMemberName, [props.id]);

  if (name === undefined) {
    return <span>Please wait...</span>;
  }

  return (
    <span>
      id({props.id}) =&gt; {name}
    </span>
  );
}

type PropsFooter = {
  teamNumber: number;
};

function Footer(props: PropsFooter) {
  const news = useClassicFetch(retrieveNews, [props.teamNumber]);

  if (news === undefined) {
    return <Card>Please wait...</Card>;
  }

  return (
    <Card>
      Got new regarding your favourite team:
      <ul>
        {news.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </Card>
  );
}
