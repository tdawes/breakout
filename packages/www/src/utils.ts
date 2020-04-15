import { LoadingValue } from "./types";

export const pluralize = (s: string, n: number): string =>
  n === 1 ? s : `${s}s`;

export const loadingValue = <T>(): LoadingValue<T> => ({
  loading: true,
  error: null,
  data: null,
});

export const errorValue = <T>(error: string): LoadingValue<T> => ({
  loading: false,
  error,
  data: null,
});

export const dataValue = <T>(data: T): LoadingValue<T> => ({
  loading: false,
  error: null,
  data,
});
