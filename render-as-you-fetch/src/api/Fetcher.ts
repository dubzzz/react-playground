function delay<T>(p: Promise<T>): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(p), 5000);
  });
}

export function retrieveUserIds(cb: number): Promise<string[]> {
  console.info(`START: retrieveUserIds(${cb})`);
  return delay(
    Promise.resolve([...Array(4)].map((_, i) => "id:" + String(cb + i)))
  ).finally(() => console.info(`END: retrieveUserIds(${cb})`));
}

export function retrieveUserName(userId: string): Promise<string> {
  console.info(`START: retrieveUserName(${userId})`);
  return delay(Promise.resolve(`User ${userId.substring(3)}`)).finally(() =>
    console.info(`END: retrieveUserName(${userId})`)
  );
}