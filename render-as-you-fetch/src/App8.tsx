// Display closer to App1 but in as-you-fetch mode
// and with optimized queries.

import { Suspense } from "react";
import {
  retrieveTeam,
  retrieveMemberName,
  retrieveCurrentUser,
  Team,
  retrieveNews,
} from "./api/Fetcher";
import Card from "./Card";
import {
  AsYouFetch,
  AsYouFetchSuspense,
  useRenderAsYouFetch,
} from "./RenderAsYouFetch";

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
      <Header
        teamNumber={props.teamNumber}
        teamName={team.derive((t) => t.teamName)}
      />
      <Content members={team.derive((t) => t.members)} />
      <Footer teamNumber={props.teamNumber} />
    </div>
  );
}

type PropsHeader = {
  teamNumber: number;
  teamName: AsYouFetch<Team["teamName"]>;
};

function Header(props: PropsHeader) {
  const currentUser = useRenderAsYouFetch(retrieveCurrentUser, [
    props.teamNumber,
  ]);

  return (
    <Card>
      <AsYouFetchSuspense fallback={"Please wait..."}>
        {() => (
          <>
            <p>Welcome {currentUser.get()}</p>
            <p>Team name: {props.teamName.get()}</p>
          </>
        )}
      </AsYouFetchSuspense>
    </Card>
  );
}

type PropsContent = {
  members: AsYouFetch<Team["members"]>;
};

function Content(props: PropsContent) {
  return (
    <Card>
      <AsYouFetchSuspense fallback={"Please wait..."}>
        {() => (
          <>
            Team members are:
            <ul>
              <Suspense fallback={<li>Please wait...</li>}>
                {props.members.get().map((memberId) => (
                  <li key={memberId}>
                    <Member id={memberId} />
                  </li>
                ))}
              </Suspense>
            </ul>
          </>
        )}
      </AsYouFetchSuspense>
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
      <AsYouFetchSuspense fallback={"Please wait..."}>
        {() => (
          <>
            Got new regarding your favourite team:
            <ul>
              {news.get().map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </AsYouFetchSuspense>
    </Card>
  );
}
