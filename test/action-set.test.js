
var assert = require('assert')

var filter = require('../lib/action/set.js')
var WorkyMock = require('./mock/WorkyMock.js')


describe('wy-set', function() {

  it('simple value', function(done) {
    var worky = new WorkyMock(filter, {set: {'attr1': 'value1'}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      assert.equal(entity.attr1, 'value1')
      done()
    })
    var entity = {}
    worky.run(entity)
  })

  it('multiple values', function(done) {
    var worky = new WorkyMock(filter, {set: {'attr1': 'value1', 'attr2': 'value2'}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {}
    worky.run(entity)
  })

  it('multiple values', function(done) {
    var worky = new WorkyMock(filter, {set: {'attr1': 'value1', 'attr2': 'value2'}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {}
    worky.run(entity)
  })

  it('reference', function(done) {
    var worky = new WorkyMock(filter, {set: {'attr1': '{attr2}'}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })
    worky.next(function() {
      assert.equal(entity.attr1, 'value2')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {attr2: 'value2'}
    worky.run(entity)
  })

  it('nested reference', function(done) {
    var worky = new WorkyMock(filter, {set: {'attr1': '{nested.attr1}', 'attr2': '{nested.attr2}'}})

    worky.reject(function() {
      assert.fail('unexpected reject')
    })

    worky.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })

    var entity = {nested: {attr1: 'value1', attr2: 'value2'}}

    worky.run(entity)
  })

})
