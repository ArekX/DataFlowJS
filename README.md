# DataFlowJS
DataFlow JS data binding JS library

# Usage

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
}); // "new DataFlow(data)"" also works.

// Bind all changes to myBoundData to all elements of class my-element
flow.bind({to: '.my-element', path: 'myBoundData'});
flow.bind({to: '#nested', as: 'html', path: 'nested.data.works'});

// All elements of .my-element are not showing my another data
flow.set("myBoundData", "my another data");

// span with id nested now has bold text also works as contents.
flow.set('nested.data.works', "<strong>also works</strong>");
</script>
```

# Building

Run `npm install` and then run `npm run build`.

# Testing

Run `npm install` and then `npm test` to run all Jest tests.
