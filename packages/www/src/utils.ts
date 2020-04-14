export const pluralize = (s: string, n: number): string =>
  n === 1 ? s : `${s}s`;
