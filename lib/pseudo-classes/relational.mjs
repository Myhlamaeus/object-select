import SimpleSelector from '../selectors/simple';

export function has(ele, parent, ...selectors) {
  if (typeof ele !== 'object' || Array.isArray(ele)) {
    throw new TypeError(':has can only be used on non-array objects');
  }

  return selectors.some(selector =>
    // Should probably be a ComplexSelector
    Boolean(new SimpleSelector(selector).findFirst(ele))
  );
}
