
var assert = require('assert')

var Worky = require('../Worky.js')


var basicFlow = {
  "entity": "case",
  "workflow": [
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
}


describe('basic flow', function() {

  it('works', function() {
//    var worky = new Worky(basicFlow)
//
//    worky.add({name: "entity1", status: "new"})
//    worky.add({name: "entity2", status: "open"})
//
//    worky.run(function(err, entities) {
//
//    })


  })


})
