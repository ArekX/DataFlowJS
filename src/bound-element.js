import inspect from './inspect';
import noop from './noop';

export default function BoundElement(config) {
    this.element = inspect.isString(config.to) ? document.querySelectorAll(config.to) : config.to;
    this.multiple = config.multiple || this.element.length > 1;
    this.renderer = config.renderer;

    if (!this.multiple && this.element.length) {
        this.element = this.element[0];
    }

    this.dataSource = config.dataSource;
    this.path = config.path;
    this.as = config.as || 'text';

    this._bound = true;
    this._boundHandler = this.update.bind(this);
    this.dataSource.bindHandler(this._boundHandler);
    this.changeDetector = config.changeDetector || null;

    this.onBind = config.onBind || noop;
    this.onUpdate = config.onUpdate || noop;
    this.onUnbind = config.onUnbind || noop;
    this.onAfterRender = config.onAfterRender || noop;

    this.changeDetector = config.changeDetector;

    this.onBind.call(this.element, this);
    this.updateDisabled = config.updateDisabled || false;
    this.update();
}

BoundElement.prototype.getValue = getValue;
BoundElement.prototype.setValue = setValue;
BoundElement.prototype.run = run;
BoundElement.prototype.shouldUpdate = shouldUpdate;
BoundElement.prototype.update = update;
BoundElement.prototype.unbind = unbind;

function getValue(defaultValue) {
    return this.dataSource.get(this.path, defaultValue);
}

function setValue(value) {
    if (!this._bound) {
        throw new Error('Cannot call setValue of unbound instance.');
    }
    this.dataSource.set(this.path, value);
}

function update(setPath) {
    if (this.updateDisabled) {
       return;
    }

    if (this.shouldUpdate(setPath)) {
       this.onUpdate.call(this.element, this.getValue(), this);
       this.renderer.render(this);
    }
}

function shouldUpdate(setPath) {
   if (!this.changeDetector) {
       return !setPath || !this.path || setPath === this.path;
   }

   return this.changeDetector(this.path, this.dataSource, this);
}

function unbind() {
    this._bound = false;
    this.dataSource.unbindHandler(this._boundHandler);
    this.onUnbind.call(this.element, this);
}

function run(callback) {
   callback.call(this, this.getValue());
   this.dataSource.update();
}
