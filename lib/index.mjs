import ComplexSelector from './selectors/complex';

export { default as SimpleSelector } from './selectors/simple';
export { default as CompoundSelector } from './selectors/compound';
export { ComplexSelector };
// Export { default as SelectorList } from './selectors/list';

export default function(...args) {
  return new ComplexSelector(...args);
}
