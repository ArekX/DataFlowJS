var staticRenderers = {};

export default function Renderer() {
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
      rendererName(boundElement);
      boundElement.onAfterRender();
      return;
   }

   if (!(rendererName in this.renderers)) {
      throw new Error('Unknown renderer: ' + rendererName);
   }

   this.renderers[rendererName](boundElement);
   boundElement.onAfterRender();
}

function setRenderer(name, callback) {
   tihs.renderers[name] = callback;
}

function getDefaultRenderers() {
  return {
      html: function(boundElement, forElement) {
          console.log(boundElement, forElement);
          forElement.innerHTML = String(boundElement.getValue());
      },
      text: function(boundElement, forElement) {
          forElement.innerText = String(boundElement.getValue());
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
