
var ObjectTree = require('object-tree')

var treeWalker = new ObjectTree()
var ot = new ObjectTree()

var WHOLE_DATA_REFERENCE = '{.}'

function bind(data, options) {
  var self = this
  //console.log('set', data, options)
  if(options.bindings) {
    var newData = {}
    for(var attr in options.bindings) {
      if(options.bindings.hasOwnProperty(attr)) {
        if(options.bindings[attr] === WHOLE_DATA_REFERENCE) {
          newData[attr] = data
        } else {
          newData[attr] = ot.lookupTemplate(options.bindings[attr], data)
        }
      }
    }

    this.inject(newData, function(err) {
      if(err) {
        self.reject(err)
      } else {
        self.next()
      }
    })
  } else {
    this.next()
  }
}

module.exports = bind
