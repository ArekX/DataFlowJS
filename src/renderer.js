var staticRenderers = {};

export default function Renderer() {
   this.renderers = {};
   setupInitialRenderers(this);
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

function setupInitialRenderers(instance) {
    var renderers = getDefaultRenderers();
    for(var name in renderers) {
        instance.set(name, renderers[name]);
    }

    for(var name in staticRenderers) {
        if (staticRenderers.hasOwnProperty(name)) {
            instance.set(name, staticRenderers[name]);
        }
    }
}
