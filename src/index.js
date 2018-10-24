import bindFn from './bind';
import BoundElement from './bound-element';
import DataSource from './data-source';
import Renderer from './renderer';

window.DataFlow = function DataFlow(dataSource, renderer) {
  renderer = renderer instanceof Renderer ? renderer : new Renderer();
  dataSource = dataSource instanceof DataSource ? dataSource : new DataSource(dataSource);

  dataSource.bind = bindFn.bind(this, renderer, dataSource);
  dataSource.renderer = renderer;

  return dataSource;
};

window.DataFlow.bind = bindFn;
window.DataFlow.BoundElement = BoundElement;
window.DataFlow.DataSource = DataSource;
window.DataFlow.Renderer = Renderer;
