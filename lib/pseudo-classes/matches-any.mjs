import SimpleSelector from '../selectors/simple';

export function matches(ele, parent, ...selectors) {
  return selectors.some(selector =>
    // Should use CompoundSelector
    new SimpleSelector(selector).matches(ele, parent)
  );
}
