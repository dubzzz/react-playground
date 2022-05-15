// Pretty close to App2 but this time the page will only render when evrything is ready.
// Such things would be pretty much more complex to do with the classical approach.
// There we are easily able to wait for a whole block to be ready before rendering it into the DOM.

import { Suspense } from "react";
import {
  retrieveTeam,
  retrieveMemberName,
  retrieveCurrentUser,
  Team,
  retrieveNews,
} from "./api/Fetcher";
import Card from "./Card";
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
      <Header teamNumber={props.teamNumber} team={team.get()} />
      <Content team={team.get()} />
      <Footer teamNumber={props.teamNumber} />
    </div>
  );
}

type PropsHeader = {
  teamNumber: number;
  team: Team;
};

function Header(props: PropsHeader) {
  const currentUser = useRenderAsYouFetch(retrieveCurrentUser, [
    props.teamNumber,
  ]);

  return (
    <Card>
      <p>Welcome {currentUser.get()}</p>
      <p>Team name: {props.team.teamName}</p>
    </Card>
  );
}

type PropsContent = {
  team: Team;
};

function Content(props: PropsContent) {
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
  const name = useRenderAsYouFetch(retrieveMemberName, [props.id]);

  return (
    <span>
      id({props.id}) =&gt; {name.get()}
    </span>
  );
}

type PropsFooter = {
  teamNumber: number;
};

function Footer(props: PropsFooter) {
  const news = useRenderAsYouFetch(retrieveNews, [props.teamNumber]);

  return (
    <Card>
      Got new regarding your favourite team:
      <ul>
        {news.get().map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </Card>
  );
}
