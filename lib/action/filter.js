
var ObjectTree = require('object-tree')

var DEFAULT_ATTR_SEPARATOR = '.'

function filter(data, options) {


  if(options.attributes) {
    var separator = options.separator || DEFAULT_ATTR_SEPARATOR
    var asExpected = true
    var ot = new ObjectTree()
    for(var attr in options.attributes) {
      if(options.attributes.hasOwnProperty(attr)) {
        var expectedValue = options.attributes[attr]
        var actualValue = ot.lookup(attr, data)
        if(expectedValue === null && actualValue || expectedValue !== null && actualValue !== expectedValue) {
          asExpected = false
          break
        }
      }
    }

    if(!asExpected) {
      //console.log("filter", JSON.stringify(options.name), 'reject', data, 'expected:'+expectedValue, 'actual:'+data[attr])
      this.reject()
    } else {
      //console.log("filter", JSON.stringify(options.name), 'pass', data)
      this.next()
    }
  } else {
    //console.log("filter", JSON.stringify(options.name), 'ignore', data)
    this.next()
  }
}
module.exports = filter
