import React, { Component } from 'react';
import forEach from 'lodash.foreach';
import pick from 'lodash.pick';
import shallowEqual from 'shallowequal';
import throttle from 'lodash.throttle';

function pickState(pickProperties, stateToPickFrom) {
    if (!pickProperties.length) return stateToPickFrom;
    return pick(stateToPickFrom, ...pickProperties);
}

export default function createMatchMediaConnect(queryMap = {}, options = {}) {
    const { matchMediaFn = window.matchMedia } = options;
    const mqls = {};
    const listeners = [];
    let internalState = {};

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function createState() {
        const nextState = {};
        forEach(mqls, (mql, key) => {
            const { matches } = mql;
            nextState[key] = matches;
        });
        return nextState;
    }

    const handleChange = throttle(() => {
        const nextState = createState();
        if (shallowEqual(internalState, nextState)) return;
        internalState = nextState;
        forEach(listeners, listener => listener(nextState));
    });

    if (matchMediaFn) {
        forEach(queryMap, (query, key) => {
            const mql = matchMediaFn(query);
            mql.addListener(handleChange);
            mqls[key] = mql;
        });
    }

    function destroy() {
        listeners.length = 0;

        forEach(mqls, (mql, key) => {
            mql.removeListener(handleChange);
            delete mqls[key];
        });
    }

    internalState = createState();


    function connect(pickProperties = []) {
        return function wrapWithConnect(WrappedComponent) {
            return class WrapWithConnect extends Component {
                constructor(props) {
                    super(props);
                    this.state = pickState(pickProperties, internalState);
                }
                componentDidMount() {
                    this.unsubscribe = subscribe(this.handleChange);
                }
                componentWillUnmount() {
                    this.unsubscribe();
                }
                handleChange = (nextState) => {
                    const nextPickedState = pickState(pickProperties, nextState);


                    if (shallowEqual(this.state, nextPickedState)) { return; }
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
