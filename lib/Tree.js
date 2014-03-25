
var _ = require('underscore')

function Tree(workflow) {
  var root
  if(!workflow.length || workflow.length > 0 && workflow[0].action === 'wy-fork') {
    root = new TreeNode({action: "wy-logger", message: "starting workflow"})
  } else if(workflow.length > 0) {
    root = new TreeNode(workflow.shift())
  }
  this._root = root
  this.parse(root, workflow)
}

Tree.prototype.root = function() {
  return this._root
}

Tree.prototype.parse = function(node, workflow) {
  if(workflow && workflow.length > 0) {
    for(var i = 0 ; i < workflow.length ; i++) {

      var options = workflow[i]

      // TODO: do not hardcode wy-fork like that
      if(options.action === 'wy-fork') {

        var forks = options.forks

        for(var j = 0 ; j < forks.length ; j++) {

          var fork = forks[j]

          if(_.isArray(fork) && fork.length > 0) {

            var next = new TreeNode(fork.shift())
            node.add(next)
            this.parse(next, fork)

          } else {
            // TODO: throw
          }
        }

      } else {

        var next = new TreeNode(options)
        node.add(next)
        node = next

      }
    }
  }
}


function TreeNode(options) {
  this._options = options
  this._children = []
}

TreeNode.prototype.add = function(node) {
//  console.log(this._options.action, "->", node.options().action)
  this._children.push(node)
}

TreeNode.prototype.options = function() {
  return this._options
}

TreeNode.prototype.children = function() {
  return this._children.slice()
}

TreeNode.prototype.next = function() {
  return this._children.shift()
}

module.exports = Tree
