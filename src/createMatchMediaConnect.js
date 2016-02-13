import React, { createClass } from 'react';
import shallowEqual from './utils/shallowEqual';
import throttle from './utils/throttle';
import pick from './utils/pick';

export default function createMatchMediaConnect(queryMap = {}, options = {}) {
    const { matchMediaFn = window.matchMedia } = options;
    const mqls = {};
    const listeners = [];
    let state = {};

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function createState() {
        const nextState = {};
        for (const key in mqls) {
            if (!mqls.hasOwnProperty(key)) continue;
            const mql = mqls[key];
            const { matches } = mql;
            nextState[key] = matches;
        }
        return nextState;
    }

    const handleChange = throttle(() => {
        const nextState = createState();
        if (shallowEqual(state, nextState)) return;
        state = nextState;
        listeners.forEach(listener => listener(nextState));
    });

    if (matchMediaFn) {
        for (const key in queryMap) {
            if (!queryMap.hasOwnProperty(key)) continue;
            const query = queryMap[key];
            const mql = matchMediaFn(query);
            mql.addListener(handleChange);
            mqls[key] = mql;
        }
    }

    function destroy() {
        listeners.length = 0;
        for (const key in mqls) {
            if (!mqls.hasOwnProperty(key)) continue;
            const mql = mqls[key];
            mql.removeListener(handleChange);
            mqls[key] = undefined;
        }
    }

    state = createState();

    function connect(pickProperties = []) {
        function pickState(stateToPickFrom) {
            if (!pickProperties.length) return stateToPickFrom;
            return pick(stateToPickFrom, ...pickProperties);
        }
        return function wrapWithConnect(Component) {
            return createClass({
                displayName: 'ConnectMatchMedia',
                getInitialState() {
                    return pickState(state);
                },
                componentDidMount() {
                    this.unsubscribe = subscribe(this.handleChange);
                },
                componentWillUnmount() {
                    this.unsubscribe();
                },
                handleChange(nextState) {
                    const nextPickedState = pickState(nextState);
                    if (shallowEqual(this.state, nextPickedState)) return;
                    this.setState(nextPickedState);
                },
                render() {
                    return <Component {...this.props} {...this.state}/>;
                }
            });
        };
    }

    // For testing
    connect.destroy = destroy;
    connect.listeners = listeners;
    return connect;
}
