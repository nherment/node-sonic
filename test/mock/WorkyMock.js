
function WorkyMock(fn, options) {
  this._func = fn
  this._options = options
  this._data = []
}

WorkyMock.prototype.run = function(data) {
  this._func.call(this, data, this._options)
}

WorkyMock.prototype.reject = function(fn) {
  if(fn) {
    this._reject = fn
  } else if(this._reject) {
    this._reject()
  } else {
    throw new Error('unexpected call to "reject()"')
  }
}

WorkyMock.prototype.next = function(fn) {
  if(fn) {
    this._next = fn
  } else if(this._next) {
    this._next()
  } else {
    throw new Error('unexpected call to "next()"')
  }
}

module.exports = WorkyMock
