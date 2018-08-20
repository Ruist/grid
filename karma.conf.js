var webpackConfig = require('./webpack/webpack.config.js');

module.exports = function (config) {
    var configObject = {
        frameworks: [
            'jasmine'
        ],
        basePath: '',
        files: [
            'node_modules/polyfill-function-prototype-bind/bind.js',
            'src/modules/grid-spec-helper/matchers.js',
            'webpack/test-entry.js'
        ],
        preprocessors: {
            'webpack/test-entry.js': ['webpack', 'sourcemap'],
            'src/modules/grid-spec-helper/matchers.js': ['webpack', 'sourcemap']
        },
        webpackMiddleware: {
            noInfo: true
        },
        autoWatch: true,
        reporters: [
            'progress'
        ],
        browsers: ['PhantomJS_custom'],
        customLaunchers: {
            PhantomJS_custom: {
                base: 'PhantomJS',
                options: {
                    viewportSize: {
                        width: 400,
                        height: 500
                    }
                }
            }
        },
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        notifyReporter: {
            reportSuccess: false
        },
        browserNoActivityTimeout: 3000000,
        reportSlowerThan: 250,
        webpack: webpackConfig(false, true)
    };
    config.set(configObject);
};
