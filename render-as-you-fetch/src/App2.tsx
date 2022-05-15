// Pretty close to App1 but enabling render-as-you-fetch capabilities.
// It still performs the same way in terms of requests but the loading states
// are done handled via the parents through Suspense.
// Not optimal as Suspense (outside of the Component loading stuff) tend to recreate
// a placeholder version of the Component.

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
      <Suspense fallback={<Card>Please wait...</Card>}>
        <Header teamNumber={props.teamNumber} team={team.get()} />
      </Suspense>
      <Content team={team.get()} />
      <Suspense fallback={<Card>Please wait...</Card>}>
        <Footer teamNumber={props.teamNumber} />
      </Suspense>
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
            <Suspense fallback={"Please wait..."}>
              <Member id={memberId} />
            </Suspense>
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
