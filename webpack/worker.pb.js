/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
/*@generated*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.blaze = (function() {
    
        /**
         * Namespace blaze.
         * @exports blaze
         * @namespace
         */
        var blaze = {};
    
        blaze.worker = (function() {
    
            /**
             * Namespace worker.
             * @memberof blaze
             * @namespace
             */
            var worker = {};
    
            worker.Input = (function() {
    
                /**
                 * Properties of an Input.
                 * @memberof blaze.worker
                 * @interface IInput
                 * @property {string|null} [path] Input path
                 * @property {Uint8Array|null} [digest] Input digest
                 */
    
                /**
                 * Constructs a new Input.
                 * @memberof blaze.worker
                 * @classdesc Represents an Input.
                 * @implements IInput
                 * @constructor
                 * @param {blaze.worker.IInput=} [properties] Properties to set
                 */
                function Input(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Input path.
                 * @member {string} path
                 * @memberof blaze.worker.Input
                 * @instance
                 */
                Input.prototype.path = "";
    
                /**
                 * Input digest.
                 * @member {Uint8Array} digest
                 * @memberof blaze.worker.Input
                 * @instance
                 */
                Input.prototype.digest = $util.newBuffer([]);
    
                /**
                 * Creates a new Input instance using the specified properties.
                 * @function create
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {blaze.worker.IInput=} [properties] Properties to set
                 * @returns {blaze.worker.Input} Input instance
                 */
                Input.create = function create(properties) {
                    return new Input(properties);
                };
    
                /**
                 * Encodes the specified Input message. Does not implicitly {@link blaze.worker.Input.verify|verify} messages.
                 * @function encode
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {blaze.worker.IInput} message Input message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Input.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.path != null && message.hasOwnProperty("path"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
                    if (message.digest != null && message.hasOwnProperty("digest"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.digest);
                    return writer;
                };
    
                /**
                 * Encodes the specified Input message, length delimited. Does not implicitly {@link blaze.worker.Input.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {blaze.worker.IInput} message Input message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Input.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Input message from the specified reader or buffer.
                 * @function decode
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {blaze.worker.Input} Input
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Input.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.blaze.worker.Input();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.path = reader.string();
                            break;
                        case 2:
                            message.digest = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an Input message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {blaze.worker.Input} Input
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Input.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Input message.
                 * @function verify
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Input.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.path != null && message.hasOwnProperty("path"))
                        if (!$util.isString(message.path))
                            return "path: string expected";
                    if (message.digest != null && message.hasOwnProperty("digest"))
                        if (!(message.digest && typeof message.digest.length === "number" || $util.isString(message.digest)))
                            return "digest: buffer expected";
                    return null;
                };
    
                /**
                 * Creates an Input message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {blaze.worker.Input} Input
                 */
                Input.fromObject = function fromObject(object) {
                    if (object instanceof $root.blaze.worker.Input)
                        return object;
                    var message = new $root.blaze.worker.Input();
                    if (object.path != null)
                        message.path = String(object.path);
                    if (object.digest != null)
                        if (typeof object.digest === "string")
                            $util.base64.decode(object.digest, message.digest = $util.newBuffer($util.base64.length(object.digest)), 0);
                        else if (object.digest.length)
                            message.digest = object.digest;
                    return message;
                };
    
                /**
                 * Creates a plain object from an Input message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof blaze.worker.Input
                 * @static
                 * @param {blaze.worker.Input} message Input
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Input.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.path = "";
                        object.digest = options.bytes === String ? "" : [];
                    }
                    if (message.path != null && message.hasOwnProperty("path"))
                        object.path = message.path;
                    if (message.digest != null && message.hasOwnProperty("digest"))
                        object.digest = options.bytes === String ? $util.base64.encode(message.digest, 0, message.digest.length) : options.bytes === Array ? Array.prototype.slice.call(message.digest) : message.digest;
                    return object;
                };
    
                /**
                 * Converts this Input to JSON.
                 * @function toJSON
                 * @memberof blaze.worker.Input
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Input.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Input;
            })();
    
            worker.WorkRequest = (function() {
    
                /**
                 * Properties of a WorkRequest.
                 * @memberof blaze.worker
                 * @interface IWorkRequest
                 * @property {Array.<string>|null} ["arguments"] WorkRequest arguments
                 * @property {Array.<blaze.worker.IInput>|null} [inputs] WorkRequest inputs
                 */
    
                /**
                 * Constructs a new WorkRequest.
                 * @memberof blaze.worker
                 * @classdesc Represents a WorkRequest.
                 * @implements IWorkRequest
                 * @constructor
                 * @param {blaze.worker.IWorkRequest=} [properties] Properties to set
                 */
                function WorkRequest(properties) {
                    this["arguments"] = [];
                    this.inputs = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * WorkRequest arguments.
                 * @member {Array.<string>} arguments
                 * @memberof blaze.worker.WorkRequest
                 * @instance
                 */
                WorkRequest.prototype["arguments"] = $util.emptyArray;
    
                /**
                 * WorkRequest inputs.
                 * @member {Array.<blaze.worker.IInput>} inputs
                 * @memberof blaze.worker.WorkRequest
                 * @instance
                 */
                WorkRequest.prototype.inputs = $util.emptyArray;
    
                /**
                 * Creates a new WorkRequest instance using the specified properties.
                 * @function create
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {blaze.worker.IWorkRequest=} [properties] Properties to set
                 * @returns {blaze.worker.WorkRequest} WorkRequest instance
                 */
                WorkRequest.create = function create(properties) {
                    return new WorkRequest(properties);
                };
    
                /**
                 * Encodes the specified WorkRequest message. Does not implicitly {@link blaze.worker.WorkRequest.verify|verify} messages.
                 * @function encode
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {blaze.worker.IWorkRequest} message WorkRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WorkRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message["arguments"] != null && message["arguments"].length)
                        for (var i = 0; i < message["arguments"].length; ++i)
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message["arguments"][i]);
                    if (message.inputs != null && message.inputs.length)
                        for (var i = 0; i < message.inputs.length; ++i)
                            $root.blaze.worker.Input.encode(message.inputs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified WorkRequest message, length delimited. Does not implicitly {@link blaze.worker.WorkRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {blaze.worker.IWorkRequest} message WorkRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WorkRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a WorkRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {blaze.worker.WorkRequest} WorkRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WorkRequest.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.blaze.worker.WorkRequest();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message["arguments"] && message["arguments"].length))
                                message["arguments"] = [];
                            message["arguments"].push(reader.string());
                            break;
                        case 2:
                            if (!(message.inputs && message.inputs.length))
                                message.inputs = [];
                            message.inputs.push($root.blaze.worker.Input.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a WorkRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {blaze.worker.WorkRequest} WorkRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WorkRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a WorkRequest message.
                 * @function verify
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                WorkRequest.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                        if (!Array.isArray(message["arguments"]))
                            return "arguments: array expected";
                        for (var i = 0; i < message["arguments"].length; ++i)
                            if (!$util.isString(message["arguments"][i]))
                                return "arguments: string[] expected";
                    }
                    if (message.inputs != null && message.hasOwnProperty("inputs")) {
                        if (!Array.isArray(message.inputs))
                            return "inputs: array expected";
                        for (var i = 0; i < message.inputs.length; ++i) {
                            var error = $root.blaze.worker.Input.verify(message.inputs[i]);
                            if (error)
                                return "inputs." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a WorkRequest message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {blaze.worker.WorkRequest} WorkRequest
                 */
                WorkRequest.fromObject = function fromObject(object) {
                    if (object instanceof $root.blaze.worker.WorkRequest)
                        return object;
                    var message = new $root.blaze.worker.WorkRequest();
                    if (object["arguments"]) {
                        if (!Array.isArray(object["arguments"]))
                            throw TypeError(".blaze.worker.WorkRequest.arguments: array expected");
                        message["arguments"] = [];
                        for (var i = 0; i < object["arguments"].length; ++i)
                            message["arguments"][i] = String(object["arguments"][i]);
                    }
                    if (object.inputs) {
                        if (!Array.isArray(object.inputs))
                            throw TypeError(".blaze.worker.WorkRequest.inputs: array expected");
                        message.inputs = [];
                        for (var i = 0; i < object.inputs.length; ++i) {
                            if (typeof object.inputs[i] !== "object")
                                throw TypeError(".blaze.worker.WorkRequest.inputs: object expected");
                            message.inputs[i] = $root.blaze.worker.Input.fromObject(object.inputs[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a WorkRequest message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof blaze.worker.WorkRequest
                 * @static
                 * @param {blaze.worker.WorkRequest} message WorkRequest
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                WorkRequest.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object["arguments"] = [];
                        object.inputs = [];
                    }
                    if (message["arguments"] && message["arguments"].length) {
                        object["arguments"] = [];
                        for (var j = 0; j < message["arguments"].length; ++j)
                            object["arguments"][j] = message["arguments"][j];
                    }
                    if (message.inputs && message.inputs.length) {
                        object.inputs = [];
                        for (var j = 0; j < message.inputs.length; ++j)
                            object.inputs[j] = $root.blaze.worker.Input.toObject(message.inputs[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this WorkRequest to JSON.
                 * @function toJSON
                 * @memberof blaze.worker.WorkRequest
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                WorkRequest.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return WorkRequest;
            })();
    
            worker.WorkResponse = (function() {
    
                /**
                 * Properties of a WorkResponse.
                 * @memberof blaze.worker
                 * @interface IWorkResponse
                 * @property {number|null} [exitCode] WorkResponse exitCode
                 * @property {string|null} [output] WorkResponse output
                 */
    
                /**
                 * Constructs a new WorkResponse.
                 * @memberof blaze.worker
                 * @classdesc Represents a WorkResponse.
                 * @implements IWorkResponse
                 * @constructor
                 * @param {blaze.worker.IWorkResponse=} [properties] Properties to set
                 */
                function WorkResponse(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * WorkResponse exitCode.
                 * @member {number} exitCode
                 * @memberof blaze.worker.WorkResponse
                 * @instance
                 */
                WorkResponse.prototype.exitCode = 0;
    
                /**
                 * WorkResponse output.
                 * @member {string} output
                 * @memberof blaze.worker.WorkResponse
                 * @instance
                 */
                WorkResponse.prototype.output = "";
    
                /**
                 * Creates a new WorkResponse instance using the specified properties.
                 * @function create
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {blaze.worker.IWorkResponse=} [properties] Properties to set
                 * @returns {blaze.worker.WorkResponse} WorkResponse instance
                 */
                WorkResponse.create = function create(properties) {
                    return new WorkResponse(properties);
                };
    
                /**
                 * Encodes the specified WorkResponse message. Does not implicitly {@link blaze.worker.WorkResponse.verify|verify} messages.
                 * @function encode
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {blaze.worker.IWorkResponse} message WorkResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WorkResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.exitCode != null && message.hasOwnProperty("exitCode"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.exitCode);
                    if (message.output != null && message.hasOwnProperty("output"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.output);
                    return writer;
                };
    
                /**
                 * Encodes the specified WorkResponse message, length delimited. Does not implicitly {@link blaze.worker.WorkResponse.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {blaze.worker.IWorkResponse} message WorkResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WorkResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a WorkResponse message from the specified reader or buffer.
                 * @function decode
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {blaze.worker.WorkResponse} WorkResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WorkResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.blaze.worker.WorkResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.exitCode = reader.int32();
                            break;
                        case 2:
                            message.output = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a WorkResponse message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {blaze.worker.WorkResponse} WorkResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WorkResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a WorkResponse message.
                 * @function verify
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                WorkResponse.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.exitCode != null && message.hasOwnProperty("exitCode"))
                        if (!$util.isInteger(message.exitCode))
                            return "exitCode: integer expected";
                    if (message.output != null && message.hasOwnProperty("output"))
                        if (!$util.isString(message.output))
                            return "output: string expected";
                    return null;
                };
    
                /**
                 * Creates a WorkResponse message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {blaze.worker.WorkResponse} WorkResponse
                 */
                WorkResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.blaze.worker.WorkResponse)
                        return object;
                    var message = new $root.blaze.worker.WorkResponse();
                    if (object.exitCode != null)
                        message.exitCode = object.exitCode | 0;
                    if (object.output != null)
                        message.output = String(object.output);
                    return message;
                };
    
                /**
                 * Creates a plain object from a WorkResponse message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof blaze.worker.WorkResponse
                 * @static
                 * @param {blaze.worker.WorkResponse} message WorkResponse
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                WorkResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.exitCode = 0;
                        object.output = "";
                    }
                    if (message.exitCode != null && message.hasOwnProperty("exitCode"))
                        object.exitCode = message.exitCode;
                    if (message.output != null && message.hasOwnProperty("output"))
                        object.output = message.output;
                    return object;
                };
    
                /**
                 * Converts this WorkResponse to JSON.
                 * @function toJSON
                 * @memberof blaze.worker.WorkResponse
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                WorkResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return WorkResponse;
            })();
    
            return worker;
        })();
    
        return blaze;
    })();

    return $root;
});
