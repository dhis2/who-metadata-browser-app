/* istanbul ignore next */
/* eslint-disable */
global.chai = require('chai');
global.sinon = require('sinon');
   
// Chai plugins
global.chai.use(require('sinon-chai'));

global.expect = global.chai.expect;

var jsdom = require('jsdom').JSDOM;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = new jsdom('').window.document;
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};