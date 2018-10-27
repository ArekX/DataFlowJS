import DataSource from './data-source';

describe('datasource initialization', () => {
    test('datasource will get initialized correctly', () => {
        var data = {};
        var dataSource = createDataSource(data);
        expect(dataSource._bound).toBe(true);
        expect(dataSource.handlers).toEqual([]);
        expect(dataSource._data).toBe(data);
    });

    test('datasource initialized without data will create default empty object', () => {
        var dataSource = new DataSource();
        expect(dataSource._data.__proto__.constructor).toBe(({}).__proto__.constructor);
        expect(Object.keys(dataSource._data)).toEqual([]);
    });
});

describe('datasource handler binding specification', () => {
  test('calling bindHandler will add that handler for changes', () => {
      var dataSource = createDataSource();
      var handler = jest.fn(() => {});
      expect(dataSource.handlers.length).toBe(0);
      dataSource.bindHandler(handler);
      expect(dataSource.handlers.length).toBe(1);
  });

  test('changing data will invoke bound handler on set', () => {
      var dataSource = createDataSource({test: 1});
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.set("test", 2);
      expect(handler.mock.calls.length).toBe(1);
  });

  test('changing data will invoke bound handler on run', () => {
      var dataSource = createDataSource({test: 1});
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.run(function(data) {
          data.test = 2;
      });
      expect(handler.mock.calls.length).toBe(1);
  });

  test('calling update will invoke bound handler on run', () => {
      var dataSource = createDataSource({test: 1});
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.update();
      expect(handler.mock.calls.length).toBe(1);
  });

  test('unbinding handler will not run it on change', () => {
      var data = {};
      var dataSource = createDataSource(data);
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.unbindHandler(handler);
      dataSource.set("test", 2);
      expect(handler.mock.calls.length).toBe(0);
  });

  test('unbinding handler will not run it on update', () => {
      var data = {};
      var dataSource = createDataSource(data);
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.unbindHandler(handler);
      dataSource.update();
      expect(handler.mock.calls.length).toBe(0);
  });

  test('calling unbind will remove all handlers and mark it as unbound', () => {
      var data = {};
      var dataSource = createDataSource(data);
      var handler = jest.fn(() => {});
      dataSource.bindHandler(handler);
      dataSource.unbind();
      dataSource.update();
      expect(dataSource._bound).toBe(false);
      expect(dataSource.handlers).toEqual([]);
  });
});

describe('datasource getters and setters', () => {
  test('calling set on empty datasource will create that key', () => {
      var data = {};
      var dataSource = createDataSource(data);
      expect(Object.keys(dataSource._data)).toEqual([]);
      dataSource.set("key", "my value");
      expect(dataSource._data.key).toBe("my value");
  });

  test('calling nested set on empty datasource will create those objects to form that path', () => {
      var data = {};
      var dataSource = createDataSource(data);
      expect(Object.keys(dataSource._data)).toEqual([]);
      dataSource.set("custom.key.set.to", "my value");
      expect(dataSource._data.custom.key.set.to).toBe("my value");
  });

  test('calling nested getting unknown value returns default one', () => {
      var dataSource = createDataSource();
      var randomDefaultValue = "random" + Math.random();
      expect(dataSource.get("unknown.value", randomDefaultValue)).toEqual(randomDefaultValue);
  });

  test('calling nested getting falsy value returns that falsyvalue', () => {
      var dataSource = createDataSource({unknown: {value: false}});
      expect(dataSource.get("unknown.value", 'falsy')).toEqual(false);
  });
});

function createDataSource(data, handler) {
    data = data || {};
    return new DataSource(data);
}
