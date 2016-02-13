react-matchmedia-connect
=========================

[![npm](https://img.shields.io/badge/npm-react--custom--scrollbars-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/react-matchmedia-connect.svg?style=flat-square)](https://www.npmjs.com/package/react-matchmedia-connect)
[![npm downloads](https://img.shields.io/npm/dm/react-matchmedia-connect.svg?style=flat-square)](https://www.npmjs.com/package/react-matchmedia-connect)

* frictionless native browser scrolling
* native scrollbars for mobile devices
* [fully customizable](https://github.com/malte-wessel/react-matchmedia-connect/blob/master/docs/customization.md)
* [auto hide](https://github.com/malte-wessel/react-matchmedia-connect/blob/master/docs/usage.md#auto-hide)
* [universal](https://github.com/malte-wessel/react-matchmedia-connect/blob/master/docs/usage.md#universal-rendering) (runs on client & server)
* `requestAnimationFrame` for 60fps
* no extra stylesheets
* well tested, 100% code coverage

**[Examples](http://malte-wessel.github.io/react-matchmedia-connect/) · [Documentation](https://github.com/malte-wessel/react-matchmedia-connect/tree/master/docs)**

## Installation
```bash
npm install react-matchmedia-connect --save
```

## Usage

This is the minimal configuration. [Check out the Documentation for advanced usage](https://github.com/malte-wessel/react-matchmedia-connect/tree/master/docs).

```javascript
import { Scrollbars } from 'react-matchmedia-connect';

class App extends Component {
  render() {
    return (
      <Scrollbars style={{ width: 500, height: 300 }}>
        <p>Some great content...</p>
      </Scrollbars>
    );
  }
}
```

The `<Scrollbars>` component is completely customizable. Check out the following code:

```javascript
import { Scrollbars } from 'react-matchmedia-connect';

class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        onScroll={this.handleScroll}
        onScrollFrame={this.handleScrollFrame}
        onScrollStart={this.handleScrollStart}
        onScrollStop={this.handleScrollStop}
        renderView={this.renderView}
        renderTrackHorizontal={this.renderTrackHorizontal}
        renderTrackVertical={this.renderTrackVertical}
        renderThumbHorizontal={this.renderThumbHorizontal}
        renderThumbVertical={this.renderThumbVertical}
        autoHide={true}
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbMinSize={30}
        universal={true}
        {...this.props}>
    );
  }
}
```

All properties are documented in the [API docs](https://github.com/malte-wessel/react-matchmedia-connect/blob/master/docs/API.md)

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
