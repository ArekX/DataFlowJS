import initBoundElementModule from './bound-element';
import DataSource from './data-source';
import Renderer from './renderer';

window.DataFlow = function DataFlow(dataSource) {
  var renderer = new Renderer();
  var dataSource = dataSource instanceof DataSource ? dataSource : new DataSource(dataSource);

  dataSource.bind = initBoundElementModule(renderer, dataSource);
  dataSource.renderer = renderer;
  
  return dataSource;
};

window.DataFlow.initBoundElementModule = initBoundElementModule;
window.DataFlow.DataSource = DataSource;
window.DataFlow.Renderer = Renderer;
