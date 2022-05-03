export function delayed<T>(p: Promise<T>, delayMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let timeouted = false;
    let resolved: { success?: T; error?: unknown } | null = null;
    p.then(
      (success) => {
        resolved = { success };
        if (timeouted) {
          resolve(success);
        }
      },
      (error) => {
        resolved = { error };
        if (timeouted) {
          reject(error);
        }
      }
    );
    setTimeout(() => {
      if (resolved === null) {
        timeouted = true;
        return;
      }
      if ("success" in resolved) {
        resolve(resolved.success!);
        return;
      }
      reject(resolved.error);
    }, delayMs);
  });
}
