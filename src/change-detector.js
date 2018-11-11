export default function ChangeDetector() {
    this.comparator = defaultCompare;
    this.unwatch();
}

ChangeDetector.prototype.watch = watch;
ChangeDetector.prototype.unwatch = unwatch;
ChangeDetector.prototype.getValue = getValue;
ChangeDetector.prototype.getOldValue = getOldValue;
ChangeDetector.prototype.setComparator = setComparator;
ChangeDetector.prototype.disable = disable;
ChangeDetector.prototype.enable = enable;
ChangeDetector.prototype.isWatching = isWatching;
ChangeDetector.prototype.detect = detect;
ChangeDetector.prototype.markChanged = markChanged;
ChangeDetector.prototype.isMarkedChanged = isMarkedChanged;
ChangeDetector.prototype.isChanged = isChanged;

function watch(dataSource, path) {
    this.dataSource = dataSource;
    this.path = path;
    this.oldValue = dataSource.get(path);
    this._markedChanged = false;

    this.enable();
}

function unwatch() {
    this.disable();

    this.path = null;
    this.dataSource = null;
    this.oldValue = NaN;
    this._markedChanged = false;
}

function isWatching() {
    return this.enabled && this.dataSource !== null && this.path !== null;
}

function disable() {
    this.enabled = false;
}

function enable() {
    this.enabled = true;
}

function getValue() {
    if (!this.isWatching()) {
        return NaN;
    }

    return this.dataSource.get(this.path);
}

function markChanged() {
    if (!this.enabled) {
        return;
    }

    this._markedChanged = true;
}

function isMarkedChanged() {
    return this._markedChanged;
}

function isChanged() {
    return this.comparator(this);
}

function setComparator(comparator) {
    this.comparator = comparator;
}

function getOldValue() {
    if (!this.isWatching()) {
        return NaN;
    }

    return this.oldValue;
}

function detect() {
   if (!this.isWatching()) {
       return false;
   }

   var isChanged = this.isChanged();

   this._markedChanged = false;
   this.oldValue = this.getValue();

   return isChanged;
}

function defaultCompare(changeDetector) {
  if (!changeDetector.isWatching()) {
      return false;
  }

  if (changeDetector.isMarkedChanged()) {
     return true;
  }

  return changeDetector.getValue() !== changeDetector.getOldValue();
}
