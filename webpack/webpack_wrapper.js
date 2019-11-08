/* eslint-env node */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');
const mkdirp = require('mkdirp');

const { log, mergeDeep } = require('./util');
const { persistentWorker } = require('./worker');
const { startDevServer } = require('./dev-server-wrapper');

const getOptions = (args, prefix = '@@') => {
  // Bazel passes arguments with a @-prefixed flag file.
  // In the case of this wrapper, we have no real arguments, just the path to a webpack
  // configuration file.
  const configFiles = args.filter(arg =>
      arg.startsWith(prefix)
      ).map(arg =>
      // The full path to the file is needed in order to require() it, but Bazel usually passes relative paths.
      path.resolve(arg.substr(prefix.length))
      );

  let options = [];

  configFiles.forEach(configPath => {
    if (fs.existsSync(configPath)) {
      delete require.cache[configPath];
      let generatedConfig = require(path.resolve(configPath));
      options.push(generatedConfig.baseConfig);
      options.push(generatedConfig.overrideConfig);
    } else {
      log.error(`Webpack config file at path ${configPath} does not exist.`);
    }
  });

  return mergeDeep({}, ...options);
};

const getCompilerInstance = (options, writeToDisk) => {
  let compiler = webpack(options);
  compiler.outputFileSystem = new MemoryFileSystem();

  if (writeToDisk) {
    configureDiskPersistence(compiler);
  }

  return compiler;
};

const configureDiskPersistence = compiler => {
  compiler.hooks.afterEmit.tap('BazelPersistentWorker', compilation => {
    Object.keys(compilation.assets).forEach(assetPath => {
      // If the asset has a relative path, write it to the standard output location
      let fullPath = assetPath;
      if (assetPath[0] !== '/') {
        fullPath = path.join(compiler.outputPath, assetPath);
      }

      try {
        const asset = compilation.assets[assetPath];

        // Since we aren't using the Webpack compiler directly to write to disk,
        // we have to manually ensure the output directory exists.
        mkdirp.sync(path.dirname(fullPath));
        fs.writeFileSync(fullPath, asset.source(), {
          encoding: 'utf-8'
        });
      } catch (ex) {
        log.error(
            `Persisting compilation output to disk failed:\n${ex.toString()}`
        );
      }
    });
  });
};

const runOneBuild = (compiler, callback) => {
  compiler.run((err, stats) => {
    if (err) {
      log.error(err.stack || err);
      if (err.details) {
        log.error(err.details);
      }
    }

    // Print out helpful report of what we compiled, how long it took, etc.
    stats &&
    log.info(
        stats.toString({
          chunks: false,
          colors: true,
          modules: false
        })
    );

    if (typeof callback === 'function') {
      callback(err, stats);
    }
  });
};

const main = args => {
  if (args.indexOf('--dev_server') !== -1) {
    // Keep a similarly configured in-memory compiler for dev server rebuilds,
    // but don't hook the post-compile "emit" event to copy the results to disk.

    // This process will only be created for a single bundle, so the complexity
    // with the persistent worker is not relevant here..
    let webpackOptions = getOptions(args, '@@');
    let devServerOptions = webpackOptions.devServer || {};
    let compiler = getCompilerInstance(
        webpackOptions,
        /* writeToDisk = */ false
    );

    startDevServer(compiler, devServerOptions);
  } else if (args.indexOf('--persistent_worker') !== -1) {
    // Persistent workers get their arguments through the protobuf message passed on stdin
    log.startBuffering();

    // Once the compiler has been initialized with the arguments for the worker, we persist
    // it so future compilation shares the same memory file system for incremental builds.
    let compilers = {};
    persistentWorker((workerArgs, compilerCallback) => {
      let options = getOptions(workerArgs);

      const optionsStr = JSON.stringify(options);
      let compiler = compilers[optionsStr];
      if (!compiler) {
        log.info('Creating new compiler...');
        try {
          compiler = getCompilerInstance(options, /* writeToDisk = */ true);
        } catch (e) {
          log.error(`Could not create new Webpack instance: ${e}`);
          return compilerCallback(1);
        }
        compilers[optionsStr] = compiler;
      }

      return runOneBuild(compiler, compilerCallback);
    });
  } else {
    // When this isn't a persistent worker, do a simple compilation and write to disk.
    const compiler = getCompilerInstance(
        getOptions(args),
        /* writeToDisk = */ true
    );
    runOneBuild(compiler, (err, stats) => {
      if (err || stats.hasErrors()) {
        process.exitCode = 1;
      }
    });
  }
};

main(process.argv);
