module.exports = {
  not: function () {
    return !this.matches.apply(this, arguments)
  }
}
