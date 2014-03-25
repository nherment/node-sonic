
var assert = require('assert')

var Worky = require('../Worky.js')


var basicFlow = [
  {
    "action": "wy-fork",
    "forks": [
      [
        {
          "action": "wy-filter",
          "attributes": {
            "status": "new"
          }
        }, {
        "action": "wy-set",
        "set": {
          "filter": 1
        }
      }
      ],
      [
        {
          "action": "wy-filter",
          "attributes": {
            "status": "/[^new]/"
          }
        }, {
        "action": "wy-set",
        "set": {
          "filter": 2
        }
      }
      ]
    ]
  }
]


describe('basic flow', function() {

  it('works', function(done) {
    var worky = new Worky(basicFlow)
    var entity = {name: "entity1", status: "new"}
    worky.run(entity, function(err) {
      assert.ok(!err)
      assert.equal(entity.filter, 1)
      done()
    })


  })


})
