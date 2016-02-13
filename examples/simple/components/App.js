import React, { createClass, PropTypes } from 'react';
import { createResponsiveConnect } from 'react-matchmedia-connect';

const matchMediaConnect = createResponsiveConnect();

const App = createClass({

    displayName: 'App',

    propTypes: {
        // isXl: PropTypes.bool.isRequired,
        // isLg: PropTypes.bool.isRequired
    },

    render() {
        console.log('App.render');
        const elements = [];
        for (const key in this.props) {
            if (!this.props.hasOwnProperty(key)) continue;
            const value = this.props[key];
            elements.push({ key, value });
        }
        return (
            <div>
                {elements.map(({ key, value }) =>
                    <div
                        style={{
                            padding: 5,
                            backgroundColor: value ? '#7EC273' : '#FA9999',
                            color: 'white'
                        }}
                        key={key}>
                        {key}: {value.toString()}
                    </div>
                )}
            </div>
        );
    }
});

export default matchMediaConnect(App);
