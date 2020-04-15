export interface Logger {
  log: (message: string, ...args: any[]) => void;
}

export default () => ({
  // eslint-disable-next-line no-console
  log: (message: string, ...args: any[]) => console.log(message, ...args),
});
