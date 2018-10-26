import BoundElement from './bound-element';
import DataSource from './data-source';
import Renderer from './renderer';
import jsdom from 'jsdom';
import {noop} from './bound-element';

describe('bound element initialization/destruction', () => {
    test('element will get initialized correctly', () => {
        var node = {textContent: ''};
        var renderer = new Renderer();
        var dataSource = new DataSource();
        var bound = createBoundElement({
            to: node,
            renderer: renderer,
            dataSource: dataSource,
            path: "custom.path.to.data"
        });
        expect(bound.element).toBe(node);
        expect(bound.renderer).toBe(renderer);
        expect(bound.dataSource).toBe(dataSource);
        expect(bound.path).toBe("custom.path.to.data");
        expect(bound.as).toBe("text");
        expect(bound._bound).toBe(true);
        expect(bound.multiple).toBe(false);
        expect(bound.updateDisabled).toBe(false);
        expect(typeof bound._boundHandler).toBe("function");

        expect(bound._bound).toBe(true);
        expect(bound.onBind).toBe(noop);
        expect(bound.onUpdate).toBe(noop);
        expect(bound.onUnbind).toBe(noop);
        expect(bound.onAfterRender).toBe(noop);
    });

    test('element will be unbound correctly', () => {
        var node = {textContent: ''};
        var bound = createBoundElement({
            to: node
        });
        expect(bound._bound).toBe(true);
        bound.unbind();
        expect(bound._bound).toBe(false);
    });

    test('element with multiple config will be set to multiple', () => {
        var bound = createBoundElement({
            multiple: true
        });
        expect(bound.multiple).toBe(true);
    });

    test('element multiple will be true if passed element is array', () => {
        var bound = createBoundElement({
            to: [{textContent: ''}, {textContent: ''}, {textContent: ''}]
        });
        expect(bound.multiple).toBe(true);
    });

    test('element config html will have that as a renderer', () => {
        var bound = createBoundElement({
           as: 'html'
        });
        expect(bound.as).toBe('html');
    });

    test('element invoking with a selector would find those elements', () => {
        document.body.innerHTML = `
            <span class="test-element"></span>
            <span class="test-element"></span>
            <span></span>
        `;
        var bound = createBoundElement({
           to: '.test-element'
        });

        expect(bound.multiple).toBe(true);
        expect(bound.element).toBeInstanceOf(NodeList);

        for(var i = 0; i < bound.element.length; i++) {
            var classList = bound.element[i].classList;
            expect(classList.length).toBe(1);
            expect(classList[0]).toBe('test-element');
        }
    });

    test('single element invoking with a selector have only one element and not a node list', () => {
        document.body.innerHTML = `
            <span class="test-element"></span>
            <span></span>
        `;
        var bound = createBoundElement({
           to: '.test-element'
        });

        expect(bound.multiple).toBe(false);
        expect(bound.element).not.toBeInstanceOf(NodeList);
    });
});

describe('bound element events', () => {
  test('element onBind will be called after initialization', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onBind: handler
      });
      expect(handler.mock.calls.length).toBe(1);
  });

  test('element onUpdate will be called after initialization when not disabled', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onUpdate: handler
      });
      expect(handler.mock.calls.length).toBe(1);
  });

  test('element onUpdate will NOT be called after initialization when disabled', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onUpdate: handler,
          updateDisabled: true
      });
      expect(handler.mock.calls.length).toBe(0);
  });

  test('element onUnbind will be called when item is unbound', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onUnbind: handler
      });
      bound.unbind();
      expect(handler.mock.calls.length).toBe(1);
  });

  test('element onUnbind will NOT be called when item is not unbound', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onUnbind: handler
      });
      expect(handler.mock.calls.length).toBe(0);
  });

  test('element afterRender will called on initialization', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onAfterRender: handler
      });
      bound.update();
      expect(handler.mock.calls.length).toBe(2);
  });

  test('element afterRender will NOT called on if update is disabled', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onAfterRender: handler,
          updateDisabled: true
      });
      expect(handler.mock.calls.length).toBe(0);
  });

  test('element afterRender will NOT called on if disabled', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onAfterRender: handler,
          updateDisabled: true
      });
      bound.update();
      expect(handler.mock.calls.length).toBe(0);
  });

  test('element afterRender will be called on if enabled after initialization', () => {
      var handler = jest.fn(() => {});
      var bound = createBoundElement({
          onAfterRender: handler,
          updateDisabled: true
      });
      bound.updateDisabled = false;
      bound.update();
      expect(handler.mock.calls.length).toBe(1);
  });
});

describe('bound element setters/getters', () => {
  test('getting value will return that value from datasource', () => {
      var data = {key: "value"};
      var bound = createBoundElement({path: "key"}, data);
      expect(bound.getValue("ignored default")).toBe("value");
  });

  test('getting value will return default value if path is not found', () => {
      var data = {key: "value"};
      var bound = createBoundElement({path: "invalidkey"}, data);
      expect(bound.getValue("default value")).toBe("default value");
  });

  test('setting value will change datasource value', () => {
      var data = {key: "value"};
      var bound = createBoundElement({path: "key"}, data);
      bound.setValue("new value");
      expect(bound.getValue("default value")).toBe("new value");
  });

  test('setting value on unknown path will change datasource value', () => {
      var data = {key: "value"};
      var bound = createBoundElement({path: "new.unset.path"}, data);
      bound.setValue("new value");
      expect(bound.getValue("default value")).toBe(data.new.unset.path);
  });

  test('setting value will call update', () => {
    var handler = jest.fn(() => {});
    var bound = createBoundElement({
      path: "key",
      onUpdate: handler
    });
    bound.setValue("test");
    expect(handler.mock.calls.length).toBe(2);
  });

  test('setting value via run will call update', () => {
    var handler = jest.fn(() => {});
    var bound = createBoundElement({
      path: "key",
      onUpdate: handler
    });
    bound.run(function() {});
    expect(handler.mock.calls.length).toBe(2);
  });

  test('setting value via run will call update on change', () => {
      var data = {key: {item: "value"}};
      var bound = createBoundElement({path: "key"}, data);
      bound.run(function(e) {
          e.item = "another new value";
      });
      expect(bound.getValue({}).item).toBe("another new value");
  });

  test('setting value on unbound element will throw an error.', () => {
    var bound = createBoundElement({
      path: "key"
    });
    bound.unbind();
    expect(function() {
        bound.setValue("new value");
    }).toThrow('Cannot call setValue of unbound instance.');
  });
});

describe('bound element rendering', () => {
  test('setting value will render that value as text by default', () => {
      var data = {key: "value"};
      var to = {textContent: '', innerHTML: '', customField: ''};
      var bound = createBoundElement({to: to, path: "key"}, data);
      expect(to.textContent).toBe("value");
      expect(to.innerHTML).toBe("");
      expect(to.customField).toBe("");
  });

  test('setting value will render that value will render html when set', () => {
      var data = {key: "value"};
      var to = {textContent: '', innerHTML: '', customField: ''};
      var bound = createBoundElement({to: to, as: 'html', path: "key"}, data);
      expect(to.textContent).toBe("");
      expect(to.innerHTML).toBe("value");
      expect(to.customField).toBe("");
  });

  test('setting value will render custom if set', () => {
      var data = {key: "value"};
      var to = {textContent: '', innerHTML: '', customField: ''};
      var bound = createBoundElement({to: to, as: function(boundElement, element) {
          element.customField = boundElement.getValue();
      }, path: "key"}, data);
      expect(to.textContent).toBe("");
      expect(to.innerHTML).toBe("");
      expect(to.customField).toBe("value");
  });
});

function createBoundElement(config, data) {
    config.dataSource = config.dataSource || new DataSource(data);
    config.renderer = config.renderer || new Renderer();
    config.to = config.to || {textContent: ''};
    return new BoundElement(config);
}
