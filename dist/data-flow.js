'use strict';


    /** DataFlow JS v1.0.8 by Aleksandar Panic. License: MIT **/
    !function(document, window) {
    

var inspect = {
      isObject: isObject,
      isString: isString,
      isUndefined: isUndefined
};

function isObject(val) {
    return typeof val === "object";
}

function isString(val) {
    return typeof val === "string";
}

function isUndefined(val) {
    return typeof val === "undefined";
}

var noop = function() {};

function BoundElement(config) {
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

    this.onBind = config.onBind || noop;
    this.onUpdate = config.onUpdate || noop;
    this.onUnbind = config.onUnbind || noop;
    this.onAfterRender = config.onAfterRender || noop;

    this.onBind.call(this.element, this);
    this.updateDisabled = config.updateDisabled || false;
    this.update();
}

BoundElement.prototype.getValue = getValue;
BoundElement.prototype.setValue = setValue;
BoundElement.prototype.run = run;
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

function update() {
    if (this.updateDisabled) {
       return;
    }

    this.onUpdate.call(this.element, this.getValue(), this);
    this.renderer.render(this);
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

function bind(renderer, dataSource, config) {
    if (Array.isArray(config)) {
        return bindArray(renderer, dataSource, config);
    }

    return bindSingle(renderer, dataSource, config);
}

function bindArray(renderer, dataSource, items) {
  var results = [];
  for(var i = 0; i < items.length; i++) {
      results.push(bindSingle(renderer, dataSource, items[i]));
  }

  return results;
}

function bindSingle(renderer, dataSource, config) {
  if (!config.dataSource) {
      config.dataSource = dataSource;
  }

  if (!config.renderer) {
      config.renderer = renderer;
  }

  return new BoundElement(config);
}

function findByPath(object, path, createPathIfEmpty) {
   if (!path) {
      return {
          result: object,
          path: null
      };
   }

   if (path in object) {
       return {
         result: object,
         path: path
       };
   }

   var parts = path.split('.');
   var walker = object;

   for(var i = 0; i < parts.length - 1; i++) {
      var part = parts[i];

      if (!(part in walker)) {
        if (!createPathIfEmpty) {
            return {
               result: walker,
               path: null
            };
        } else {
            walker[part] = {};
        }
     }

      if (i < parts.length - 1 && !inspect.isObject(walker[part])) {
          var partName = parts.slice(0, i + 1).join('.');
          throw new Error('Cannot traverse data in path ' + partName + ' since part of it is not an object.');
      }

      walker = walker[part];
   }

   return {
      result: walker,
      path: parts[parts.length - 1]
   };
}

function DataSource(data) {
    this._data = data || {};
    this._bound = true;
    this.handlers = [];
}

DataSource.prototype.set = setValue$1;
DataSource.prototype.get = getValue$1;
DataSource.prototype.run = run$1;
DataSource.prototype.update = update$1;
DataSource.prototype.unbind = unbind$1;
DataSource.prototype.bindHandler = bindHandler;
DataSource.prototype.unbindHandler = unbindHandler;

function getValue$1(name, defaultValue) {
    var item = findByPath(this._data, name);

    if (item.path) {
        return item.result.hasOwnProperty(item.path) ? item.result[item.path] : defaultValue;
    }

    return defaultValue;
}

function setValue$1(name, value) {
    if (!this._bound) {
        throw new Error('Cannot call setValue of unbound instance.');
    }
    var pathObject = findByPath(this._data, name, true);
    pathObject.result[pathObject.path] = value;
    this.update();
}

function update$1() {
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

function unbind$1() {
    this.handlers = [];
    this._bound = false;
}

function run$1(callback) {
   callback.call(this, this._data);
   this.update();
}

var staticRenderers = {};

function Renderer() {
   this.renderers = getInitialRenderers();
}

Renderer.prototype.render = render;
Renderer.prototype.set = setRenderer;
Renderer.prototype.runOnBoundElement = runOnBoundElement;

Renderer.setStaticRenderer = function(name, callback) {
    staticRenderers[name] = callback;
};

function render(boundElement) {
   var rendererName = boundElement.as;

   if (typeof rendererName === "function") {
      runOnBoundElement(rendererName, boundElement);
      return;
   }

   if (!(rendererName in this.renderers)) {
      throw new Error('Unknown renderer: ' + rendererName);
   }

   this.renderers[rendererName](boundElement);
}

function setRenderer(name, callback) {
   this.renderers[name] = runOnBoundElement.bind(this, callback);
}

function getDefaultRenderers() {
  return {
      html: function(boundElement, forElement) {
          forElement.innerHTML = String(boundElement.getValue());
      },
      text: function(boundElement, forElement) {
          forElement.textContent = String(boundElement.getValue());
      }
  };
}

function runOnBoundElement(callback, boundElement) {
    if (boundElement.multiple) {
        for(var i = 0; i < boundElement.element.length; i++) {
            callback(boundElement, boundElement.element[i]);
        }
    } else {
        callback(boundElement, boundElement.element);
    }

    boundElement.onAfterRender.call(boundElement.element, boundElement);
}

function getInitialRenderers() {
    var renderers = getDefaultRenderers();

    for(var name in staticRenderers) {
        if (staticRenderers.hasOwnProperty(name)) {
            renderers[name] = staticRenderers[name];
        }
    }

    for(var name in renderers) {
        renderers[name] = runOnBoundElement.bind(this, renderers[name]);
    }

    return renderers;
}

function DataFlow(dataSource, renderer) {
  renderer = renderer instanceof Renderer ? renderer : new Renderer();
  dataSource = dataSource instanceof DataSource ? dataSource : new DataSource(dataSource);

  dataSource.bind = bind.bind(this, renderer, dataSource);
  dataSource.renderer = renderer;

  return dataSource;
}
DataFlow.bind = bind;
DataFlow.BoundElement = BoundElement;
DataFlow.DataSource = DataSource;
DataFlow.Renderer = Renderer;

window.DataFlow = DataFlow;

}(document, window);
//# sourceMappingURL=data-flow.js.map
