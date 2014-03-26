
var ObjectTree = require('object-tree')
var _ = require('underscore')

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

        if(isRegexp(expectedValue)) {
          var regexp = new RegExp(expectedValue.substring(1, expectedValue.length-2))
          asExpected = regexp.test(actualValue)
        } else if(expectedValue === null && actualValue || expectedValue !== null && actualValue !== expectedValue) {
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

function isRegexp(value) {
  if(_.isString(value) && value.length >= 3 && value[0] === '/' && value[value.length-1] === '/') {
    return true
  }
  return false
}

module.exports = filter
