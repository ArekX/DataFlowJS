import bind from './bind';
import Renderer from './renderer';
import DataSource from './data-source';
import BoundElement from './bound-element';


describe('bind function specification', () => {
    test('binding one element creates and returns instance of BoundElement', () => {
        var mock = {
            textContent: ''
        };

        var renderer = new Renderer();
        var dataSource = new DataSource();

        var boundElement = bind(renderer, dataSource, {to: mock});

        expect(boundElement).toBeInstanceOf(BoundElement);
    });

    test('binding multiple elements return multiple instances of BoundElement', () => {
        var mocks = [
            {to: {textContent: ''}},
            {to: {textContent: ''}},
            {to: {textContent: ''}},
            {to: {textContent: ''}},
            {to: {textContent: ''}}
        ];

        var renderer = new Renderer();
        var dataSource = new DataSource();

        var boundInstances = bind(renderer, dataSource, mocks);

        expect(boundInstances.length).toBe(mocks.length);

        for(var i = 0; i < boundInstances.length; i++) {
             expect(boundInstances[i]).toBeInstanceOf(BoundElement);
        }
    });

    test('binding empty array yields empty bound instances', () => {
        var renderer = new Renderer();
        var dataSource = new DataSource();

        var boundInstances = bind(renderer, dataSource, []);

        expect(boundInstances.length).toBe(0);
    });

    test('binding with no datasource and renderer uses passed ones', () => {
        var mock = {
            textContent: ''
        };

        var renderer = new Renderer();
        var dataSource = new DataSource();

        var boundElement = bind(renderer, dataSource, {to: mock});

        expect(boundElement.renderer).toBe(renderer);
        expect(boundElement.dataSource).toBe(dataSource);
    });

    test('binding with datasource and renderer uses the ones configured and not passed ones', () => {
        var mock = {
            textContent: ''
        };

        var renderer = new Renderer();
        var dataSource = new DataSource();

        var boundElement = bind(renderer, dataSource, {
          to: mock,
          renderer: new Renderer(),
          dataSource: new DataSource()
        });

        expect(boundElement.renderer).not.toBe(renderer);
        expect(boundElement.dataSource).not.toBe(dataSource);
    });
});
