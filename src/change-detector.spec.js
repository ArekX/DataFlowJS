import ChangeDetector from './change-detector';
import DataSource from './data-source';

describe('detect() spec', () => {
  test('after creation detect returns false', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    expect(detector.detect()).toBe(false);
  });

  test('after set detect returns true', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.dataSource.set("test", 2);
    expect(detector.detect()).toBe(true);
    expect(detector.detect()).toBe(false);
  });

  test('after set detect returns false after unwatch', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.dataSource.set("test", 2);
    detector.unwatch();
    expect(detector.detect()).toBe(false);
  });

  test('after set detect returns false after disable', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.disable();
    detector.dataSource.set("test", 2);

    expect(detector.detect()).toBe(false);
  });

  test('changes are tracked after enable', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.disable();
    detector.dataSource.set("test", 2);
    detector.enable();
    expect(detector.detect()).toBe(true);
    expect(detector.detect()).toBe(false);
  });

  test('changes are tracked after markChanges() is called', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.markChanged();
    expect(detector.detect()).toBe(true);
    expect(detector.detect()).toBe(false);
  });
});

describe('isChanged() spec', () => {
  test('after creation isChanged returns false', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    expect(detector.isChanged()).toBe(false);
  });

  test('after set detect returns true', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.dataSource.set("test", 2);
    expect(detector.isChanged()).toBe(true);
    expect(detector.isChanged()).toBe(true);
  });

  test('after set detect returns false after unwatch', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.dataSource.set("test", 2);
    detector.unwatch();
    console.log(detector.isMarkedChanged(), detector.getValue(), detector.getOldValue(), detector.getValue() !== detector.getOldValue());
    expect(detector.isChanged()).toBe(false);
  });

  test('after set detect returns false after disable', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.disable();
    detector.dataSource.set("test", 2);

    expect(detector.isChanged()).toBe(false);
  });

  test('changes are tracked after enable', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.disable();
    detector.dataSource.set("test", 2);
    detector.enable();
    expect(detector.isChanged()).toBe(true);
    expect(detector.isChanged()).toBe(true);
  });

  test('changes are tracked after markChanges() is called', () => {
    var detector = createChangeDetector({test: 1}, 'test');
    detector.markChanged();
    expect(detector.isChanged()).toBe(true);
    expect(detector.isChanged()).toBe(true);
  });
});


function createChangeDetector(data, path) {
    var dataSource = new DataSource(data);
    var detector = new ChangeDetector();

    detector.watch(dataSource, path);

    return detector;
}
