"""Bundle assets with Webpack"""

load("@build_bazel_rules_nodejs//:providers.bzl", "NodeRuntimeDepsInfo", "NpmPackageInfo", "node_modules_aspect", "run_node")
load(
    "@build_bazel_rules_nodejs//internal/linker:link_node_modules.bzl",
    "module_mappings_aspect",
    "register_node_modules_linker",
)

_WEBPACK_BUNDLE_ATTRS = {
    "srcs": attr.label_list(
        allow_files = True,
        doc = "JavaScript source files to be bundled by Webpack",
    ),
    "deps": attr.label_list(
        aspects = [module_mappings_aspect, node_modules_aspect],
        doc = """Other libraries that are required by the code, or by the webpack.config.js

        If your Webpack configuration requires additional plugins or loaders, they need to be added as deps here.

        The following target is an example of how to customize the packages available to the Webpack wrapper:

        ```
        webpack_bundle(
            name = "webpack",
            deps = [
                "@npm_app//webpack-dev-server",
                "@npm_app//readline",
                "@npm_app//protobufjs",
                "@npm_app//babel-loader",
                "@npm_app//html-loader",
            ],

        )
        ```

        This target can then be used to build your Webpack bundle with the ``babel-loader`` and ``html-loader``
        plugins present. Note that "readline", "protobufjs", and "webpack-dev-server" are required dependencies
        here, and they must come from the same workspace (i.e., node_modules) as the rest of your application.
        """,
    ),
    "allow_multiple_outputs": attr.bool(
        mandatory = False,
        doc = "If True, the outputs will be a directory",
    ),
    "enable_code_splitting": attr.bool(
        mandatory = False,
        default = False,
        doc = "If True, the code splitting optimization will be enabled",
    ),
    "config": attr.label(
        doc = "Configuration file used to initialize the Webpack compiler",
        allow_single_file = [".js"],
        mandatory = True,
    ),
    "entry_points": attr.label_list(
        allow_files = True,
        mandatory = True,
        doc = """The point(s) to start the Webpack bundling process; the standard Webpack config's ``entry``.""",
    ),
    "mode": attr.string(
        doc = "Webpack optimization mode; see <https://webpack.js.org/concepts/mode/>",
        default = "production",
        mandatory = True,
        values = [
            "none",
            "development",
            "production",
        ],
    ),
    "webpack_wrapper": attr.label(
        executable = True,
        default = "//webpack:webpack_wrapper",
        doc = "Target that executes the webpack build",
        cfg = "exec",
    ),
    "_config_template": attr.label(
        default = Label("//webpack:webpack.config.tpl.js"),
        allow_single_file = True,
    ),
}

def _to_runfiles_manifest_path(ctx, file):
    if file.short_path.startswith("../"):
        return file.short_path[3:]
    else:
        return ctx.workspace_name + "/" + file.short_path

def _to_js_string(s):
    return "'%s'" % s.replace("'", "\\'")

def _generate_webpack_config(ctx, entry_points, allow_multiple_outputs, output_path):
    """
    Write a webpack.config.js overriding with Bazel attribute values where appropriate.

    The generated config file here `require`s the user's config file.
    The config file passed in can be non-Bazel-aware, and the generated one overrides any necessary options
    for the Bazel wrapper to support more hermetic bundling (e.g., writing output to the Bazel output
    directories instead of directly to a path in workspace).
    """
    gen_config_file = ctx.actions.declare_file("%s.gen.config.js" % ctx.label.name)

    ctx.actions.expand_template(
        template = ctx.file._config_template,
        output = gen_config_file,
        substitutions = {
            "TEMPLATED_ALLOW_MULTIPLE_OUTPUTS": "true" if allow_multiple_outputs else "false",
            "TEMPLATED_ENABLE_CODE_SPLITTING": "true" if ctx.attr.enable_code_splitting else "false",
            "TEMPLATED_BASE_CONFIG_PATH": _to_js_string(ctx.file.config.short_path),
            "TEMPLATED_ENTRY_POINTS": ",".join(["'%s'" % e.path for e in entry_points]),
            "TEMPLATED_MODE": _to_js_string(ctx.attr.mode),
            "TEMPLATED_OUT_PATH": _to_js_string(output_path),
            "TEMPLATED_DEV_SERVER_PORT": str(getattr(ctx.attr, "dev_server_port", 9000)),
        },
    )

    return gen_config_file

def _get_deps_inputs(ctx):
    """
    Get the depset of all transitive dependencies needed by the rules_nodejs linker
    """

    # run_node depends on NPM packages being inputs to this action, as an optimization over
    # using node_modules from runfiles
    deps_depsets = []
    for dep in ctx.attr.deps:
        if hasattr(dep, "files"):
            deps_depsets.append(dep.files)
        if NpmPackageInfo in dep:
            deps_depsets.append(dep[NpmPackageInfo].sources)

    return depset(transitive = deps_depsets).to_list()

def _webpack_bundle_impl(ctx):
    entry_points = ctx.files.entry_points
    if len(entry_points) > 1 and not ctx.attr.allow_multiple_outputs:
        fail("with multiple entrypoints, `allow_multiple_outputs` must be True")
    if ctx.attr.enable_code_splitting and not ctx.attr.allow_multiple_outputs:
        fail("code splitting implies multiple outputs, but `allow_multiple_outputs` is False")

    multiple_outputs = len(entry_points) > 1 or ctx.attr.allow_multiple_outputs or ctx.attr.enable_code_splitting
    if multiple_outputs:
        if ctx.outputs.bundle_output:
            fail("with multiple entrypoints or outputs, `bundle_output` must not be specified")
        output = ctx.actions.declare_directory("%s_chunks" % ctx.label.name)
    else:
        output = ctx.outputs.bundle_output

    if not output:
        fail("with a single entry point and no code splitting, `bundle_output` must be specified")

    gen_config_file = _generate_webpack_config(ctx, entry_points, multiple_outputs, output.path)
    deps_inputs = _get_deps_inputs(ctx)
    inputs = ctx.files.srcs + deps_inputs + [gen_config_file, ctx.file.config]

    run_node(
        ctx,
        inputs = inputs,
        executable = "webpack_wrapper",
        arguments = [
            # "@@" indicates to our wrapper script that the argument is the webpack config file
            "@@" + gen_config_file.path,
        ],
        outputs = [output],
        mnemonic = "WebpackWrapper",
        progress_message = "Bundling JavaScript %s [webpack]" % output.short_path,
        execution_requirements = {
            # TODO: turn this back on, once we run the linker for each unique compilation request
            # This requires passing the path to the linker _and_ the linker manifest to the webpack wrapper,
            # which will run it before the webpack compiler gets run.
            #
            # We **must** sandbox workers: when we use persistent workers for webpack compilation, and without sandboxing,
            # it's possible to write to the node_modules directory.
            # This is especially disastrous if the rules_nodejs linker makes a symlink pointing to `bazel-bin`, which
            # causes globbing pre-Bazel-1.2 to traverse into a (potentially) very deep directory.
            #
            # Enable sandboxing with this addition to .bazelrc:
            #
            #     build --worker_sandboxing
            #
            # "supports-workers": "1",
        },
    )

    return [DefaultInfo(
        files = depset([output]),
    )]

webpack_bundle = rule(
    attrs = dict(_WEBPACK_BUNDLE_ATTRS.items() + {
        "bundle_output": attr.output(
            mandatory = False,
            doc = "Output name for a single Webpack bundle",
        ),
    }.items()),
    implementation = _webpack_bundle_impl,
)

def _webpack_server_impl(ctx):
    entry_points = ctx.files.entry_points
    if len(entry_points) > 1 and not ctx.attr.allow_multiple_outputs:
        fail("with multiple entrypoints, `allow_multiple_outputs` must be True")
    if ctx.attr.enable_code_splitting and not ctx.attr.allow_multiple_outputs:
        fail("code splitting implies multiple outputs, but `allow_multiple_outputs` is False")

    multiple_outputs = len(entry_points) > 1 or ctx.attr.allow_multiple_outputs or ctx.attr.enable_code_splitting
    gen_config_file = _generate_webpack_config(ctx, entry_points, multiple_outputs, ctx.attr.output_path)
    deps_inputs = _get_deps_inputs(ctx)

    dev_server_runner = ctx.actions.declare_file("%s.runner.sh" % ctx.attr.name)

    inputs = ctx.files.srcs + deps_inputs + [dev_server_runner, gen_config_file, ctx.file.config]

    extra_inputs = []
    link_data = []
    webpack_wrapper = ctx.attr.webpack_wrapper
    if NodeRuntimeDepsInfo in webpack_wrapper:
        extra_inputs = webpack_wrapper[NodeRuntimeDepsInfo].deps.to_list()
        link_data = webpack_wrapper[NodeRuntimeDepsInfo].pkgs

    node_runner_arguments = []
    register_node_modules_linker(ctx, node_runner_arguments, inputs, link_data)

    # This is fragile! register_node_modules_linker() assumes we're passing the inputs and the node_runner_arguments
    # to ctx.actions.run, so it uses the output path to the modules manifest.
    # Since we're actually running the node wrapper from within the dev-server runfiles, the path is not correct,
    # and we should use the runfiles manifest path.
    # (In other words, we need modules_manifest.short_path, and it incorrectly provides modules_manifest.path)
    modules_manifest = inputs[-1]

    runfiles = ctx.runfiles(
        files = inputs + extra_inputs + ctx.files._bash_runfile_helpers + ctx.files.webpack_wrapper,
    ).merge(
        webpack_wrapper[DefaultInfo].default_runfiles,
    ).merge(
        webpack_wrapper[DefaultInfo].data_runfiles,
    )

    # Opt-in to the rules_nodejs linker and disable the custom Bazel-aware resolver
    args = [
        "--bazel_node_modules_manifest=$(rlocation %s)" % _to_runfiles_manifest_path(ctx, modules_manifest),
        "--nobazel_patch_module_resolver",
        "--dev_server",
        "@@" + gen_config_file.short_path,
    ]

    ctx.actions.expand_template(
        template = ctx.file._runner_template,
        output = dev_server_runner,
        substitutions = {
            "TEMPLATED_main": ctx.executable.webpack_wrapper.short_path,
            "TEMPLATED_args": " ".join(args),
        },
        is_executable = True,
    )

    return [DefaultInfo(
        files = depset([dev_server_runner]),
        runfiles = runfiles,
        executable = dev_server_runner,
    )]

_webpack_dev_server = rule(
    implementation = _webpack_server_impl,
    attrs = dict(_WEBPACK_BUNDLE_ATTRS.items() + {
        "output_path": attr.string(
            mandatory = False,
            doc = "Name for webpack-dev-server output",
        ),
        "dev_server_port": attr.int(
            default = 9000,
        ),
        "_runner_template": attr.label(
            default = "//webpack:dev_server_template.sh",
            allow_single_file = True,
        ),
        "_bash_runfile_helpers": attr.label(
            default = "@bazel_tools//tools/bash/runfiles",
        ),
    }.items()),
    executable = True,
)

def webpack_dev_server(name, tags = [], mode = None, **kwargs):
    _webpack_dev_server(
        name = name,
        mode = "development",
        # Don't require the user to specify this tag; it's an internal implementation detail
        # to keep the dev server running when its file dependencies change
        tags = tags + ["ibazel_notify_changes"],
        **kwargs
    )
