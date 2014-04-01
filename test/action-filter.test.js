
var assert = require('assert')

var filter = require('../lib/action/filter.js')
var SonicMock = require('./mock/SonicMock.js')


describe('sc-filter', function() {

  it('pass on no attributes defined', function(done) {
    var sonic = new SonicMock(filter, {})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "entity1", status: "new"})

  })

  it('pass on single attribute match', function(done) {
    var sonic = new SonicMock(filter, {attributes: {status: "new"}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "entity1", status: "new"})

  })

  it('pass on multi attributes match', function(done) {
    var sonic = new SonicMock(filter, {attributes: {name: "entity1", status: "new"}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "entity1", status: "new"})

  })

  it('reject on attribute mismatch', function(done) {
    var sonic = new SonicMock(filter, {attributes: {name: "entity1", status: "open"}})

    sonic.reject(function() {
      done()
    })
    sonic.next(function() {
      assert.fail('unexpected next')
    })

    sonic.run({name: "entity1", status: "new"})

  })

  it('attribute name can represent a nested value (match)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"info.type": "cheese"}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({info: {type: "cheese"}})

  })

  it('attribute name can represent a nested value (mismatch)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"info.type": "cheese"}})

    sonic.reject(function() {
      done()
    })
    sonic.next(function() {
      assert.fail('unexpected reject')
    })

    sonic.run({info: {type: "ham"}})

  })

  it('attribute name can represent a nested value (missing nested object)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"info.type": "cheese"}})

    sonic.reject(function() {
      done()
    })
    sonic.next(function() {
      assert.fail('unexpected reject')
    })

    sonic.run({})

  })

  it('attribute name can define a regexp as value (match)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"name": "/^entity.*$/"}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "entityXYZ"})
  })

  it('attribute name can define a regexp as value (match, case insensitive)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"name": "/^entity.*$/i"}})

    sonic.reject(function() {
      assert.fail('unexpected reject')
    })
    sonic.next(function() {
      done()
    })

    sonic.run({name: "EnTiTyXYZ"})
  })

  it('attribute name can define a regexp as value (mismatch, case sensitive)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"name": "/^entity.*$/"}})

    var rejectCount = 0
    sonic.reject(function() {
      rejectCount ++
      if(rejectCount === 3) {
        done()
      }
    })
    sonic.next(function() {
      assert.fail('unexpected next')
    })

    sonic.run({name: "entit"})
    sonic.run({name: " entityXYZ"})
    sonic.run({name: "foobarentityXYZ"})
  })

  it('attribute name can define a regexp as value (missing)', function(done) {
    var sonic = new SonicMock(filter, {attributes: {"name": "/^entity.*$/"}})

    sonic.reject(function() {
      done()
    })
    sonic.next(function() {
      assert.fail('unexpected next')
    })

    sonic.run({name: null})
  })

  describe('$gt', function() {
    it('match', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gt': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 31})
    })

    it('mismatch (strict)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 29})
    })

    it('mismatch (equal)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 30})
    })

    it('missing', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({})
    })
  })

  describe('$gte', function() {
    it('match (strict)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gte': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 31})
    })

    it('match (equal)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gte': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 30})
    })

    it('mismatch', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gte': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 29})
    })

    it('missing', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$gte': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({})
    })
  })



  describe('$lt', function() {
    it('match', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lt': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 29})
    })

    it('mismatch (strict)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 31})
    })

    it('mismatch (equal)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 30})
    })

    it('missing', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({})
    })
  })

  describe('$lte', function() {
    it('match (strict)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lte': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 29})
    })

    it('match (equal)', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lte': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 30})
    })

    it('mismatch', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lte': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 31})
    })

    it('missing', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"price": {'$lte': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({})
    })
  })


  describe('$in', function() {
    it('include', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$in': ['new', 'open']}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      var cbCount = 0
      sonic.next(function() {
        cbCount ++
        if(cbCount == 2) {
          done()
        }
      })

      sonic.run({status: "open"})
      sonic.run({status: "new"})
    })

    it('exclude', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$in': ['new', 'open']}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({status: "closed"})
    })
  })


  describe('$nin', function() {
    it('include', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$nin': ['new', 'open']}}})

      sonic.reject(function() {
        cbCount ++
        if(cbCount == 2) {
          done()
        }
      })

      var cbCount = 0
      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({status: "open"})
      sonic.run({status: "new"})
    })

    it('exclude', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$nin': ['new', 'open']}}})

      sonic.reject(function() {
        assert.fail('unexpected reject')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({status: "closed"})
    })
  })

  describe('combined queries', function() {
    it('mistmatch', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$in': ['new', 'open']}, price: {'$gt': 30}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({status: "open", price: 20})
    })

    it('match', function(done) {
      var sonic = new SonicMock(filter, {attributes: {"status": {'$in': ['new', 'open']}, price: {'$gt': 30}}})

      sonic.reject(function() {
        assert.fail('unexpected next')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({status: "open", price: 200})
    })

  })

  describe('combined query parameters', function() {
    it('mistmatch both', function(done) {
      var sonic = new SonicMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 20})
    })

    it('mistmatch one', function(done) {
      var sonic = new SonicMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      sonic.reject(function() {
        done()
      })

      sonic.next(function() {
        assert.fail('unexpected next')
      })

      sonic.run({price: 200})
    })

    it('match', function(done) {
      var sonic = new SonicMock(filter, {attributes: {price: {'$gt': 30, '$lte': 100}}})

      sonic.reject(function() {
        assert.fail('unexpected next')
      })

      sonic.next(function() {
        done()
      })

      sonic.run({price: 90})
    })

  })

})



