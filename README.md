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

# Installation

Installation is done using npm - `npm install --save @arekx/data-flow-js`.

# Examples

Examples are in html files `examples` folder.

# Building

Run `npm install` and then run `npm run build`.

# Testing

Run `npm install` and then `npm test` to run all Jest tests.

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

| method  | parameters | description |
| ------------- | ------------- | ------------- |
| constructor  | **data** - JSON object of data | Creates and instrantiantes new DataSource. |
| set | **name** - key which will be set  (dot notation is supported so that you can set `object.key1.key2.key3`, non-existing objects will be created), **data** - data which will be set to that key | Sets data to a specified name and runs updates. |
| get | **name** - key from which data will be returned (dot notation is supported so that you can get `object.key1.key2.key3`), **defaultValue** - default value which will be returned if key is not found | Returns value from key or default value |
| run | **callback** - function of type `function(data) { }` where user can set any of the data directly or change it. After that function finishes, update will be called. | Runs direct update on the specified data in the datasource and updates all relevant bindings. |
| update | None. | Runs update and updates all relevant bindings. |
| unbind | None. | Unbinds datasource from data, this will effectively unbind all dataflow bindings as well. |
| bindHandler | **handler** - handler which will be invoked on all changes. | Binds handler for any of the changes to datasource. Callback will be invoked with `this` set to the originating datasource. |
| unbindHandler | **handler** - handler which will be unbound from all changes | Unbinds handler from all changes to datasource. |


### DataFlow.Renderer Reference

| method  | parameters | description |
| ------------- | ------------- | ------------- |
| constructor  | None | Creates and instantiates new Renderer. |
| render | **boundElement** instance of `DataFlow.BoundElement` when calling `bind` or `DataFlow.bind`. | Renders bound element based on their configuration |
| set | **name** - renderer name which can be used in `as`, **callback** - renderer callback of type `function(boundElement, forElement) {}` which will be called | Sets renderer type which can be set to `as` when calling `bind` or `DataFlow.bind`. If existing renderer is specified it will be overwritten. |
| runOnBoundElement | **callback** - callback which will be ran of type `function(boundElement, forElement) {}`, **boundElement** - instance of `DataFlow.BoundElement` on which the callback will be called upon. | Runs callback on bound element where it's called based on whether element has multiple element or a single element. |

Also you can set static renderers which will be available on all new instances of `DataFlow.Renderer`, by calling:
`Renderer.setStaticRenderer(rendererName, callback)` signature is the same as `DataFlow.Renderer.set`

### DataFlow.BoundElement Reference

DataFlow's BoundElement is instantiated when `bind` function is called, it's an instance which manages
updates to an element defined by a selector.

| method  | parameters | description |
| ------------- | ------------- | ------------- |
| constructor  | config - JSON object (refer below for config) | Creates and instantiates new BoundElement. |
| getValue | (Optional) **defaultValue** - Default value which will be returned if original value does not exist. | Returns value or default value if key defined by `config.path` is not in datasource. |
| setValue | **value** - value which will be set. | Sets value in datasource defined by key set in `config.path`, after which this element will be updated. |
| run | **callback** - callback of type `function(value) {}` value which will be called. | Runs callback which allows you to update value got from datasource by path defined by `config.path` after which `DataSource.update()` is called to notify datasource of the changes. |
| update | None. | Runs update to re-render the changes. |
| unbind | None. | Unbinds element from listening to any changes in the datasource. |

### BoundElement configuration

| config | type | default | description |
| ------------- | ------------- | ------------- | ------------- |
| to  | String|Element|Mixed | - | Selector (if String) which will get the HTMLElement or any mixed type which will be used for rendering. |
| multiple | boolean | - (will be set from number of retrieved elements by default) | Whether or not element is considered multiple elements. |
| updateDisabled | boolean | false | Whether or not to update element on changes from datasource. |
| renderer | DataFlow.Renderer | - | Renderer which will be used to render elements. |
| dataSource | DataFlow.DataSource | - | DataSource which will be used read/set values. |
| path | String | - | Key which will be used to get values from DataSource, can be dot-notation. |
| as | String|Callback | text | Renderer which will be used. If String then renderer set from that string (by calling `Renderer.set` or `Renderer.setStaticRenderer`) from config will be used. |
| onBind | Callback(BoundElement) with (Element from BoundElement as `this`) | (noop function) | Function which will be called when data is bound to datasource. |
| onUpdate | Callback(Value, BoundElement) with (Element from BoundElement as `this`) | (noop function) | Function which will be called when data from datasource is updated. This will be called after onBind once to render the initial data. |
| onAfterRender | Callback(BoundElement) with (Element from BoundElement as `this`) | (noop function) | Function which will be called after data is rendered to element. |
| onUnbind | Callback(BoundElement) with (Element from BoundElement as `this`) | (noop function) | Function which will be called when `unbind` is called. |
