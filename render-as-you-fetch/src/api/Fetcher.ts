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

export function retrieveUserIds(cb: number): Promise<string[]> {
  console.info(`START: retrieveUserIds(${cb})`);
  return delay(
    Promise.resolve([...Array(4)].map((_, i) => "id:" + String(cb + i))),
    "retrieveUserIds"
  ).finally(() => console.info(`END: retrieveUserIds(${cb})`));
}

export function retrieveUserName(userId: string): Promise<string> {
  console.info(`START: retrieveUserName(${userId})`);
  return delay(
    Promise.resolve(`User ${userId.substring(3)}`),
    "retrieveUserName"
  ).finally(() => console.info(`END: retrieveUserName(${userId})`));
}
