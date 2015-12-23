/** @param {Object} config */
module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      "file#app/components/context/ns.js",

      "file#app/assets/scripts/emitter.js",
      "file#app/assets/scripts/cookie.js",
      "file#app/assets/scripts/utils.js",

      "file#app/assets/scripts/router.js",

      "component#component/notification",
      "component#component/confirm",
      "component#component/loader",
      "component#component/modal",

      "component#widget/header",
      "component#widget/navigation",

      "component#page/home",
      "component#page/home2",

      "component#layout/home",

      "file#app/components/context/app.js"
    ],

    //exclude: [],

    preprocessors: {
      'app/**/*.js': 'coverage'
    },

    reporters: [
      'progress',
      'coverage'
    ],

    coverageReporter: {
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'html',
          dir: 'tests/coverage/'
        }
      ]
    },

    port: 9876,

    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    //                  config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,


    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    singleRun: false
  });
};
