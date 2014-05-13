var util = require("util");
var EventEmitter = require("events").EventEmitter;

var Tree = require('./lib/Tree.js')

var globalActions = {
  "sc-logger"     : require('./lib/action/logger.js'),
  "sc-filter"     : require('./lib/action/filter.js'),
  "sc-set"        : require('./lib/action/set.js'),
  "sc-bind"       : require('./lib/action/bind.js')
}

function Sonic(flow) {
  this._tree = new Tree(flow)
  this._actions = {}
  this._idleMemory = []
  this._activeMemory = []
}

Sonic.prototype.register = function(name, func) {
  this._actions[name] = func
}

Sonic.prototype.insert = function(obj) {
  if(this._activeMemory.indexOf(obj) === -1) {
    this._activeMemory.push(obj)
  }
}

Sonic.prototype.memRun = function(callback) {
  var allDone = 0
  var errors = null
  function done(err) {
    if(err) {
      if(!errors) {
        errors = []
      }
      errors.push(err)
    }
    allDone --
    if(allDone === 0) {
      callback(errors)
    }
  }

  while(this._activeMemory.length > 0) {
    var obj = this._activeMemory.pop()
    this.run(obj, done)
    this._idleMemory.push(obj)
  }
}

Sonic.prototype.run = function(object, callback) {
  //this.printTreeFlow()
  var self = this
  var runner = new Runner(this._tree.root(), object, this)
  runner.on('reject', function(err) {
    if(err || !runner.modified()) {
      callback(err)
    } else {
      // TODO: prevent infinite loop
      self.run(object, callback)
    }
  })
  runner.on('next', function() {
    if(runner.modified()) {
      // TODO: prevent infinite loop
      self.run(object, callback)
    } else {
      callback(undefined)
    }
  })
  runner.run()
}

Sonic.prototype.action = function(actionName) {
  var func = globalActions[actionName]
  if(!func) {
    func = this._actions[actionName]
  }
  if(!func) {
    throw new Error('unkown action ['+actionName+']')
  }
  return func
}

Sonic.prototype.printTreeFlow = function() {
  this._tree.root().print()
}

function Runner(node, data, sonic) {
  if(!data) {
    throw new Error('missing data')
  }
  EventEmitter.call(this);
  this._node = node
  this._data = data
  this._modified = false
  this._sonic = sonic
}

util.inherits(Runner, EventEmitter);

Runner.prototype.modified = function() {
  return this._modified
}

Runner.prototype.run = function() {
  // TODO: support timeout in options and enforce it
  var options = this._node.options()
  var func = this._sonic.action(options.action)
  //console.log('run', options.action, JSON.stringify(this._data), JSON.stringify(options))
  func.call(this, this._data, options)
}

Runner.prototype.next = function(modified) {
  var self = this
  this._modified = this._modified || modified
  var children = this._node.children()

  function nextChild() {
    // it is important here to have a depth first approach when walking the tree
    if(children && children.length > 0) {
      var callbackInvoked = false
      var node = children.shift()
      var runner = new Runner(node, self._data, self._sonic)
      runner.on('next', function() {
        if(!callbackInvoked) {
          callbackInvoked = true
          self._modified = self._modified || runner.modified()
          nextChild()
        } else {
          // TODO: use a logger
          console.error('multiple invocation of callback', node.options())
        }
      })
      runner.on('reject', function(err) {
        // TODO: log errors that happen in a fork but do not propagate them
        if(err) {
          self.reject(err) // propagate the error
          return // game over because of the error
        }
        if(!callbackInvoked) {
          callbackInvoked = true
          nextChild()
        } else {
          // TODO: use a logger
          console.error('multiple invocation of callback', node.options())
        }
      })
      runner.run()
    } else {
      self.emit('next')
    }
  }

  nextChild()
}

Runner.prototype.reject = function(err) {
  this.emit('reject', err)
}

Runner.prototype.inject = function(data, callback) {
  this._sonic.run(data, function() {
    if(callback) {
      callback(undefined)
    }
  })

}

module.exports = Sonic
