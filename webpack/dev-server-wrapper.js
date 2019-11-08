/* eslint-env node */
const readline = require('readline');
const {log} = require('./util');
const WebpackDevServer = require('webpack-dev-server');

module.exports = {
  startDevServer: function(compiler, wdsOptions) {
    log.info('Starting dev server...');
    const IBAZEL_NOTIFY_BUILD_SUCCESS = 'IBAZEL_BUILD_COMPLETED SUCCESS';

    const server = new WebpackDevServer(
        compiler,
        wdsOptions,
        // WebpackDevServer accepts a Logger object that we need to construct manually.
        // The default will write to stdout *and* stderr, but since Bazel communicates over
        // stdin/stdout, the dev server logs must only be written to stderr.
        {
          debug: () => {},
          info: log.info,
          error: log.error,
          options: {
            level: 'info'
          }
        }
    );

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', function(line) {
      // ibazel writes this constant message on stdin to our dev server process when the Bazel-side
      // of the build is complete.
      // When we receive this message, trigger a rebuild on the webpack-dev-server instance.
      if (line === IBAZEL_NOTIFY_BUILD_SUCCESS) {
        server.invalidate();
      }
    });

    server.listen(wdsOptions.port, '0.0.0.0', function(err, res_) {
      if (err) {
        log.error(err);
      } else {
        log.info(`Listening at http://localhost:${wdsOptions.port}`);
      }
    });
  }
};
