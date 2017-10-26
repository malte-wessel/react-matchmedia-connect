import React, { Component } from 'react';
import shallowEqual from 'shallowequal';
import throttle from './utils/throttle';
import pick from './utils/pick';

function pickState(pickProperties, stateToPickFrom) {
    if (!pickProperties.length) return stateToPickFrom;
    return pick(stateToPickFrom, ...pickProperties);
}

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
        for (let i = 0, l = listeners.length; i < l; i++) {
            const listener = listeners[i];
            if (!listener) continue;
            listener(nextState);
        }
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
        return function wrapWithConnect(WrappedComponent) {
            return class WrapWithConnect extends Component {
                constructor(props) {
                    super(props);
                    this.handleChange = this.handleChange.bind(this);
                    this.state = pickState(pickProperties, state);
                }
                componentDidMount() {
                    this.unsubscribe = subscribe(this.handleChange);
                }
                componentWillUnmount() {
                    this.unsubscribe();
                }
                handleChange(nextState) {
                    const nextPickedState = pickState(
                        pickProperties,
                        nextState
                    );

                    if (shallowEqual(this.state, nextPickedState)) {
                        return;
                    }
                    this.setState(nextPickedState);
                }
                render() {
                    return <WrappedComponent {...this.props} {...this.state} />;
                }
            };
        };
    }

    // For testing
    connect.destroy = destroy;
    connect.listeners = listeners;
    return connect;
}
