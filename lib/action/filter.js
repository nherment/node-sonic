
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
        var regexp = extractRegexp(expectedValue)
        if(regexp) {
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


var regexp = /^\/(.*)\/([igm]){0,3}$/

/** try to transform a regexp string into a regexp or return undefined if it cannot parse the string as a regexp
 *
 * eg: '/^entity.*$/i' ==> new RegExp('^entity.*$', 'i')
 *
 * @param value
 * @returns {RegExp|undefined}
 */
function extractRegexp(value) {
  var regexpParseResult = regexp.exec(value)
  if(regexpParseResult) {
    return new RegExp(regexpParseResult[1], regexpParseResult[2])
  }
}

module.exports = filter
