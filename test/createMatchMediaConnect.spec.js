import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderIntoDocument, findRenderedComponentWithType } from 'react-dom/test-utils';
import createMatchMediaConnect from '../src/createMatchMediaConnect';

class Component extends React.Component {
    render() {
        return <div />;
    }
}

describe('createMatchMediaConnect', () => {
    let iframe;
    let connectOptions;

    before((done) => {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        const iframeMatchMedia = iframe.contentWindow.matchMedia;
        connectOptions = { matchMediaFn: iframeMatchMedia };
        done();
    });
    after(() => {
        connectOptions = undefined;
        document.body.removeChild(iframe);
        iframe = undefined;
    });

    function setSize(width, height) {
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        return iframe.clientWidth; // Force layout
    }

    let connect;
    beforeEach(() => {
        setSize(800, 600);
        connect = createMatchMediaConnect({
            isLandscape: '(orientation: landscape)',
            isMin700: '(min-width: 700px)',
            isMax700: '(max-width: 700px)'
        }, connectOptions);
    });

    afterEach(() => {
        connect.destroy();
        connect = undefined;
    });

    describe('when called', () => {
        it('should return a function and a destroy function', (done) => {
            const { destroy } = connect;
            expect(connect).toBeInstanceOf(Function);
            expect(destroy).toBeInstanceOf(Function);
            done();
        });
    });

    describe('when mounted', () => {
        it('should subscribe to updates', (done) => {
            const wrapWithConnect = connect();
            const Connected = wrapWithConnect(Component);
            expect(connect.listeners.length).toEqual(0);
            renderIntoDocument(<Connected />);
            expect(connect.listeners.length).toEqual(1);
            done();
        });
        it('should pass a property for each query', (done) => {
            const wrapWithConnect = connect();
            const Connected = wrapWithConnect(Component);
            const tree = renderIntoDocument(<Connected />);
            const component = findRenderedComponentWithType(tree, Component);
            expect(component.props).toEqual({
                isLandscape: true,
                isMin700: true,
                isMax700: false
            });
            done();
        });
    });

    describe('when dimensions change', () => {
        it('should update properties', (done) => {
            const wrapWithConnect = connect();
            const Connected = wrapWithConnect(Component);
            const tree = renderIntoDocument(<Connected />);
            const component = findRenderedComponentWithType(tree, Component);
            setSize(600, 800);
            window.setTimeout(() => {
                expect(component.props).toEqual({
                    isLandscape: false,
                    isMin700: false,
                    isMax700: true
                });
                done();
            }, 100);
        });
        it('should update properties once', (done) => {
            const wrapWithConnect = connect();
            const Connected = wrapWithConnect(Component);
            const tree = renderIntoDocument(<Connected />);
            const component = findRenderedComponentWithType(tree, Component);
            const spy = sinon.spy(component, 'render');
            setSize(600, 800);
            window.setTimeout(() => {
                expect(spy.callCount).toEqual(1);
                spy.reset();
                done();
            }, 100);
        });
    });

    describe('when `pickProperties` is not empty', () => {
        it('should only pass the given properties', (done) => {
            const wrapWithConnect = connect(['isLandscape']);
            const Connected = wrapWithConnect(Component);
            const tree = renderIntoDocument(<Connected />);
            const component = findRenderedComponentWithType(tree, Component);
            expect(component.props).toEqual({ isLandscape: true });
            done();
        });
        describe('when properties change that are not in the list', () => {
            it('should not rerender', (done) => {
                const wrapWithConnect = connect(['isLandscape']);
                const Connected = wrapWithConnect(Component);
                const tree = renderIntoDocument(<Connected />);
                const component = findRenderedComponentWithType(tree, Component);
                const spy = sinon.spy(component, 'render');
                setSize(400, 300);
                window.setTimeout(() => {
                    expect(spy.callCount).toEqual(0);
                    spy.reset();
                    done();
                }, 100);
            });
        });
    });

    describe('when unmounting', () => {
        it('should unsubscribe', (done) => {
            const wrapWithConnect = connect();
            const Connected = wrapWithConnect(Component);
            const div = document.createElement('div');
            render(<Connected />, div, function callback() {
                expect(connect.listeners.length).toEqual(1);
                unmountComponentAtNode(div);
                window.setTimeout(() => {
                    expect(connect.listeners.length).toEqual(0);
                    done();
                }, 100);
            });
        });
    });
});
