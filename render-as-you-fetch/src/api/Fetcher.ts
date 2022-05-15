const numQueries: { [key: string]: number } = {};

function updateCounter() {
  const counterDiv = document.getElementById("counter");
  if (!counterDiv) {
    return;
  }
  counterDiv.innerText = `${Object.values(numQueries).reduce(
    (a, b) => a + b,
    0
  )} running (${Object.entries(numQueries)
    .filter((query) => query[1] > 0)
    .map((query) => `${query[0]}: ${query[1]}`)
    .join(", ")})`;
}

function delay<T>(p: Promise<T>, type: string): Promise<T> {
  numQueries[type] = (numQueries[type] || 0) + 1;
  updateCounter();
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(p), 5000 + Math.random() * 5000);
  }).finally(() => {
    --numQueries[type];
    updateCounter();
  });
}

export type Team = {
  teamName: string;
  members: string[];
};

export function retrieveTeam(teamNumber: number): Promise<Team> {
  console.info(`START: retrieveTeam(${teamNumber})`);
  return delay(
    Promise.resolve({
      teamName: `Team ${teamNumber.toString(16).toUpperCase()}`,
      members: [...Array(4)].map((_, i) => "id:" + String(teamNumber + i)),
    }),
    "retrieveTeam"
  ).finally(() => console.info(`END: retrieveTeam(${teamNumber})`));
}

export function retrieveMemberName(memberId: string): Promise<string> {
  console.info(`START: retrieveMemberName(${memberId})`);
  return delay(
    Promise.resolve(`User ${memberId.substring(3)}`),
    "retrieveMemberName"
  ).finally(() => console.info(`END: retrieveMemberName(${memberId})`));
}

export function retrieveCurrentUser(teamNumber: number): Promise<string> {
  // teamNumber is used as a cache buster
  console.info(`START: retrieveCurrentUser(${teamNumber})`);
  return delay(
    Promise.resolve(`User ${teamNumber.toString(36).toUpperCase()}`),
    "retrieveCurrentUser"
  ).finally(() => console.info(`END: retrieveCurrentUser(${teamNumber})`));
}

export function retrieveNews(teamNumber: number): Promise<string[]> {
  console.info(`START: retrieveNews(${teamNumber})`);
  return delay(
    Promise.resolve(
      [...Array(4)].map((_, i) => "news:" + String(teamNumber + i))
    ),
    "retrieveNews"
  ).finally(() => console.info(`END: retrieveNews(${teamNumber})`));
}
