import DataFlow from './data-flow';

describe('DataFlow specification', () => {
  test('Dataflow can be bound on element', () => {
      var flow = createDataFlow(`
          <span id="custom"></span>
      `, {text: 'custom value'});

      var instance = flow.bind({to: '#custom', path: 'text'});
      expectFieldToBe('#custom', 'textContent', 'custom value');
  });

  test('Dataflow changing datasource via bound element value will change element value', () => {
      var flow = createDataFlow(`
          <span></span>
          <span></span>
          <strong></strong>
      `, {text: 'custom bound el value'});

      var instance = flow.bind({to: 'span, strong', path: 'text'});
      expectFieldToBe('span, strong', 'textContent', 'custom bound el value');
      instance.setValue('another value');
      expectFieldToBe('span, strong', 'textContent', 'another value');
  });

  test('Dataflow changing datasource value will change element value', () => {
      var source = new DataFlow.DataSource({text: 'custom datasource value'});
      var flow = createDataFlow(`
          <span></span>
          <span></span>
          <strong></strong>
      `, source);

      var instance = flow.bind({to: 'span, strong', path: 'text'});
      expectFieldToBe('span, strong', 'textContent', 'custom datasource value');
      source.set('text', 'another value');
      expectFieldToBe('span, strong', 'textContent', 'another value');
  });

  test('Dataflow custom renderer value will render it using that', () => {
    var renderer = new DataFlow.Renderer();
    var flow = createDataFlow(`
      <span></span>
      <span></span>
      <strong></strong>
    `, {text: 'custom renderer value'}, renderer);

    renderer.set('customMain', function(boundElement, element) {
        element.innerHTML = boundElement.getValue();
    });

    flow.bind({to: 'span, strong', path: 'text', as: 'customMain'});
    expectFieldToBe('span, strong', 'innerHTML', 'custom renderer value');
  });
});

function expectFieldToBe(selector, fieldName, value) {
    var items = document.querySelectorAll(selector);

    for(var i = 0; i < items.length; i++) {
        expect(items[i][fieldName]).toBe(value);
    }
}

function createDataFlow(documentBody, dataSource, renderer) {
    document.body.innerHTML = documentBody;
    return DataFlow(dataSource, renderer);
}
