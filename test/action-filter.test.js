
var assert = require('assert')

var filter = require('../lib/action/filter.js')
var WorkyMock = require('./mock/WorkyMock.js')


describe('filter', function() {

  it('pass on no attributes defined', function(done) {
    var worky = new WorkyMock(filter, {})

    worky.reject(function() {
      assert.fail('unexpected reject')
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
    worky.next(function() {
      assert.fail('unexpected next')
    })

    worky.run({name: "entity1", status: "new"})

  })

  it('attribute name can represent a nested value (match)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"info.type": "cheese"}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      done()
    })

    worky.run({info: {type: "cheese"}})

  })

  it('attribute name can represent a nested value (mismatch)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"info.type": "cheese"}})

    worky.reject(function() {
      done()
    })
    worky.next(function() {
      assert.fail('unexpected reject')
    })

    worky.run({info: {type: "ham"}})

  })

  it('attribute name can represent a nested value (missing nested object)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"info.type": "cheese"}})

    worky.reject(function() {
      done()
    })
    worky.next(function() {
      assert.fail('unexpected reject')
    })

    worky.run({})

  })

  it('attribute name can define a regexp as value (match)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"name": "/^entity.*$/"}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      done()
    })

    worky.run({name: "entityXYZ"})

  })

  it('attribute name can define a regexp as value (match, case insensitive)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"name": "/^entity.*$/i"}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      done()
    })

    worky.run({name: "EnTiTyXYZ"})

  })

  it('attribute name can define a regexp as value (mismatch, case sensitive)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"name": "/^entity.*$/"}})

    var rejectCount = 0
    worky.reject(function() {
      rejectCount ++
      if(rejectCount === 3) {
        done()
      }
    })
    worky.next(function() {
      assert.fail('unexpected next')
    })

    worky.run({name: "entit"})
    worky.run({name: " entityXYZ"})
    worky.run({name: "foobarentityXYZ"})

  })

  it('attribute name can define a regexp as value (missing)', function(done) {
    var worky = new WorkyMock(filter, {attributes: {"name": "/^entity.*$/"}})

    worky.reject(function() {
      done()
    })
    worky.next(function() {
      assert.fail('unexpected next')
    })

    worky.run({name: null})

  })


})
