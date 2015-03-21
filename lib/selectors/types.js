module.exports = {
  string: function (val) {
    return typeof val === 'string'
  },
  number: function (val) {
    return typeof val === 'number'
  },
  object: function (val) {
    return typeof val === 'object' && !Array.isArray(val)
  },
  array: function (val) {
    return Array.isArray(val)
  },
  boolean: function (val) {
    return typeof val === 'boolean'
  },
  undefined: function (val) {
    return typeof val === 'undefined'
  }
}
