export type ActionWithCallback<T> = (payload: T, onComplete: () => void) => { payload: T; meta: { onComplete: () => void } };
