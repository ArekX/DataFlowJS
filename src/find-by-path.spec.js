import findByPath from './find-by-path';

describe('findByPath specification', () => {
  test('calling findByPath with empty path will just return that object', () => {
      var ob = {customObject: true};
      var path = findByPath(ob);
      expect(path.path).toBe(null);
      expect(path.result).toBe(ob);
  });

  test('calling findByPath with dot notation as key will just return that object', () => {
      var ob = {};
      ob["custom.dot.notated.path"] = true;
      var path = findByPath(ob, "custom.dot.notated.path");
      expect(path.path).toBe("custom.dot.notated.path");
      expect(path.result[path.path]).toBe(true);
  });

  test('calling findByPath with dot notation will traverse object', () => {
      var ob = {
          custom: {
             dot: {
                notated: {
                   path: true
                }
             }
          }
      };
      var path = findByPath(ob, "custom.dot.notated.path");
      expect(path.path).toBe("path");
      expect(path.result[path.path]).toBe(true);
  });

  test('calling findByPath with dot notation will traverse object and create keys if createPathIfEmpty is set', () => {
      var ob = {};
      var path = findByPath(ob, "custom.dot.notated.path", true);
      expect(path.path).toBe("path");
      expect(path.result[path.path]).toBe(ob.custom.dot.notated.path);
  });

  test('traversing non object path will throw an error', () => {
      var ob = {key: {
          new: "value"
      }};

      expect(function() {
         findByPath(ob, "key.new.custom.path", true);
      }).toThrow('Cannot traverse data in path key.new since part of it is not an object.');
  });

  test('traversing non complete keys when createPathIfEmpty will return last valid path', () => {
      var ob = {key: {new: {anotherData: "true"}}};

      var path = findByPath(ob, "key.new.custom.path");
      expect(path.path).toBe(null);
      expect(path.result).toBe(ob.key.new);
  });
});
