import webpackConfig from './webpack.config.babel';

export default (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'test/unit/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/**/*.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'threshold'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: false,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Execute tests once, then exit.
    singleRun: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox', 'Chrome'],

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // We simulate a fully compiled browser application by using webpack. Since we only really
    // use this during testing, the configuration is kept here.
    webpack: webpackConfig,

    webpackMiddleware: {
      // Don't spam the console.
      noInfo: true
    },

    // Generate a coverage report in /cover/karma
    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'cover/browser/' //path to created html doc
    },

    // The current coverage threshold values. These should never drop.
    thresholdReporter: {
      statements: 88,
      branches: 64,
      functions: 77,
      lines: 75
    }

  });
};
