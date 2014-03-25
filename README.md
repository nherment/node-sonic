[![Build Status](https://api.travis-ci.org/nherment/node-worky.png?branch=master)](https://travis-ci.org/nherment/node-worky)


Worky is a customisable workflow engine with some nice out of the box features.


### install

    npm install --save worky


### use

    var Worky = require('worky')

    var worky = new Worky(workflow)

    var data = {attr1: 'val1', attr2: 'val2'}
    worky.run(data, function(err) {
      // data as modified by worky
    })

### workflow

The workflow can be seen as a decision tree. An object is passed to the top of the tree through
```worky.run(object, ...)```. Each node can take the decision to modify the object, then reject or pass it to a child
node.
When the data has passed over all the branches (except those from which it were rejected), and if the data was modified,
it is passed again to the top of the node. This makes sure that the data ends in a 'stable' state where all nodes agree
that the data does not need to be modified anymore.

For example, let's say that we have 2 different paths in our workflow. The top node is just a 'fork' node that will make
sure our data is injected in the children 'branches'.

Let's assume we have a business logic that deals with tickets.

- the first branch has a filter that checks if the ticket is in 'open' state. Therefore all subsequent actions of this
branch will apply to a ticket that is 'opened'. Another filter of this branch only applies if the ticket is marked as
'spam'. If so, the ticket status is changed to 'closed'.
- the second branch only applies to 'closed' tickets and then archive the ticket if it matches the criteria.

The decision tree would look like this:

```
         [fork]
         /    \
        /     \
    [open]   [closed]
      /          \
     |           |
 [is spam]   [archive]
     |
     |
  [close]
```

if the ```[close]``` action marks the ticket as 'modified' (using ```this.next(true)```), the ticket will make it back
to the top of the decision tree, be recognised as ```[closed]``` and end up being archived.

This is the behaviour that you want because it makes sure that the data exits the workflow in a 'stable' state (meaning
there is no work left un-done)

### custom actions

a custom action can be registered

    worky.register(actionName, function(data, options) {
      // data is the data object
      // options contain the workflow options:
      //   options.action => the action name
      //   options.... => any attribute as defined in the workflow

      // pass to the next handler. optional boolean argument if the data has been modified by the current action.
      this.next(true|false)

      // exit the current 'branch'. optional error object. Passing an error will cause the whole workflow to stop (not
      // only the current branch)
      this.reject(err)
    })

and invoked in the workflow

    var workflow = [
      {
        action: actionName // our custom action name
        ...
      }
    ]


Only one of ```this.next()``` or ```this.reject()``` can be called in a given action. Calling both will result in an
error thrown and the workflow exited. Also, the data may end up in a corrupted state (unfinished branch execution).


## default actions

A number of actions are defined by worky. All these actions contain the ```wy-``` prefix to prevent any collision with
your own defined actions.
Although you can override these actions by registering them yourself (eg. ```worky.register('wy-filter', ...)```) it is
recommended that you register your actions with your own prefix so that it can act as a namespace.

### wy-filter

Example:

```
{
  "action": "wy-filter",
  "name": "entity3, secondPass",
  "attributes": {
    "name": "entity3",
    "secondPass": true,
    "success": null
  }
}
```

will filter out (ie. reject from the current workflow branch) any data for which one of the following apply:
- attribute ```name``` is not strictly equal to ```"entity3"```
- attribute ```secondPass``` is not strictly equal to ```true```
- attribute ```success``` is "truthy"

Attributes can also contain a regular expression. for example:

```
{
  "action": "wy-filter",
  "attributes": {
    "name": "/^caramel/",
  }
}
```

will filter out any data for which the ```name``` attribute is not a string which starts with ```caramel```.

Attributes match can be nested. For example:

```
{
  "action": "wy-filter",
  "attributes": {
    "info.nested": true,
  }
}
```

will filter out any data for which does not have attribute ```info``` which is an object with attribute ```nested```
strictly equal to ```true```.

