
var assert = require('assert')

var filter = require('../lib/action/set.js')
var SonicMock = require('./mock/SonicMock.js')


describe('sc-set', function() {

  it('simple value', function(done) {
    var sonic = new SonicMock(filter, {set: {'attr1': 'value1'}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      assert.equal(entity.attr1, 'value1')
      done()
    })
    var entity = {}
    sonic.run(entity)
  })

  it('multiple values', function(done) {
    var sonic = new SonicMock(filter, {set: {'attr1': 'value1', 'attr2': 'value2'}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {}
    sonic.run(entity)
  })

  it('multiple values', function(done) {
    var sonic = new SonicMock(filter, {set: {'attr1': 'value1', 'attr2': 'value2'}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {}
    sonic.run(entity)
  })

  it('reference', function(done) {
    var sonic = new SonicMock(filter, {set: {'attr1': '{attr2}'}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      assert.equal(entity.attr1, 'value2')
      assert.equal(entity.attr2, 'value2')
      done()
    })
    var entity = {attr2: 'value2'}
    sonic.run(entity)
  })

  it('nested reference', function(done) {
    var sonic = new SonicMock(filter, {set: {'attr1': '{nested.attr1}', 'attr2': '{nested.attr2}'}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })

    sonic.next(function() {
      assert.equal(entity.attr1, 'value1')
      assert.equal(entity.attr2, 'value2')
      done()
    })

    var entity = {nested: {attr1: 'value1', attr2: 'value2'}}

    sonic.run(entity)
  })

})
