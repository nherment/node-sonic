
var assert = require('assert')

var filter = require('../lib/action/filter.js')
var WorkyMock = require('./mock/WorkyMock.js')


describe('wy-filter', function() {

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

  describe('$gt', function() {
    it('match', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gt': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 31})
    })

    it('mismatch (strict)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 29})
    })

    it('mismatch (equal)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 30})
    })

    it('missing', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({})
    })
  })

  describe('$gte', function() {
    it('match (strict)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gte': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 31})
    })

    it('match (equal)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gte': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 30})
    })

    it('mismatch', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gte': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 29})
    })

    it('missing', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$gte': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({})
    })
  })



  describe('$lt', function() {
    it('match', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lt': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 29})
    })

    it('mismatch (strict)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 31})
    })

    it('mismatch (equal)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 30})
    })

    it('missing', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({})
    })
  })

  describe('$lte', function() {
    it('match (strict)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lte': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 29})
    })

    it('match (equal)', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lte': 30}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 30})
    })

    it('mismatch', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lte': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 31})
    })

    it('missing', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"price": {'$lte': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({})
    })
  })


  describe('$in', function() {
    it('include', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$in': ['new', 'open']}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      var cbCount = 0
      worky.next(function() {
        cbCount ++
        if(cbCount == 2) {
          done()
        }
      })

      worky.run({status: "open"})
      worky.run({status: "new"})
    })

    it('exclude', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$in': ['new', 'open']}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({status: "closed"})
    })
  })


  describe('$nin', function() {
    it('include', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$nin': ['new', 'open']}}})

      worky.reject(function() {
        cbCount ++
        if(cbCount == 2) {
          done()
        }
      })

      var cbCount = 0
      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({status: "open"})
      worky.run({status: "new"})
    })

    it('exclude', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$nin': ['new', 'open']}}})

      worky.reject(function() {
        assert.fail('unexpected reject')
      })

      worky.next(function() {
        done()
      })

      worky.run({status: "closed"})
    })
  })

  describe('combined queries', function() {
    it('mistmatch', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$in': ['new', 'open']}, price: {'$gt': 30}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({status: "open", price: 20})
    })

    it('match', function(done) {
      var worky = new WorkyMock(filter, {attributes: {"status": {'$in': ['new', 'open']}, price: {'$gt': 30}}})

      worky.reject(function() {
        assert.fail('unexpected next')
      })

      worky.next(function() {
        done()
      })

      worky.run({status: "open", price: 200})
    })

  })
  describe('combined query parameters', function() {
    it('mistmatch both', function(done) {
      var worky = new WorkyMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 20})
    })

    it('mistmatch one', function(done) {
      var worky = new WorkyMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      worky.reject(function() {
        done()
      })

      worky.next(function() {
        assert.fail('unexpected next')
      })

      worky.run({price: 200})
    })

    it('match', function(done) {
      var worky = new WorkyMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      worky.reject(function() {
        assert.fail('unexpected next')
      })

      worky.next(function() {
        done()
      })

      worky.run({price: 90})
    })

  })

})
