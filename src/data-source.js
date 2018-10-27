import findByPath from './find-by-path';

export default DataSource;

function DataSource(data) {
    this._data = data || {};
    this._bound = true;
    this.handlers = [];
}

DataSource.prototype.set = setValue;
DataSource.prototype.get = getValue;
DataSource.prototype.run = run;
DataSource.prototype.update = update;
DataSource.prototype.unbind = unbind;
DataSource.prototype.bindHandler = bindHandler;
DataSource.prototype.unbindHandler = unbindHandler;

function getValue(name, defaultValue) {
    var item = findByPath(this._data, name);

    if (item.path) {
        return item.result.hasOwnProperty(item.path) ? item.result[item.path] : defaultValue;
    }

    return defaultValue;
}

function setValue(name, value) {
    if (!this._bound) {
        throw new Error('Cannot call setValue of unbound instance.');
    }
    var pathObject = findByPath(this._data, name, true);
    pathObject.result[pathObject.path] = value;
    this.update();
}

function update() {
    for(var i = 0; i < this.handlers.length; i++) {
       this.handlers[i].call(this);
    }
}

function bindHandler(callback) {
    if (this.handlers.indexOf(callback) === -1) {
        this.handlers.push(callback);
    }
}

function unbindHandler(callback) {
    if (this.handlers.indexOf(callback) !== -1) {
        this.handlers.splice(this.handlers.indexOf(callback), 1);
    }
}

function unbind() {
    this.handlers = [];
    this._bound = false;
}

function run(callback) {
   callback.call(this, this._data);
   this.update();
}
