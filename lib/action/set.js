
var ObjectTree = require('object-tree')

var treeWalker = new ObjectTree()

function set(data, options) {
  //console.log('set', data, options)
  if(options.set) {
    var modified = false

    for(var attr in options.set) {
      if(options.set.hasOwnProperty(attr)) {
        var setValue = options.set[attr]
        var ref = extractReference(setValue)
        if(ref) {
          setValue = treeWalker.lookup(ref, data)
        }


        if(data[attr] !== setValue) {
          modified = true
          data[attr] = setValue
        }
      }
    }
    this.next(modified)
  } else {
    this.next()
  }
}

var refRegExp = /^{.+}$/

function extractReference(str) {
  if(refRegExp.test(str)) {
    return str.substring(1, str.length-1)
  }
}

module.exports = set
