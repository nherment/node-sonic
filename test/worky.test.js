
var assert = require('assert')

var Worky = require('../Worky.js')


var flow = [
  {
    "action": "wy-fork",
    "forks": [
      [
        {
          "action": "wy-filter",
          "name": "new only",
          "attributes": {
            "status": "new"
          }
        },
        {
          "action": "wy-set",
          "name": "filter1",
          "set": {
            "filter": 1
          }
        }
      ],
      [
        {
          "action": "wy-filter",
          "name": "open only",
          "attributes": {
            "status": "open"
          }
        },
        {
          "action": "wy-set",
          "name": "filter2",
          "set": {
            "filter": 2
          }
        }
      ],
      [
        {
          "action": "wy-filter",
          "name": "entity3, secondPass",
          "attributes": {
            "name": "entity3",
            "secondPass": true
          }
        },
        {
          "action": "wy-set",
          "name": "entity3, success",
          "set": {
            "success": true
          }
        }
      ]
      [
        {
          "action": "wy-filter",
          "name": "entity3, firstPass",
          "attributes": {
            "name": "entity3",
            "secondPass": null
          }
        },
        {
          "action": "wy-set",
          "name": "entity3, set secondPass",
          "set": {
            "secondPass": true
          }
        }
      ]
    ]
  }
]


describe('basic flow', function() {

//  it('fork1', function(done) {
//    var worky = new Worky(flow)
//    var entity = {name: "entity1", status: "new"}
//    worky.run(entity, function(err) {
//      assert.ok(!err)
//      assert.equal(entity.filter, 1)
//      done()
//    })
//  })
//
//  it('fork2', function(done) {
//    var worky = new Worky(flow)
//    worky.printTreeFlow()
//    var entity = {name: "entity2", status: "open"}
//    worky.run(entity, function(err) {
//      assert.ok(!err)
//      assert.equal(entity.filter, 2)
//      done()
//    })
//  })

  it('modified objects are re-processed', function(done) {
    var worky = new Worky(flow)
    var entity = {name: "entity3"}
    worky.run(entity, function(err) {
      assert.ok(!err)
      assert.ok(entity.secondPass, "JSON 'null' value should do be falsy match")
      assert.ok(entity.success, "the entity was not re-processed")
      done()
    })
  })


})
