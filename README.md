react-matchmedia-connect
=========================

[![npm](https://img.shields.io/badge/npm-react--matchmedia--connect-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/react-matchmedia-connect.svg?style=flat-square)](https://www.npmjs.com/package/react-matchmedia-connect)
[![npm downloads](https://img.shields.io/npm/dm/react-matchmedia-connect.svg?style=flat-square)](https://www.npmjs.com/package/react-matchmedia-connect)

* [Higher order components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.9apqrmudz) for the [matchMedia](https://developer.mozilla.org/de/docs/Web/API/Window/matchMedia) API
* Receive props that indicate whether your media queries match

**[Demo](http://malte-wessel.github.io/react-matchmedia-connect/)**

## Installation
```bash
npm install react-matchmedia-connect --save
```

## Usage
### createMatchMediaConnect

`createMatchMediaConnect` lets you register a set of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).

```javascript
import { createMatchMediaConnect } from 'react-matchmedia-connect';

// Define some media queries and give them a key
const connect = createMatchMediaConnect({
  isLandscape: '(orientation: landscape)',
  isMin400: '(min-width: 400px)',
  isTablet: '(min-width: 700px), handheld and (orientation: landscape)'
});
```
Then use this connect function throughout your app:
```javascript
const Component = ({ isLandscape, isMin400 }) => (
  <div>
    <div>{isLandscape ? 'landscape' : 'portrait'}</div>
    <div>{isMin400 ? 'at least 400' : 'less than 400'}</div>
  </div>
);
// This component only needs `isLandscape` and `isMin400`
const ConnectedComponent = connect(['isLandscape', 'isMin400'])(Component);
```
```javascript
const OtherComponent = ({ isTablet }) => (
  isTablet ? <div>Tablet</div> : <div>No tablet</div>
);
// This component only needs `isTablet`
const OtherConnectedComponent = connect(['isTablet'])(Component);

```

### createResponsiveConnect

`createResponsiveConnect` expects a list of breakpoints and creates the respective media queries with `createMatchMediaConnect`. You'll get a `isMin<Size>` and `isMax<Size>` property for each breakpoint as well as a `isPortrait` and `isLandscape` property.

```javascript
import { createResponsiveConnect } from 'react-matchmedia-connect';
const connect = createResponsiveConnect({
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200
});
```
```javascript
const Component = ({ isMinMd, isMaxMd }) => (
  <div>
    <div>{isMinMd ? 'greater than 992px' : 'less than 992px'}</div>
    <div>{isMaxMd ? 'not greater than 1199px' : 'greater than 1199px'}</div>
    <div>{isMinMd && isMaxMd ? 'between 992px and 1199px' : 'other'}</div>
  </div>
);
// Only connect to `isMinMd` and `isMaxMd`
const wrapWithConnect = connect(['isMinMd', 'isMaxMd']);
const ConnectedComponent = wrapWithConnect(Component);
```

## Examples

Run the simple example:
```bash
# Make sure that you've installed the dependencies
npm install
# Move to example directory
cd react-matchmedia-connect/examples/simple
npm install
npm start
```

## Tests
```bash
# Make sure that you've installed the dependencies
npm install
# Run tests
npm test
```

### Code Coverage
```bash
# Run code coverage. Results can be found in `./coverage`
npm run test:cov
```

## License

MIT
