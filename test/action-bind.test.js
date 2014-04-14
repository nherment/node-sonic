
var assert = require('assert')

var bind = require('../lib/action/bind.js')
var SonicMock = require('./mock/SonicMock.js')


describe('sc-bind', function() {

  it('pass on no bindings defined', function(done) {
    var sonic = new SonicMock(bind, {})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.inject(function() {
      assert.fail('unexpected inject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "entity1", status: "new"})

  })

  it('bindings should be set', function(done) {

    var obj = {name: "entity1", status: "new", foobar: {nested: Date.now()}}

    var sonic = new SonicMock(bind, {bindings: {
      attr1: '{name}',
      attr2: '{foobar.nested}',
      attr3: 12345
    }})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })

    sonic.inject(function(data, cb) {
      assert.ok(data)
      assert.equal(data.attr1, obj.name)
      assert.equal(data.attr2, obj.foobar.nested)
      assert.equal(data.attr3, 12345)
      cb()
    })

    sonic.next(function() {
      done()
    })


    sonic.run(obj)

  })

  it('"this" semantic should set the whole data', function(done) {

    var obj = {name: "entity1", status: "new", foobar: {nested: Date.now()}}

    var sonic = new SonicMock(bind, {bindings: {
      attr1: '{.}'
    }})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })

    sonic.inject(function(data, cb) {
      assert.ok(data)
      assert.ok(data.attr1)
      assert.equal(data.attr1.name, obj.name)
      assert.equal(data.attr1.status, obj.status)
      assert.equal(data.attr1.foobar, obj.foobar)
      assert.equal(data.attr1.foobar.nested, obj.foobar.nested)
      cb()
    })

    sonic.next(function() {
      done()
    })


    sonic.run(obj)

  })


})



