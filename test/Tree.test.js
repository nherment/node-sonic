

var assert = require('assert')

var Tree = require('../lib/Tree.js')


var basicFlow = [{
    "action": "action1"
  },
  {
    "action": "wy-fork",
    "forks": [
      [
        {
          "action": "action2"
        }, {
          "action": "action3"
        }
      ],
      [
        {
          "action": "action4"
        }, {
          "action": "action5"
        }
      ]
    ]
  }
]


describe('Tree', function() {

  it('basic fork', function() {
    var tree = new Tree(basicFlow)
    var action1 = tree.root()
    action1.print()
    assert.ok(action1)
    assert.ok(action1.options())
    assert.equal(action1.options().action, "action1")

    var action2 = action1.next()
    assert.ok(action2)
    assert.ok(action2.options())
    assert.equal(action2.options().action, "action2")

    var action3 = action2.next()
    assert.ok(action3)
    assert.ok(action3.options())
    assert.equal(action3.options().action, "action3")

    var action4 = action1.next()
    assert.ok(action4)
    assert.ok(action4.options())
    assert.equal(action4.options().action, "action4")

    var action5 = action4.next()
    assert.ok(action5)
    assert.ok(action5.options())
    assert.equal(action5.options().action, "action5")

    assert.ok(!action1.next())
    assert.ok(!action2.next())
    assert.ok(!action3.next())
    assert.ok(!action4.next())
    assert.ok(!action5.next())


  })


})
