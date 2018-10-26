import Renderer from './renderer';
import BoundElement from './bound-element';
import DataSource from './data-source';

describe('renderer initialization', () => {
  test('renderer is initialized correctly', () => {
      var renderer = new Renderer();
      expect(Object.keys(renderer.renderers)).toEqual(['html', 'text']);
  });
});

describe('renderer rendering', () => {
  test('renderer will render correctly to text', () => {
      var renderer = new Renderer();
      var el = {textContent: ''};
      var boundElement = createBoundElement(el, 'text', 'custom value');
      renderer.render(boundElement);
      expect(el.textContent).toBe('custom value');
  });

  test('renderer will render correctly to callback is as is a function', () => {
      var renderer = new Renderer();
      var el = {field: ''};
      var boundElement = createBoundElement(el, function(boundEl, el) {
          el.field = boundEl.getValue();
      }, 'custom value');

      renderer.render(boundElement);

      expect(el.field).toBe('custom value');
  });

  test('renderer will render correctly to html', () => {
      var renderer = new Renderer();
      var el = {innerHTML: ''};
      var boundElement = createBoundElement(el, 'html', 'custom value');
      renderer.render(boundElement);
      expect(el.innerHTML).toBe('custom value');
  });

  test('setting custom renderer will render it', () => {
      var renderer = new Renderer();
      var el = {custom: ''};
      var boundElement = createBoundElement(el, 'custom', 'custom value');

      renderer.set('custom', function(boundEl, el) {
          el.custom = boundEl.getValue();
      });

      renderer.render(boundElement);
      expect(el.custom).toBe('custom value');
  });

  test('setting static custom renderer will render it from bound element', () => {
      Renderer.setStaticRenderer('custom', function(boundEl, el) {
          el.customStatic = boundEl.getValue();
      });

      var el = {customStatic: ''};
      var boundElement = createBoundElement(el, 'custom', 'custom value');
      boundElement.renderer.render(boundElement);
      expect(el.customStatic).toBe('custom value');
  });

  test('rendering unknown renderer will throw an error', () => {
    var renderer = new Renderer();
    var el = {custom: ''};
    var boundElement = createBoundElement(el, 'unknown_renderer', 'custom value');

    expect(function() {
        renderer.render(boundElement);
    }).toThrow('Unknown renderer: unknown_renderer');
  });

  test('rendering on multiple elements will set all element to same value', () => {
    var renderer = new Renderer();
    var el = [
      {textContent: ''},
      {textContent: ''},
      {textContent: ''}
    ];
    var boundElement = createBoundElement(el, 'text', 'custom value');
    renderer.render(boundElement);

    for(var i = 0; i < el.length; i++) {
       expect(el[i].textContent).toBe('custom value');
    }
  });

  test('renderer with runOnBoundElement render with callback', () => {
      var renderer = new Renderer();
      var el = {customRunOnBoundElement: ''};
      var boundElement = createBoundElement(el, 'text', 'custom value');
      renderer.runOnBoundElement(function(boundEl, el) {
          el.customRunOnBoundElement = boundEl.getValue();
      }, boundElement);
      expect(el.customRunOnBoundElement).toBe('custom value');
  });
});

describe('renderer callbacks', () => {
  test('after render call afterRender will be called from bound element', () => {
    var renderer = new Renderer();
    var boundElement = createBoundElement({textContent: ''}, 'text', 'custom value');
    var handler = jest.fn(() => {});
    boundElement.onAfterRender = handler;
    renderer.render(boundElement);
    expect(handler.mock.calls.length).toBe(1);
  });

  test('after runOnBoundElement call afterRender will be called from bound element', () => {
    var renderer = new Renderer();
    var boundElement = createBoundElement({customRunOnBoundElement: ''}, 'text', 'custom value');
    var handler = jest.fn(() => {});
    boundElement.onAfterRender = handler;
    renderer.runOnBoundElement(function(boundEl, el) {
        el.customRunOnBoundElement = boundEl.getValue();
    }, boundElement);
    expect(handler.mock.calls.length).toBe(1);
  });
});

function createBoundElement(element, as, value) {
    var config = {
      dataSource: new DataSource({value: value}),
      renderer: new Renderer(),
      to: element,
      path: 'value',
      as: as,
      updateDisabled: true
    };

    return new BoundElement(config);
}
