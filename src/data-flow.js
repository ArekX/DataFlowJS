import bindFn from './bind';
import BoundElement from './bound-element';
import DataSource from './data-source';
import Renderer from './renderer';

function DataFlow(dataSource, renderer) {
  renderer = renderer instanceof Renderer ? renderer : new Renderer();
  dataSource = dataSource instanceof DataSource ? dataSource : new DataSource(dataSource);

  dataSource.bind = bindFn.bind(dataSource, renderer, dataSource);
  dataSource.renderer = renderer;

  return dataSource;
};

DataFlow.bind = bindFn;
DataFlow.BoundElement = BoundElement;
DataFlow.DataSource = DataSource;
DataFlow.Renderer = Renderer;

export default DataFlow;
