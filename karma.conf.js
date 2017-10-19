/* eslint no-var: 0, no-unused-vars: 0 */
var path = require('path');
var webpack = require('webpack');
var runCoverage = process.env.COVERAGE === 'true';

var coverageLoaders = [];
var coverageReporters = [];

if (runCoverage) {
    coverageLoaders.push({
        test: /\.js$/,
        include: path.resolve('src/'),
        loader: 'isparta'
    });
    coverageReporters.push('coverage');
}

module.exports = function karmaConfig(config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: ['./test.js'],
        preprocessors: {
            './test.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha'].concat(coverageReporters),
        webpack: {
            devtool: 'inline-source-map',
            resolve: {
                alias: {
                    'react-matchmedia-connect': path.resolve(__dirname, './src')
                }
            },
            module: {
                rules: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/
                }].concat(coverageLoaders)
            }
        },
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'text', subdir: '.', file: 'text.txt' },
                { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
            ]
        }
    });
};
