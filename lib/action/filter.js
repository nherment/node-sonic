
function filter(data, options) {

  if(options.attributes) {
    var asExpected = true

    for(var attr in options.attributes) {
      if(options.attributes.hasOwnProperty(attr)) {
        var expectedValue = options.attributes[attr]
        if(data[attr] !== expectedValue || (expectedValue === null && !data[attr])) {
          asExpected = false
          break
        }
      }
    }

    if(!asExpected) {
      console.log("filter", JSON.stringify(options.name), 'reject', data)
      this.reject()
    } else {
      console.log("filter", JSON.stringify(options.name), 'pass', data)
      this.next()
    }
  } else {
    console.log("filter", JSON.stringify(options.name), 'ignore', data)
    this.next()
  }
}
module.exports = filter
