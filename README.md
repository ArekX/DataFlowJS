# DataFlowJS

DataFlow JS data binding JS library. It is used to bind multiple HTML elements
to a single JSON data object. The idea is to track all changes and to allow user
not to worry about updating all places one a single piece of data is changed but
to move all of the concerns of rendering to their respective elements to make
development easier to handle and debug.

This library is not meant to be a replacement for component management libraries
like `Angular`, `VueJS` and `React`. It is meant to be a simple small library which
will allow you to handle data better and it can be together with those component
libraries (with some additional implementation of course).

You can also use this to get benefits of one-way databinding (two-way databinding
is also possible) without having to import the whole library.

If you are developing complex SPA app with routing on the client side with lots
of components and it needs to be JS Client App on frontend with REST backend then
this probably is not for you. It can be used for this but you will probably have
more success using the abovementioned libraries.

If you have a server-side rendered web app which needs to implement a lot of JS
interactivity then this is probably a perfect solution to handle lots of complexity
brought out by manipulating data.

# Simple Usage Example

```html

<span class="my-element"></span>
<span class="my-element"></span>
<span id="nested"></span>

<script src="data-flow.js"></script>
<script>
var flow = DataFlow({
   myBoundData: 'my data',
   nested: {
      data: {
         works: 'too'
      }
   }
}); // new DataFlow(data)" also works if you need to use that.

// Bind all changes to myBoundData to all elements of class my-element
flow.bind({to: '.my-element', path: 'myBoundData'});
flow.bind({to: '#nested', as: 'html', path: 'nested.data.works'});

// All elements of .my-element are not showing my another data
flow.set("myBoundData", "my another data");

// span with id nested now has bold text also works as contents.
flow.set('nested.data.works', "<strong>also works</strong>");
</script>
```

# Reference

### DataFlow

`DataFlow` is the main usage function which binds the data json as a `DataSource`.

When invoking `DataFlow({some: 'data'})` it will return instance of `DataSource` with
some additional functions like `bind` and having access to `renderer` to configure
rendering.

Even though DataFlow implements default renderers for `text`, `html` and a `function() {}` callback, you can pass your own renderer or set a static renderer.

`DataFlow` accepts two a parameters: `object|DataFlow.DataSource` and `DataFlow.Renderer`.

First parameter can be either object (which will get turned to a datasource) or
`DataFlow.DataSource` instance to which the bindings will be set.
If `DataFlow.Renderer` is not defined then new one will be created.

DataFlow returns passed or new instance of `DataFlow.DataSource` with added `bind` function and added `renderer`.

### DataFlow.DataSource Reference

| method  | parameters | description
| ------------- | ------------- |
| constructor  | **data** - JSON object of data | Creates and instrantiantes new DataSource.
| set | **name** - key which will be set  (dot notation is supported so that you can set `object.key1.key2.key3`, non-existing objects will be created), **data** - data which will be set to that key | Sets data to a specified name and runs updates.
| get | **name** - key from which data will be returned (dot notation is supported so that you can get `object.key1.key2.key3`), **defaultValue** - default value which will be returned if key is not found | Returns value from key or default value
| run | **callback** - function of type `function(data) { }` where user can set any of the data directly or change it. After that function finishes, update will be called. | Runs direct update on the specified data in the datasource and updates all relevant bindings.
| update | None. | Runs update and updates all relevant bindings.
| unbind | None. | Unbinds datasource from data, this will effectively unbind all dataflow bindings as well.
| bindHandler | **handler** - handler which will be invoked on all changes. | Binds handler for any of the changes to datasource. Callback will be invoked with `this` set to the originating datasource.
| unbindHandler | **handler** - handler which will be unbound from all changes | Unbinds handler from all changes to datasource.

# Example - TODO List

Let us create data for todo list. There is a finished example in `examples` folder as `todo-example.html`

First we will need html:

```html
<h1>Count: <span id="todo-count"></span></h1>
<ul id="list"></ul>

<div>
    <input type="text" id="todo" value="">
    <button type="button" id="addItem">Add</button>
</div>
```

You will need to include `data-flow.js` or `data-flow.min.js`:
`<script src="dist/data-flow.min.js"></script>`

Then you define your todo data flow:

```js
var flow = DataFlow({items: [
   'finish programming task',
   'get coffee'
], name: ''});
```

First we bind to count which will show number of todo items added:

```js
flow.bind({to: '#todo-count', path: 'items.length'});
```

Since `length` is a parameter of items array. You can also traverse that. When items
changes count will be re-rendered.

Now we add list binding:

```js
var list = flow.bind({
    to: "#list",
    path: "items",
    as: function(boundEl, el) {
       el.innerHTML = boundEl.getValue().map(function(i) {
          return "<li>" + i + " <button>X</button></li>";
       }).join("\n");
   },
   onAfterRender: function(boundEl) {
       var items = boundEl.element.querySelectorAll('li button');

       for(var i = 0; i < items.length; i++) {
           addRemoveHandler(boundEl, items[i], i);
       }
   }
});

function addRemoveHandler(boundElement, item, index) {
  item.onclick = function() {
       boundElement.run(function(items) {
           items.splice(index, 1);
       });
  };
}
```

This will need some deconstruction:
1. We bind to `to` selector for `ul` element with id `list`.
2. We will bind that to path `items`
3. As accepts `text`, `html` or a callback function by default. Since we need to renderer list items as `li` elements we need to implement that so we will pass callback function here. A better implementation might be to define a renderer type for items but we will do this for simplicity.
4. We define `onAfterRender` which will attach click event on all `li` elements so that they can be removed when clicking on the button on them.

And now we will define input and an add button to add todos.

```js
var btn = document.querySelector('#addItem');
btn.onclick = function() {
  list.run(function(items) {
      items.push(input.getValue());
  });
  input.setValue('');
};

var input = flow.bind({
  to: '#todo',
  path: 'name',
  as: function(boundEl, el) {
     el.value = boundEl.getValue();
  },
  onBind: function(boundEl) {
       this.oninput = function() {
             boundEl.setValue(boundEl.element.value);
       };
       this.onkeypress = function(e) {
           if (e.which === 13) {
               btn.click();
           }
       }
  }
});
```

1. We will add btn event so that clicking on in calls push function to add entered
text from input to the list and clearst the input to accept next item.
2. We will bind to the input itself so that `oninput` event will update the
datasource so that we can add that item to the list.
3. `onkeypress` is for simplification so that we can add items when hitting `enter` key.

# Building

Run `npm install` and then run `npm run build`.

# Testing

Run `npm install` and then `npm test` to run all Jest tests.
