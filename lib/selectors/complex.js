var CompoundSelector = require('./compound.js')
var mapCompoundSelectors = function (selector) {
  var combinator = selector.charAt(0)

  if (module.exports.combinators.indexOf(combinator) === -1) {
    combinator = undefined
  } else {
    selector = selector.substr(1)
  }

  return {
    combinator: combinator,
    selector: new CompoundSelector(selector)
  }
}
var tools = require('../tools')

module.exports = function (selector) {
  selector = this.selector = tools.normalise(selector, module.exports.combinators)

  this.compoundSelectors = tools.parseStr(selector, module.exports.combinators, true).map(mapCompoundSelectors)
}

module.exports.combinators = [' ', '+', '~']

module.exports.prototype.matches = function (obj) {
  var current = obj

  return this.compoundSelectors.every(function (ele) {
    if (!ele.combinator || ele.combinator === ' ') {
      current = ele.selector.findFirst(current)
    }

    return !!current
  })
}
module.exports.prototype.find = function (obj) {
  var currents = [obj]
  var containers = new Map()

  if (this.compoundSelectors.every(function (ele) {
      var newCurrents = []

      currents.forEach(function (current) {
        var container = containers.get(current)
        var found
        var index

        if (!ele.combinator || ele.combinator === ' ') {
          found = ele.selector.find(current, container)
        } else if (ele.combinator === '+') {
          if (Array.isArray(container)) {
            index = container.indexOf(current)

            if (index + 1 === container.length) {
              found = false
            } else {
              found = ele.selector.find(container.slice(index + 1, index + 2), containers.get(container))
            }
          }
        } else if (ele.combinator === '~') {
          if (Array.isArray(container)) {
            index = container.indexOf(current)

            if (index + 1 === container.length) {
              found = false
            } else {
              found = ele.selector.find(container.slice(index + 1), containers.get(container))
            }
          }
        }

        if (found) {
          found.forEach(function (ele) {
            newCurrents.push(ele)
            containers.set(ele, current)
          })
        }
      })
      currents = newCurrents

      return !!currents.length
    })) {
    return currents
  }

  return false
}
