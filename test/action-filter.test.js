
var assert = require('assert')

var filter = require('../lib/action/filter.js')
var WorkyMock = require('./mock/WorkyMock.js')


describe('filter', function() {

  it('pass on no attributes defined', function(done) {
    var worky = new WorkyMock(filter, {})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.modify(function() {
      assert.fail('unexpected modify')
    })
    worky.next(function() {
      done()
    })

    worky.run({name: "entity1", status: "new"})

  })

  it('pass on single attribute match', function(done) {
    var worky = new WorkyMock(filter, {attributes: {status: "new"}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.modify(function() {
      assert.fail('unexpected modify')
    })
    worky.next(function() {
      done()
    })

    worky.run({name: "entity1", status: "new"})

  })

  it('pass on multi attributes match', function(done) {
    var worky = new WorkyMock(filter, {attributes: {name: "entity1", status: "new"}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.modify(function() {
      assert.fail('unexpected modify')
    })
    worky.next(function() {
      done()
    })

    worky.run({name: "entity1", status: "new"})

  })

  it('reject on attribute mismatch', function(done) {
    var worky = new WorkyMock(filter, {attributes: {name: "entity1", status: "open"}})

    worky.reject(function() {
      done()
    })
    worky.modify(function() {
      assert.fail('unexpected modify')
    })
    worky.next(function() {
      assert.fail('unexpected next')
    })

    worky.run({name: "entity1", status: "new"})

  })


})
