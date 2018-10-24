import BoundElement from './bound-element';

export default function bind(renderer, dataSource, config) {
    if (Array.isArray(config)) {
        return bindArray(renderer, dataSource, config);
    }

    return bindSingle(renderer, dataSource, config);
}

function bindArray(renderer, dataSource, items) {
  var results = [];
  for(var i = 0; i < config.length; i++) {
      results.push(bindSingle(renderer, dataSource, config[i]));
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
