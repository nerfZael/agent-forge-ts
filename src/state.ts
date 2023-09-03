export interface State {
  index: number;
  finished: boolean;
}

export const encodeState = (state: State): string => {
  return JSON.stringify(state);
}

export const decodeState = (stateString: string): State => {
  return JSON.parse(stateString);
}