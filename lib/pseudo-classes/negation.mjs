import { matches } from './matches-any';

export function not(...args) {
  return !matches(...args);
}
