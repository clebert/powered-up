export function interrupt(error: Error | null): void {
  if (error) {
    setImmediate(() => {
      throw error;
    });
  }
}
