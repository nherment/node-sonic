
function filter(data, options) {
  if(options.attributes) {
    var asExpected = true

    for(var attr in options.attributes) {
      if(options.attributes.hasOwnProperty(attr)) {
        var expectedValue = options.attributes[attr]
        if(data[attr] !== expectedValue) {
          asExpected = false
          break
        }
      }
    }

    if(!asExpected) {
      this.reject()
    } else {
      this.next()
    }
  } else {
    this.next()
  }


}
module.exports = filter
