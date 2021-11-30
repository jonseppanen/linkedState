
# linkedState

**Alternative** to react context, for when you feel like something simpler, lighter and quick to use.

Use linkedState with a **unique, but shared key** to have as many components as you want share the same state anywhere in the tree, without a higher order component or context.

**Objects** stored in the linked state are quickly deep compared and updated only when necessary.

**Promises** are auto resolved before applying to your components.

## How to Use

To use linked state in a component, replace **useState** with **useLinkedState**.

The **first** argument must be a **shared, unique key** for all the components you want to share this state.

The **second** argument is an optional **initial value** that will apply to the linked state if it hasn't already been set.

```javascript
//For an already existing value
const  [demoValue,  setDemoValue]  =  useLinkedState("unique/key.with/any.value");

//For a value with an optional initial value
const  [demoValue,  setDemoValue]  =  useLinkedState("unique/key.with/any.value",  { someKey:  "new value"  });
```


To get/set values outside components, it is just as easy. Use the **linkedState.set** and **linkedState.get** utility functions.


```javascript
//Sets the value of key 'unique/key.with/any.value' to "new value"

linkedState.set("unique/key.with/any.value",  "new value");

//Gets the value of key 'unique/key.with/any.value'

linkedState.get("unique/key.with/any.value");
```

That's it. Super simple and easy. Works across different vdom trees, portals, and pretty much anywhere.
