var _ = require('underscore')

function WorkyMock(fn, options) {
  this._func = fn
  this._options = options
  this._data = []
}

WorkyMock.prototype.run = function(data) {
  this._func.call(this, data, this._options)
}

WorkyMock.prototype.reject = function(arg) {
  if(_.isFunction(arg)) {
    this._reject = arg
  } else if(this._reject) {
    this._reject(arg)
  } else {
    throw new Error('unexpected call to "reject()"')
  }
}

WorkyMock.prototype.next = function(arg) {
  if(_.isFunction(arg)) {
    this._next = arg
  } else if(this._next) {
    this._next(arg)
  } else {
    throw new Error('unexpected call to "next()"')
  }
}

module.exports = WorkyMock
