import inspect from './inspect';

var noop = function() {};

function BoundElement(config) {
    this.element = inspect.isString(config.element) ? document.querySelector(config.element) : config.element;
    this.dataSource = config.dataSource;
    this.path = config.path;
    this.to = config.to || 'html';
    this._callback = config.callback || noop;
    this._bound = true;
    this._boundHandler = this.update.bind(this);
    this.dataSource.bindHandler(this._boundHandler);

    this.onBind = config.onBind || noop;
    this.onUpdate = config.onUpdate || noop;
    this.onUnbind = config.onUnbind || noop;

    this.onBind.call(this.element);

    if (!config.disableUpdate) {
        this.update();
    }
}

BoundElement.prototype.get = getValue;
BoundElement.prototype.set = setValue;
BoundElement.prototype.run = run;
BoundElement.prototype.update = update;
BoundElement.prototype.unbind = unbind;

export default function bind(config, dataSource) {
    if (Array.isArray(config)) {
        var results = [];
        for(var i = 0; i < config.length; i++) {
            var item = config[i];
            if (!item.dataSource) {
                item.dataSource = dataSource;
            }

            results.push(new BoundElement(item));
        }

        return results;
    }

    if (!config.dataSource) {
        config.dataSource = dataSource;
    }

    return new BoundElement(config);
};

function getValue(defaultValue) {
    return this.dataSource.get(this.path, defaultValue);
}

function setValue(value) {
    if (!this._bound) {
        throw new Error('Cannot call setValue of unbound instance.');
    }
    this.dataSource.set(this.path, value);
}

function update() {
    var value = this.get();

    if (this.to === 'html') {
       this.element.innerHTML = String(value);
    } else if (this.to === 'text') {
       this.element.innerText = String(value);
    } else if (this.to === 'callback') {
       this._callback.call(this.element, value);
    }

    this.onUpdate.call(this.element, value);
}

function unbind() {
    this._bound = false;
    this.dataSource.unbindHandler(this._boundHandler);
    this.onUnbind.call(this.element, value);
}

function run(callback) {
   callback.call(this, this.getValue());
   this.update();
}
