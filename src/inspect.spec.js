import inspect from './inspect';
import DataSource from './data-source';

describe('isObject specification', () => {
  test('calling isObject on object types will be true', () => {
      expect(inspect.isObject({})).toBe(true);
      expect(inspect.isObject(new DataSource())).toBe(true);
  });

  test('calling isObject on non object types will be false', () => {
      expect(inspect.isObject(function() {})).toBe(false);
      expect(inspect.isObject("string")).toBe(false);
      expect(inspect.isObject(1)).toBe(false);
      expect(inspect.isObject(5.55)).toBe(false);
      expect(inspect.isObject(DataSource)).toBe(false);
  });
});

describe('isString specification', () => {
  test('calling isString on string types will be true', () => {
      expect(inspect.isString("string")).toBe(true);
  });

  test('calling isString on non string types will be false', () => {
      expect(inspect.isString({})).toBe(false);
      expect(inspect.isString(function() {})).toBe(false);
      expect(inspect.isString(1)).toBe(false);
      expect(inspect.isString(5.55)).toBe(false);
      expect(inspect.isString(DataSource)).toBe(false);
  });
});


describe('isUndefined specification', () => {
  test('calling isUndefined on undefined types will be true', () => {
      var object = {};
      expect(inspect.isUndefined(object.unknownkey)).toBe(true);
      expect(inspect.isUndefined(undefined)).toBe(true);
  });

  test('calling isUndefined on defined types will be false', () => {
      expect(inspect.isUndefined({})).toBe(false);
      expect(inspect.isUndefined(function() {})).toBe(false);
      expect(inspect.isUndefined(1)).toBe(false);
      expect(inspect.isUndefined(5.55)).toBe(false);
      expect(inspect.isUndefined(DataSource)).toBe(false);
  });
});
