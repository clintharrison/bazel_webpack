/* eslint-env node */
/* global TEMPLATED_MODE, TEMPLATED_BASE_CONFIG_PATH, TEMPLATED_ENTRY_POINTS, TEMPLATED_DEV_SERVER_PORT,
  TEMPLATED_ALLOW_MULTIPLE_OUTPUTS, TEMPLATED_ENABLE_CODE_SPLITTING, TEMPLATED_OUT_PATH */
const path = require('path');

const baseConfigPath = path.resolve(TEMPLATED_BASE_CONFIG_PATH);
delete require.cache[baseConfigPath];
const baseConfig = require(baseConfigPath);
let overrideConfig = {
  mode: TEMPLATED_MODE,
  entry: [TEMPLATED_ENTRY_POINTS].map((ep) => path.resolve(ep)),
  resolve: {
    // FIXME(clint): This is BAD. This leaks true filesystem paths to the webpack compiler, but until
    //   https://github.com/soldair completes upcoming work on the bazel `--require` script, it's the only
    //   way for the dev server to watch the correct parent directory to detect changes to input files.
    //   As a result, we only permit this symlink escape in development mode.
    symlinks: TEMPLATED_MODE === 'development',
  },
  devServer: {
    port: TEMPLATED_DEV_SERVER_PORT,
  }
};

if (TEMPLATED_ALLOW_MULTIPLE_OUTPUTS) {
  overrideConfig.output = {
    path: path.resolve(TEMPLATED_OUT_PATH),
    filename: 'bundle.[chunkhash].js',
  }
} else {
  overrideConfig.output = {
    path: path.dirname(path.resolve(TEMPLATED_OUT_PATH)),
    filename: path.basename(TEMPLATED_OUT_PATH),
  };
}

if (TEMPLATED_ENABLE_CODE_SPLITTING) {
  overrideConfig.optimization = {
    splitChunks: {
      chunks: 'all',
    },
  };
}

module.exports = {
  baseConfig: baseConfig,
  overrideConfig: overrideConfig,
};
