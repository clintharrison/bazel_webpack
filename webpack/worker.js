const workerpb = require('./worker.pb').blaze.worker;
const {log} = require('./util');

// decodeDelimited() doesn't actually use the length preceding the message,
// so we have to use Pokémon exception handling around it to gracefully handle
// when we get an incomplete message over stdin.
const decodeWorkRequest = buf => {
  try {
    return workerpb.WorkRequest.decodeDelimited(buf);
  } catch (e) {
    return null;
  }
};

module.exports = {
  persistentWorker: runOneBuild => {
    // The following code is from bazelbuild/rules_typescript/internal/tsc_wrapped/worker.ts
    // at revision eb84bee842a3d05d8feba385714e82a2bed518d9. Minor modifications were made to support running
    // this code with a newer version of protobufjs and standard JavaScript, as the original was in TypeScript.

    // Accumulator for asynchronously read input.
    let buf = null;
    process.stdin.on('data', chunk => {
      buf = buf ? Buffer.concat([buf, chunk]) : chunk;
      try {
        let req = null;
        // Read all requests that have accumulated in the buffer.

        // eslint-disable-next-line no-cond-assign
        while ((req = decodeWorkRequest(buf)) != null) {
          const args = req.arguments;
          const inputs = {};
          for (const input of req.inputs) {
            inputs[input.path] = input.digest.toString('hex');
          }

          // Empty the buffer for now...
          buf = null;
          runOneBuild(args, (err, stats) => {
            log.info('Compiling finished.\n');
            const compilerExitCode = err || stats.hasErrors() ? 1 : 0;

            const resp = new workerpb.WorkResponse({
              exitCode: compilerExitCode,
              output: log.flushBuffer(),
            });
            process.stdout.write(workerpb.WorkResponse.encodeDelimited(resp).finish());

            // Force a garbage collection pass.  This keeps our memory usage
            // consistent across multiple compilations, and allows the file
            // cache to use the current memory usage as a guideline for expiring
            // data.  Note: this is intentionally not within runOneBuild(), as
            // we want to gc only after all its locals have gone out of scope.
            global.gc();
          });
        }
      } catch (e) {
        log.error('Compilation failed', e.stack);

        process.stdout.write(workerpb.WorkResponse.encodeDelimited(new workerpb.WorkResponse({
          exitCode: 1,
          output: log.flushBuffer(),
        })).finish());

        // Clear buffer so the next build won't read an incomplete request.
        buf = null;
      }
    });
  },
};
