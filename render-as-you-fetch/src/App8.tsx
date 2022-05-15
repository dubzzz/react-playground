// Display closer to App1 but in as-you-fetch mode
// and with optimized queries.
// It seems that out helper 'derive' comes with a bug making it unusable
// in such case. Fixing it would clearly provide a better dev experience.

import { Suspense, useRef, useState } from "react";
import {
  retrieveTeam,
  retrieveMemberName,
  retrieveCurrentUser,
  Team,
  retrieveNews,
} from "./api/Fetcher";
import Card from "./Card";
import { AsYouFetch, useRenderAsYouFetch } from "./RenderAsYouFetch";

type Props = { teamNumber: number };

export default function App(props: Props) {
  return (
    <Suspense fallback={<div>Please wait...</div>}>
      <p>
        <i>This App is still a Work-In-Progress</i>
      </p>
      <Page {...props} />
    </Suspense>
  );
}

type PageProps = { teamNumber: number };

function Page(props: PageProps) {
  const team = useRenderAsYouFetch(retrieveTeam, [props.teamNumber]);

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
  team: AsYouFetch<Team>;
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
            <p>Team name: {props.team.get().teamName}</p>
          </>
        )}
      </AsYouFetchSuspense>
    </Card>
  );
}

type PropsContent = {
  team: AsYouFetch<Team>;
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
                {props.team.get().members.map((memberId) => (
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

type PropsAsYouFetchSuspense = {
  fallback: React.ReactNode;
  children: () => React.ReactNode;
};

function AsYouFetchSuspense(props: PropsAsYouFetchSuspense) {
  const r = useRef(props.children);
  if (r.current !== props.children) {
    r.current = props.children;
  }
  const [Compo] = useState(() => {
    return function Compo() {
      return <>{r.current()}</>;
    };
  });
  return (
    <Suspense fallback={props.fallback}>
      <Compo />
    </Suspense>
  );
}
