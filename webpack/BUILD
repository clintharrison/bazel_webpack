load("@build_bazel_rules_nodejs//:defs.bzl", "nodejs_binary")

exports_files([
    "dev_server_template.sh",
    "webpack.config.tpl.js",
])

# This has additional dependencies on webpack, webpack-dev-server, and protobufjs;
# We don't declare them as dependencies on this target, because they are used as deps
# on the webpack_bundle() target that has an implicit dependency on this target.
# Doing this allows use of these packages from a node_modules other than the "default" @npm workspace.
nodejs_binary(
    name = "webpack_wrapper",
    data = [
        "dev-server-wrapper.js",
        "util.js",
        "webpack_wrapper.js",
        "worker.js",
        "worker.pb.js",
    ],
    entry_point = "webpack_wrapper.js",
    templated_args = ["--node_options=--expose-gc"],
    visibility = ["//visibility:public"],
)
