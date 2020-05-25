import webpackConfig from './webpack.config.babel'
import path from 'path'

export default (config) => {
  // test mode based on basePath parameter (eg. test/unit, test/functional)
  const testDir = config.basePath ? path.basename(config.basePath) : 'unit'

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'test/' + testDir,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '**/*.js'
    ],

    // list of files to exclude
    exclude: [
      'helpers/**/*.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

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
      type: 'html', // produces a html document after code is run
      dir: '../../cover/' + testDir + '/browser/' // path to created html doc
    }

  })
}
