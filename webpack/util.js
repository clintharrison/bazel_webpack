const util = require("util");

// Bazel expects stdout to contain only properly-formatted protobuf messages.
// It's still convenient for debugging to log output occasionally, so we buffer messages
// and write it to the "output" field in the persistent worker response.
class Logger {
  constructor() {
    this.buffer = [];
    this.bufferingLogs = false;

    this.info = this.bufferOrWrite;
    this.warn = this.bufferOrWrite;
    this.error = this.bufferOrWrite;
  }

  startBuffering() {
    this.bufferingLogs = true;
  }

  bufferOrWrite(...args) {
    if (this.bufferingLogs) {
      if (args.length === 1 && typeof(args[0]) === "string") {
        this.buffer.push(args[0]);
      } else {
        this.buffer.push(util.inspect(...args));
      }
    } else {
      // If we aren't buffering logs to write to a persistent worker Response message,
      // we may be running under ibazel, which also uses a stdin/stdout method of communication for
      // targets with the ibazel_notify_changes tag, like our dev server.
      console.error(...args);
    }
  }

  flushBuffer() {
    const contents = this.buffer.join("\n");
    this.buffer = [];
    return contents;
  }
}

module.exports = {
  log: new Logger(),

  // From https://stackoverflow.com/a/34749873; this is done by Webpack itself when you have a config file and
  // options on the command line that override pieces of it. This is necessary in this wrapper since we don't have any
  // command line arguments, but instead replace them with a second config file that gets merged in.
  mergeDeep: function mergeDeep(target, ...sources) {
    const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));

    if (!sources.length) {
      return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}});
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      });
    }

    return mergeDeep(target, ...sources);
  },
};
