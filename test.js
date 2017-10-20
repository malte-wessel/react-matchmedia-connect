import expect from 'expect';
import sinon from 'sinon';

window.expect = expect;
window.sinon = sinon;

const context = require.context('./test', true, /\.spec\.js$/);
context.keys().forEach(context);
