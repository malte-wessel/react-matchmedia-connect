import React, { createClass } from 'react';
import shallowEqual from './utils/shallowEqual';
import throttle from './utils/throttle';

export default function createMatchMediaConnect(queryMap = {}) {
    const mqls = {};
    const listeners = [];
    let prevState = {};

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function createState() {
        const state = {};
        for (const key in mqls) {
            if (!mqls.hasOwnProperty(key)) continue;
            const mql = mqls[key];
            const { matches } = mql;
            state[key] = matches;
        }
        return state;
    }

    const handleChange = throttle(() => {
        const nextState = createState();
        if (shallowEqual(nextState, prevState)) return;
        listeners.forEach(listener => listener(nextState));
        prevState = nextState;
    });

    for (const key in queryMap) {
        if (!queryMap.hasOwnProperty(key)) continue;
        const query = queryMap[key];
        const mql = matchMedia(query);
        mql.addListener(handleChange);
        mqls[key] = mql;
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

    prevState = createState();

    const connect = Component => createClass({
        displayName: 'MatchMediaConnect',
        getInitialState() {
            return prevState;
        },
        componentDidMount() {
            this.unsubscribe = subscribe(this.handleChange);
        },
        componenWillUnmount() {
            this.unsubscribe();
        },
        handleChange(nextState) {
            this.setState(nextState);
        },
        render() {
            return <Component {...this.props} {...this.state}/>;
        }
    });

    connect.destroy = destroy;
    return connect;
}
