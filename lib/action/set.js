
function set(data, options) {
  //console.log('set', data, options)
  if(options.set) {
    var modified = false

    for(var attr in options.set) {
      if(options.set.hasOwnProperty(attr) && data[attr] !== options.set[attr]) {
        modified = true
        data[attr] = options.set[attr]
      }
    }

    this.next(modified)
  } else {
    this.next()
  }
}
module.exports = set
