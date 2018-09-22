export function interrupt(error: Error): void {
  setImmediate(() => {
    throw error;
  });
}
