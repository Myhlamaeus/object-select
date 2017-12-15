export default {
  string(val) {
    return typeof val === 'string';
  },
  number(val) {
    return typeof val === 'number';
  },
  object(val) {
    return typeof val === 'object' && !Array.isArray(val);
  },
  array(val) {
    return Array.isArray(val);
  },
  boolean(val) {
    return typeof val === 'boolean';
  },
  undefined(val) {
    return typeof val === 'undefined';
  }
};
