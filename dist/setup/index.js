/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(8974);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8974:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(1595));

var _v2 = _interopRequireDefault(__nccwpck_require__(6993));

var _v3 = _interopRequireDefault(__nccwpck_require__(1472));

var _v4 = _interopRequireDefault(__nccwpck_require__(6217));

var _nil = _interopRequireDefault(__nccwpck_require__(2381));

var _version = _interopRequireDefault(__nccwpck_require__(427));

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

var _parse = _interopRequireDefault(__nccwpck_require__(6385));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 5842:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 2381:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 6385:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 6230:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 9784:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 8844:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 1458:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(9784));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6993:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5920));

var _md = _interopRequireDefault(__nccwpck_require__(5842));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5920:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

var _parse = _interopRequireDefault(__nccwpck_require__(6385));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 1472:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(9784));

var _stringify = _interopRequireDefault(__nccwpck_require__(1458));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 6217:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5920));

var _sha = _interopRequireDefault(__nccwpck_require__(8844));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 2609:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(6230));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 427:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(2609));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const childProcess = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const util_1 = __nccwpck_require__(3837);
const ioUtil = __importStar(__nccwpck_require__(1962));
const exec = util_1.promisify(childProcess.exec);
const execFile = util_1.promisify(childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
            try {
                const cmdPath = ioUtil.getCmdPath();
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
                else {
                    yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield execFile(`rm`, [`-rf`, `${inputPath}`]);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 2473:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
const semver = __importStar(__nccwpck_require__(562));
const core_1 = __nccwpck_require__(2186);
// needs to be require for core node modules to be mocked
/* eslint @typescript-eslint/no-require-imports: 0 */
const os = __nccwpck_require__(2037);
const cp = __nccwpck_require__(2081);
const fs = __nccwpck_require__(7147);
function _findMatch(versionSpec, stable, candidates, archFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
            const version = candidate.version;
            core_1.debug(`check ${version} satisfies ${versionSpec}`);
            if (semver.satisfies(version, versionSpec) &&
                (!stable || candidate.stable === stable)) {
                file = candidate.files.find(item => {
                    core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
                    let chk = item.arch === archFilter && item.platform === platFilter;
                    if (chk && item.platform_version) {
                        const osVersion = module.exports._getOsVersion();
                        if (osVersion === item.platform_version) {
                            chk = true;
                        }
                        else {
                            chk = semver.satisfies(osVersion, item.platform_version);
                        }
                    }
                    return chk;
                });
                if (file) {
                    core_1.debug(`matched ${candidate.version}`);
                    match = candidate;
                    break;
                }
            }
        }
        if (match && file) {
            // clone since we're mutating the file list to be only the file that matches
            result = Object.assign({}, match);
            result.files = [file];
        }
        return result;
    });
}
exports._findMatch = _findMatch;
function _getOsVersion() {
    // TODO: add windows and other linux, arm variants
    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
    const plat = os.platform();
    let version = '';
    if (plat === 'darwin') {
        version = cp.execSync('sw_vers -productVersion').toString();
    }
    else if (plat === 'linux') {
        // lsb_release process not in some containers, readfile
        // Run cat /etc/lsb-release
        // DISTRIB_ID=Ubuntu
        // DISTRIB_RELEASE=18.04
        // DISTRIB_CODENAME=bionic
        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
        const lsbContents = module.exports._readLinuxVersionFile();
        if (lsbContents) {
            const lines = lsbContents.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts.length === 2 &&
                    (parts[0].trim() === 'VERSION_ID' ||
                        parts[0].trim() === 'DISTRIB_RELEASE')) {
                    version = parts[1]
                        .trim()
                        .replace(/^"/, '')
                        .replace(/"$/, '');
                    break;
                }
            }
        }
    }
    return version;
}
exports._getOsVersion = _getOsVersion;
function _readLinuxVersionFile() {
    const lsbReleaseFile = '/etc/lsb-release';
    const osReleaseFile = '/etc/os-release';
    let contents = '';
    if (fs.existsSync(lsbReleaseFile)) {
        contents = fs.readFileSync(lsbReleaseFile).toString();
    }
    else if (fs.existsSync(osReleaseFile)) {
        contents = fs.readFileSync(osReleaseFile).toString();
    }
    return contents;
}
exports._readLinuxVersionFile = _readLinuxVersionFile;
//# sourceMappingURL=manifest.js.map

/***/ }),

/***/ 8279:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetryHelper = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Internal class for retries
 */
class RetryHelper {
    constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
            throw new Error('max attempts should be greater than or equal to 1');
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
            throw new Error('min seconds should be less than or equal to max seconds');
        }
    }
    execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 1;
            while (attempt < this.maxAttempts) {
                // Try
                try {
                    return yield action();
                }
                catch (err) {
                    if (isRetryable && !isRetryable(err)) {
                        throw err;
                    }
                    core.info(err.message);
                }
                // Sleep
                const seconds = this.getSleepAmount();
                core.info(`Waiting ${seconds} seconds before trying again`);
                yield this.sleep(seconds);
                attempt++;
            }
            // Last attempt
            return yield action();
        });
    }
    getSleepAmount() {
        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
            this.minSeconds);
    }
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, seconds * 1000));
        });
    }
}
exports.RetryHelper = RetryHelper;
//# sourceMappingURL=retry-helper.js.map

/***/ }),

/***/ 7784:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateVersions = exports.isExplicitVersion = exports.findFromManifest = exports.getManifestFromRepo = exports.findAllVersions = exports.find = exports.cacheFile = exports.cacheDir = exports.extractZip = exports.extractXar = exports.extractTar = exports.extract7z = exports.downloadTool = exports.HTTPError = void 0;
const core = __importStar(__nccwpck_require__(2186));
const io = __importStar(__nccwpck_require__(7436));
const fs = __importStar(__nccwpck_require__(7147));
const mm = __importStar(__nccwpck_require__(2473));
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const httpm = __importStar(__nccwpck_require__(6255));
const semver = __importStar(__nccwpck_require__(562));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const assert_1 = __nccwpck_require__(9491);
const v4_1 = __importDefault(__nccwpck_require__(824));
const exec_1 = __nccwpck_require__(1514);
const retry_helper_1 = __nccwpck_require__(8279);
class HTTPError extends Error {
    constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HTTPError = HTTPError;
const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const userAgent = 'actions/tool-cache';
/**
 * Download a tool from an url and stream it into a file
 *
 * @param url       url of tool to download
 * @param dest      path to download tool
 * @param auth      authorization header
 * @param headers   other headers
 * @returns         path to downloaded tool
 */
function downloadTool(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path.join(_getTempDirectory(), v4_1.default());
        yield io.mkdirP(path.dirname(dest));
        core.debug(`Downloading ${url}`);
        core.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
        const maxSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
            return yield downloadToolAttempt(url, dest || '', auth, headers);
        }), (err) => {
            if (err instanceof HTTPError && err.httpStatusCode) {
                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
                if (err.httpStatusCode < 500 &&
                    err.httpStatusCode !== 408 &&
                    err.httpStatusCode !== 429) {
                    return false;
                }
            }
            // Otherwise retry
            return true;
        });
    });
}
exports.downloadTool = downloadTool;
function downloadToolAttempt(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
            throw new Error(`Destination file path ${dest} already exists`);
        }
        // Get the response headers
        const http = new httpm.HttpClient(userAgent, [], {
            allowRetries: false
        });
        if (auth) {
            core.debug('set auth');
            if (headers === undefined) {
                headers = {};
            }
            headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
            const err = new HTTPError(response.message.statusCode);
            core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            throw err;
        }
        // Download the response body
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
            yield pipeline(readStream, fs.createWriteStream(dest));
            core.debug('download complete');
            succeeded = true;
            return dest;
        }
        finally {
            // Error, delete dest before retry
            if (!succeeded) {
                core.debug('download failed');
                try {
                    yield io.rmRF(dest);
                }
                catch (err) {
                    core.debug(`Failed to delete '${dest}'. ${err.message}`);
                }
            }
        }
    });
}
/**
 * Extract a .7z file
 *
 * @param file     path to the .7z file
 * @param dest     destination directory. Optional.
 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
 * interface, it is smaller than the full command line interface, and it does support long paths. At the
 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
 * to 7zr.exe can be pass to this function.
 * @returns        path to the destination directory
 */
function extract7z(file, dest, _7zPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS, 'extract7z() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
            try {
                const logLevel = core.isDebug() ? '-bb1' : '-bb0';
                const args = [
                    'x',
                    logLevel,
                    '-bd',
                    '-sccUTF-8',
                    file
                ];
                const options = {
                    silent: true
                };
                yield exec_1.exec(`"${_7zPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        else {
            const escapedScript = path
                .join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1')
                .replace(/'/g, "''")
                .replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ];
            const options = {
                silent: true
            };
            try {
                const powershellPath = yield io.which('powershell', true);
                yield exec_1.exec(`"${powershellPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        return dest;
    });
}
exports.extract7z = extract7z;
/**
 * Extract a compressed tar archive
 *
 * @param file     path to the tar
 * @param dest     destination directory. Optional.
 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
 * @returns        path to the destination directory
 */
function extractTar(file, dest, flags = 'xz') {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        // Create dest
        dest = yield _createExtractFolder(dest);
        // Determine whether GNU tar
        core.debug('Checking tar --version');
        let versionOutput = '';
        yield exec_1.exec('tar --version', [], {
            ignoreReturnCode: true,
            silent: true,
            listeners: {
                stdout: (data) => (versionOutput += data.toString()),
                stderr: (data) => (versionOutput += data.toString())
            }
        });
        core.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
        // Initialize args
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        if (core.isDebug() && !flags.includes('v')) {
            args.push('-v');
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS && isGnuTar) {
            args.push('--force-local');
            destArg = dest.replace(/\\/g, '/');
            // Technically only the dest needs to have `/` but for aesthetic consistency
            // convert slashes in the file arg too.
            fileArg = file.replace(/\\/g, '/');
        }
        if (isGnuTar) {
            // Suppress warnings when using GNU tar to extract archives created by BSD tar
            args.push('--warning=no-unknown-keyword');
            args.push('--overwrite');
        }
        args.push('-C', destArg, '-f', fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
    });
}
exports.extractTar = extractTar;
/**
 * Extract a xar compatible archive
 *
 * @param file     path to the archive
 * @param dest     destination directory. Optional.
 * @param flags    flags for the xar. Optional.
 * @returns        path to the destination directory
 */
function extractXar(file, dest, flags = []) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, 'extractXar() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        args.push('-x', '-C', dest, '-f', file);
        if (core.isDebug()) {
            args.push('-v');
        }
        const xarPath = yield io.which('xar', true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
    });
}
exports.extractXar = extractXar;
/**
 * Extract a zip
 *
 * @param file     path to the zip
 * @param dest     destination directory. Optional.
 * @returns        path to the destination directory
 */
function extractZip(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS) {
            yield extractZipWin(file, dest);
        }
        else {
            yield extractZipNix(file, dest);
        }
        return dest;
    });
}
exports.extractZip = extractZip;
function extractZipWin(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // build the powershell command
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
        const pwshPath = yield io.which('pwsh', false);
        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
        //and the -Force flag for Expand-Archive as a fallback
        if (pwshPath) {
            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
            const pwshCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                pwshCommand
            ];
            core.debug(`Using pwsh at path: ${pwshPath}`);
            yield exec_1.exec(`"${pwshPath}"`, args);
        }
        else {
            const powershellCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                powershellCommand
            ];
            const powershellPath = yield io.which('powershell', true);
            core.debug(`Using powershell at path: ${powershellPath}`);
            yield exec_1.exec(`"${powershellPath}"`, args);
        }
    });
}
function extractZipNix(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io.which('unzip', true);
        const args = [file];
        if (!core.isDebug()) {
            args.unshift('-q');
        }
        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
    });
}
/**
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir    the directory to cache into tools
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheDir(sourceDir, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source dir: ${sourceDir}`);
        if (!fs.statSync(sourceDir).isDirectory()) {
            throw new Error('sourceDir is not a directory');
        }
        // Create the tool dir
        const destPath = yield _createToolPath(tool, version, arch);
        // copy each child item. do not move. move can fail on Windows
        // due to anti-virus software having an open handle on a file.
        for (const itemName of fs.readdirSync(sourceDir)) {
            const s = path.join(sourceDir, itemName);
            yield io.cp(s, destPath, { recursive: true });
        }
        // write .complete
        _completeToolPath(tool, version, arch);
        return destPath;
    });
}
exports.cacheDir = cacheDir;
/**
 * Caches a downloaded file (GUID) and installs it
 * into the tool cache with a given targetName
 *
 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
 * @param targetFile    the name of the file name in the tools directory
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheFile(sourceFile, targetFile, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source file: ${sourceFile}`);
        if (!fs.statSync(sourceFile).isFile()) {
            throw new Error('sourceFile is not a file');
        }
        // create the tool dir
        const destFolder = yield _createToolPath(tool, version, arch);
        // copy instead of move. move can fail on Windows due to
        // anti-virus software having an open handle on a file.
        const destPath = path.join(destFolder, targetFile);
        core.debug(`destination file ${destPath}`);
        yield io.cp(sourceFile, destPath);
        // write .complete
        _completeToolPath(tool, version, arch);
        return destFolder;
    });
}
exports.cacheFile = cacheFile;
/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   version of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */
function find(toolName, versionSpec, arch) {
    if (!toolName) {
        throw new Error('toolName parameter is required');
    }
    if (!versionSpec) {
        throw new Error('versionSpec parameter is required');
    }
    arch = arch || os.arch();
    // attempt to resolve an explicit version
    if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
    }
    // check for the explicit version in the cache
    let toolPath = '';
    if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || '';
        const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core.debug(`checking cache: ${cachePath}`);
        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
            core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
            toolPath = cachePath;
        }
        else {
            core.debug('not found');
        }
    }
    return toolPath;
}
exports.find = find;
/**
 * Finds the paths to all versions of a tool that are installed in the local tool cache
 *
 * @param toolName  name of the tool
 * @param arch      optional arch.  defaults to arch of computer
 */
function findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || os.arch();
    const toolPath = path.join(_getCacheDirectory(), toolName);
    if (fs.existsSync(toolPath)) {
        const children = fs.readdirSync(toolPath);
        for (const child of children) {
            if (isExplicitVersion(child)) {
                const fullPath = path.join(toolPath, child, arch || '');
                if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
                    versions.push(child);
                }
            }
        }
    }
    return versions;
}
exports.findAllVersions = findAllVersions;
function getManifestFromRepo(owner, repo, auth, branch = 'master') {
    return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient('tool-cache');
        const headers = {};
        if (auth) {
            core.debug('set auth');
            headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
            return releases;
        }
        let manifestUrl = '';
        for (const item of response.result.tree) {
            if (item.path === 'versions-manifest.json') {
                manifestUrl = item.url;
                break;
            }
        }
        headers['accept'] = 'application/vnd.github.VERSION.raw';
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
            // shouldn't be needed but protects against invalid json saved with BOM
            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
            try {
                releases = JSON.parse(versionsRaw);
            }
            catch (_a) {
                core.debug('Invalid json');
            }
        }
        return releases;
    });
}
exports.getManifestFromRepo = getManifestFromRepo;
function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
    return __awaiter(this, void 0, void 0, function* () {
        // wrap the internal impl
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
    });
}
exports.findFromManifest = findFromManifest;
function _createExtractFolder(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
            // create a temp dir
            dest = path.join(_getTempDirectory(), v4_1.default());
        }
        yield io.mkdirP(dest);
        return dest;
    });
}
function _createToolPath(tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
        core.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io.rmRF(folderPath);
        yield io.rmRF(markerPath);
        yield io.mkdirP(folderPath);
        return folderPath;
    });
}
function _completeToolPath(tool, version, arch) {
    const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
    const markerPath = `${folderPath}.complete`;
    fs.writeFileSync(markerPath, '');
    core.debug('finished caching tool');
}
/**
 * Check if version string is explicit
 *
 * @param versionSpec      version string to check
 */
function isExplicitVersion(versionSpec) {
    const c = semver.clean(versionSpec) || '';
    core.debug(`isExplicit: ${c}`);
    const valid = semver.valid(c) != null;
    core.debug(`explicit? ${valid}`);
    return valid;
}
exports.isExplicitVersion = isExplicitVersion;
/**
 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
 *
 * @param versions        array of versions to evaluate
 * @param versionSpec     semantic version spec to satisfy
 */
function evaluateVersions(versions, versionSpec) {
    let version = '';
    core.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
            return 1;
        }
        return -1;
    });
    for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) {
        core.debug(`matched: ${version}`);
    }
    else {
        core.debug('match not found');
    }
    return version;
}
exports.evaluateVersions = evaluateVersions;
/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
    assert_1.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
    return cacheDirectory;
}
/**
 * Gets RUNNER_TEMP
 */
function _getTempDirectory() {
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    assert_1.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
    return tempDirectory;
}
/**
 * Gets a global variable
 */
function _getGlobal(key, defaultValue) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const value = global[key];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return value !== undefined ? value : defaultValue;
}
/**
 * Returns an array of unique values.
 * @param values Values to make unique.
 */
function _unique(values) {
    return Array.from(new Set(values));
}
//# sourceMappingURL=tool-cache.js.map

/***/ }),

/***/ 562:
/***/ ((module, exports) => {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}


/***/ }),

/***/ 7888:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
}(this, (function (exports) { 'use strict';

    /**
     * Creates a continuation function with some arguments already applied.
     *
     * Useful as a shorthand when combined with other control flow functions. Any
     * arguments passed to the returned function are added to the arguments
     * originally passed to apply.
     *
     * @name apply
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} fn - The function you want to eventually apply all
     * arguments to. Invokes with (arguments...).
     * @param {...*} arguments... - Any number of arguments to automatically apply
     * when the continuation is called.
     * @returns {Function} the partially-applied function
     * @example
     *
     * // using apply
     * async.parallel([
     *     async.apply(fs.writeFile, 'testfile1', 'test1'),
     *     async.apply(fs.writeFile, 'testfile2', 'test2')
     * ]);
     *
     *
     * // the same process without using apply
     * async.parallel([
     *     function(callback) {
     *         fs.writeFile('testfile1', 'test1', callback);
     *     },
     *     function(callback) {
     *         fs.writeFile('testfile2', 'test2', callback);
     *     }
     * ]);
     *
     * // It's possible to pass any number of additional arguments when calling the
     * // continuation:
     *
     * node> var fn = async.apply(sys.puts, 'one');
     * node> fn('two', 'three');
     * one
     * two
     * three
     */
    function apply(fn, ...args) {
        return (...callArgs) => fn(...args,...callArgs);
    }

    function initialParams (fn) {
        return function (...args/*, callback*/) {
            var callback = args.pop();
            return fn.call(this, args, callback);
        };
    }

    /* istanbul ignore file */

    var hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
    var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
    var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

    function fallback(fn) {
        setTimeout(fn, 0);
    }

    function wrap(defer) {
        return (fn, ...args) => defer(() => fn(...args));
    }

    var _defer;

    if (hasQueueMicrotask) {
        _defer = queueMicrotask;
    } else if (hasSetImmediate) {
        _defer = setImmediate;
    } else if (hasNextTick) {
        _defer = process.nextTick;
    } else {
        _defer = fallback;
    }

    var setImmediate$1 = wrap(_defer);

    /**
     * Take a sync function and make it async, passing its return value to a
     * callback. This is useful for plugging sync functions into a waterfall,
     * series, or other async functions. Any arguments passed to the generated
     * function will be passed to the wrapped function (except for the final
     * callback argument). Errors thrown will be passed to the callback.
     *
     * If the function passed to `asyncify` returns a Promise, that promises's
     * resolved/rejected state will be used to call the callback, rather than simply
     * the synchronous return value.
     *
     * This also means you can asyncify ES2017 `async` functions.
     *
     * @name asyncify
     * @static
     * @memberOf module:Utils
     * @method
     * @alias wrapSync
     * @category Util
     * @param {Function} func - The synchronous function, or Promise-returning
     * function to convert to an {@link AsyncFunction}.
     * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
     * invoked with `(args..., callback)`.
     * @example
     *
     * // passing a regular synchronous function
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(JSON.parse),
     *     function (data, next) {
     *         // data is the result of parsing the text.
     *         // If there was a parsing error, it would have been caught.
     *     }
     * ], callback);
     *
     * // passing a function returning a promise
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(function (contents) {
     *         return db.model.create(contents);
     *     }),
     *     function (model, next) {
     *         // `model` is the instantiated model object.
     *         // If there was an error, this function would be skipped.
     *     }
     * ], callback);
     *
     * // es2017 example, though `asyncify` is not needed if your JS environment
     * // supports async functions out of the box
     * var q = async.queue(async.asyncify(async function(file) {
     *     var intermediateStep = await processFile(file);
     *     return await somePromise(intermediateStep)
     * }));
     *
     * q.push(files);
     */
    function asyncify(func) {
        if (isAsync(func)) {
            return function (...args/*, callback*/) {
                const callback = args.pop();
                const promise = func.apply(this, args);
                return handlePromise(promise, callback)
            }
        }

        return initialParams(function (args, callback) {
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (result && typeof result.then === 'function') {
                return handlePromise(result, callback)
            } else {
                callback(null, result);
            }
        });
    }

    function handlePromise(promise, callback) {
        return promise.then(value => {
            invokeCallback(callback, null, value);
        }, err => {
            invokeCallback(callback, err && err.message ? err : new Error(err));
        });
    }

    function invokeCallback(callback, error, value) {
        try {
            callback(error, value);
        } catch (err) {
            setImmediate$1(e => { throw e }, err);
        }
    }

    function isAsync(fn) {
        return fn[Symbol.toStringTag] === 'AsyncFunction';
    }

    function isAsyncGenerator(fn) {
        return fn[Symbol.toStringTag] === 'AsyncGenerator';
    }

    function isAsyncIterable(obj) {
        return typeof obj[Symbol.asyncIterator] === 'function';
    }

    function wrapAsync(asyncFn) {
        if (typeof asyncFn !== 'function') throw new Error('expected a function')
        return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
    }

    // conditionally promisify a function.
    // only return a promise if a callback is omitted
    function awaitify (asyncFn, arity = asyncFn.length) {
        if (!arity) throw new Error('arity is undefined')
        function awaitable (...args) {
            if (typeof args[arity - 1] === 'function') {
                return asyncFn.apply(this, args)
            }

            return new Promise((resolve, reject) => {
                args[arity - 1] = (err, ...cbArgs) => {
                    if (err) return reject(err)
                    resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
                };
                asyncFn.apply(this, args);
            })
        }

        return awaitable
    }

    function applyEach (eachfn) {
        return function applyEach(fns, ...callArgs) {
            const go = awaitify(function (callback) {
                var that = this;
                return eachfn(fns, (fn, cb) => {
                    wrapAsync(fn).apply(that, callArgs.concat(cb));
                }, callback);
            });
            return go;
        };
    }

    function _asyncMap(eachfn, arr, iteratee, callback) {
        arr = arr || [];
        var results = [];
        var counter = 0;
        var _iteratee = wrapAsync(iteratee);

        return eachfn(arr, (value, _, iterCb) => {
            var index = counter++;
            _iteratee(value, (err, v) => {
                results[index] = v;
                iterCb(err);
            });
        }, err => {
            callback(err, results);
        });
    }

    function isArrayLike(value) {
        return value &&
            typeof value.length === 'number' &&
            value.length >= 0 &&
            value.length % 1 === 0;
    }

    // A temporary value used to identify if the loop should be broken.
    // See #1064, #1293
    const breakLoop = {};

    function once(fn) {
        function wrapper (...args) {
            if (fn === null) return;
            var callFn = fn;
            fn = null;
            callFn.apply(this, args);
        }
        Object.assign(wrapper, fn);
        return wrapper
    }

    function getIterator (coll) {
        return coll[Symbol.iterator] && coll[Symbol.iterator]();
    }

    function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
            return ++i < len ? {value: coll[i], key: i} : null;
        }
    }

    function createES2015Iterator(iterator) {
        var i = -1;
        return function next() {
            var item = iterator.next();
            if (item.done)
                return null;
            i++;
            return {value: item.value, key: i};
        }
    }

    function createObjectIterator(obj) {
        var okeys = obj ? Object.keys(obj) : [];
        var i = -1;
        var len = okeys.length;
        return function next() {
            var key = okeys[++i];
            if (key === '__proto__') {
                return next();
            }
            return i < len ? {value: obj[key], key} : null;
        };
    }

    function createIterator(coll) {
        if (isArrayLike(coll)) {
            return createArrayIterator(coll);
        }

        var iterator = getIterator(coll);
        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
    }

    function onlyOnce(fn) {
        return function (...args) {
            if (fn === null) throw new Error("Callback was already called.");
            var callFn = fn;
            fn = null;
            callFn.apply(this, args);
        };
    }

    // for async generators
    function asyncEachOfLimit(generator, limit, iteratee, callback) {
        let done = false;
        let canceled = false;
        let awaiting = false;
        let running = 0;
        let idx = 0;

        function replenish() {
            //console.log('replenish')
            if (running >= limit || awaiting || done) return
            //console.log('replenish awaiting')
            awaiting = true;
            generator.next().then(({value, done: iterDone}) => {
                //console.log('got value', value)
                if (canceled || done) return
                awaiting = false;
                if (iterDone) {
                    done = true;
                    if (running <= 0) {
                        //console.log('done nextCb')
                        callback(null);
                    }
                    return;
                }
                running++;
                iteratee(value, idx, iterateeCallback);
                idx++;
                replenish();
            }).catch(handleError);
        }

        function iterateeCallback(err, result) {
            //console.log('iterateeCallback')
            running -= 1;
            if (canceled) return
            if (err) return handleError(err)

            if (err === false) {
                done = true;
                canceled = true;
                return
            }

            if (result === breakLoop || (done && running <= 0)) {
                done = true;
                //console.log('done iterCb')
                return callback(null);
            }
            replenish();
        }

        function handleError(err) {
            if (canceled) return
            awaiting = false;
            done = true;
            callback(err);
        }

        replenish();
    }

    var eachOfLimit = (limit) => {
        return (obj, iteratee, callback) => {
            callback = once(callback);
            if (limit <= 0) {
                throw new RangeError('concurrency limit cannot be less than 1')
            }
            if (!obj) {
                return callback(null);
            }
            if (isAsyncGenerator(obj)) {
                return asyncEachOfLimit(obj, limit, iteratee, callback)
            }
            if (isAsyncIterable(obj)) {
                return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback)
            }
            var nextElem = createIterator(obj);
            var done = false;
            var canceled = false;
            var running = 0;
            var looping = false;

            function iterateeCallback(err, value) {
                if (canceled) return
                running -= 1;
                if (err) {
                    done = true;
                    callback(err);
                }
                else if (err === false) {
                    done = true;
                    canceled = true;
                }
                else if (value === breakLoop || (done && running <= 0)) {
                    done = true;
                    return callback(null);
                }
                else if (!looping) {
                    replenish();
                }
            }

            function replenish () {
                looping = true;
                while (running < limit && !done) {
                    var elem = nextElem();
                    if (elem === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
                }
                looping = false;
            }

            replenish();
        };
    };

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name eachOfLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each
     * item in `coll`. The `key` is the item's key, or index in the case of an
     * array.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachOfLimit$1(coll, limit, iteratee, callback) {
        return eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
    }

    var eachOfLimit$2 = awaitify(eachOfLimit$1, 4);

    // eachOf implementation optimized for array-likes
    function eachOfArrayLike(coll, iteratee, callback) {
        callback = once(callback);
        var index = 0,
            completed = 0,
            {length} = coll,
            canceled = false;
        if (length === 0) {
            callback(null);
        }

        function iteratorCallback(err, value) {
            if (err === false) {
                canceled = true;
            }
            if (canceled === true) return
            if (err) {
                callback(err);
            } else if ((++completed === length) || value === breakLoop) {
                callback(null);
            }
        }

        for (; index < length; index++) {
            iteratee(coll[index], index, onlyOnce(iteratorCallback));
        }
    }

    // a generic version of eachOf which can handle array, object, and iterator cases.
    function eachOfGeneric (coll, iteratee, callback) {
        return eachOfLimit$2(coll, Infinity, iteratee, callback);
    }

    /**
     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
     * to the iteratee.
     *
     * @name eachOf
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEachOf
     * @category Collection
     * @see [async.each]{@link module:Collections.each}
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each
     * item in `coll`.
     * The `key` is the item's key, or index in the case of an array.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dev.json is a file containing a valid json object config for dev environment
     * // dev.json is a file containing a valid json object config for test environment
     * // prod.json is a file containing a valid json object config for prod environment
     * // invalid.json is a file with a malformed json object
     *
     * let configs = {}; //global variable
     * let validConfigFileMap = {dev: 'dev.json', test: 'test.json', prod: 'prod.json'};
     * let invalidConfigFileMap = {dev: 'dev.json', test: 'test.json', invalid: 'invalid.json'};
     *
     * // asynchronous function that reads a json file and parses the contents as json object
     * function parseFile(file, key, callback) {
     *     fs.readFile(file, "utf8", function(err, data) {
     *         if (err) return calback(err);
     *         try {
     *             configs[key] = JSON.parse(data);
     *         } catch (e) {
     *             return callback(e);
     *         }
     *         callback();
     *     });
     * }
     *
     * // Using callbacks
     * async.forEachOf(validConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *     } else {
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *         // JSON parse error exception
     *     } else {
     *         console.log(configs);
     *     }
     * });
     *
     * // Using Promises
     * async.forEachOf(validConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     *     // configs is now a map of JSON data, e.g.
     *     // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     * }).catch( err => {
     *     console.error(err);
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     * }).catch( err => {
     *     console.error(err);
     *     // JSON parse error exception
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.forEachOf(validConfigFileMap, parseFile);
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * //Error handing
     * async () => {
     *     try {
     *         let result = await async.forEachOf(invalidConfigFileMap, parseFile);
     *         console.log(configs);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // JSON parse error exception
     *     }
     * }
     *
     */
    function eachOf(coll, iteratee, callback) {
        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
        return eachOfImplementation(coll, wrapAsync(iteratee), callback);
    }

    var eachOf$1 = awaitify(eachOf, 3);

    /**
     * Produces a new collection of values by mapping each value in `coll` through
     * the `iteratee` function. The `iteratee` is called with an item from `coll`
     * and a callback for when it has finished processing. Each of these callbacks
     * takes 2 arguments: an `error`, and the transformed item from `coll`. If
     * `iteratee` passes an error to its callback, the main `callback` (for the
     * `map` function) is immediately called with the error.
     *
     * Note, that since this function applies the `iteratee` to each item in
     * parallel, there is no guarantee that the `iteratee` functions will complete
     * in order. However, the results array will be in the same order as the
     * original `coll`.
     *
     * If `map` is passed an Object, the results will be an Array.  The results
     * will roughly be in the order of the original Objects' keys (but this can
     * vary across JavaScript engines).
     *
     * @name map
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an Array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.map(fileList, getFileSizeInBytes, function(err, results) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(results);
     *         // results is now an array of the file size in bytes for each file, e.g.
     *         // [ 1000, 2000, 3000]
     *     }
     * });
     *
     * // Error Handling
     * async.map(withMissingFileList, getFileSizeInBytes, function(err, results) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(results);
     *     }
     * });
     *
     * // Using Promises
     * async.map(fileList, getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     *     // results is now an array of the file size in bytes for each file, e.g.
     *     // [ 1000, 2000, 3000]
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.map(withMissingFileList, getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.map(fileList, getFileSizeInBytes);
     *         console.log(results);
     *         // results is now an array of the file size in bytes for each file, e.g.
     *         // [ 1000, 2000, 3000]
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let results = await async.map(withMissingFileList, getFileSizeInBytes);
     *         console.log(results);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */
    function map (coll, iteratee, callback) {
        return _asyncMap(eachOf$1, coll, iteratee, callback)
    }
    var map$1 = awaitify(map, 3);

    /**
     * Applies the provided arguments to each function in the array, calling
     * `callback` after all functions have completed. If you only provide the first
     * argument, `fns`, then it will return a function which lets you pass in the
     * arguments as if it were a single function call. If more arguments are
     * provided, `callback` is required while `args` is still optional. The results
     * for each of the applied async functions are passed to the final callback
     * as an array.
     *
     * @name applyEach
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s
     * to all call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {AsyncFunction} - Returns a function that takes no args other than
     * an optional callback, that is the result of applying the `args` to each
     * of the functions.
     * @example
     *
     * const appliedFn = async.applyEach([enableSearch, updateSchema], 'bucket')
     *
     * appliedFn((err, results) => {
     *     // results[0] is the results for `enableSearch`
     *     // results[1] is the results for `updateSchema`
     * });
     *
     * // partial application example:
     * async.each(
     *     buckets,
     *     async (bucket) => async.applyEach([enableSearch, updateSchema], bucket)(),
     *     callback
     * );
     */
    var applyEach$1 = applyEach(map$1);

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
     *
     * @name eachOfSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachOfSeries(coll, iteratee, callback) {
        return eachOfLimit$2(coll, 1, iteratee, callback)
    }
    var eachOfSeries$1 = awaitify(eachOfSeries, 3);

    /**
     * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
     *
     * @name mapSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */
    function mapSeries (coll, iteratee, callback) {
        return _asyncMap(eachOfSeries$1, coll, iteratee, callback)
    }
    var mapSeries$1 = awaitify(mapSeries, 3);

    /**
     * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
     *
     * @name applyEachSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.applyEach]{@link module:ControlFlow.applyEach}
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s to all
     * call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {AsyncFunction} - A function, that when called, is the result of
     * appling the `args` to the list of functions.  It takes no args, other than
     * a callback.
     */
    var applyEachSeries = applyEach(mapSeries$1);

    const PROMISE_SYMBOL = Symbol('promiseCallback');

    function promiseCallback () {
        let resolve, reject;
        function callback (err, ...args) {
            if (err) return reject(err)
            resolve(args.length > 1 ? args : args[0]);
        }

        callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
            resolve = res,
            reject = rej;
        });

        return callback
    }

    /**
     * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
     * their requirements. Each function can optionally depend on other functions
     * being completed first, and each function is run as soon as its requirements
     * are satisfied.
     *
     * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
     * will stop. Further tasks will not execute (so any other functions depending
     * on it will not run), and the main `callback` is immediately called with the
     * error.
     *
     * {@link AsyncFunction}s also receive an object containing the results of functions which
     * have completed so far as the first argument, if they have dependencies. If a
     * task function has no dependencies, it will only be passed a callback.
     *
     * @name auto
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Object} tasks - An object. Each of its properties is either a
     * function or an array of requirements, with the {@link AsyncFunction} itself the last item
     * in the array. The object's key of a property serves as the name of the task
     * defined by that property, i.e. can be used when specifying requirements for
     * other tasks. The function receives one or two arguments:
     * * a `results` object, containing the results of the previously executed
     *   functions, only passed if the task has any dependencies,
     * * a `callback(err, result)` function, which must be called when finished,
     *   passing an `error` (which can be `null`) and the result of the function's
     *   execution.
     * @param {number} [concurrency=Infinity] - An optional `integer` for
     * determining the maximum number of tasks that can be run in parallel. By
     * default, as many as possible.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback. Results are always returned; however, if an
     * error occurs, no further `tasks` will be performed, and the results object
     * will only contain partial results. Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     * @example
     *
     * //Using Callbacks
     * async.auto({
     *     get_data: function(callback) {
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: ['get_data', 'make_folder', function(results, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(results, callback) {
     *         // once the file is written let's email a link to it...
     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *     }]
     * }, function(err, results) {
     *     if (err) {
     *         console.log('err = ', err);
     *     }
     *     console.log('results = ', results);
     *     // results = {
     *     //     get_data: ['data', 'converted to array']
     *     //     make_folder; 'folder',
     *     //     write_file: 'filename'
     *     //     email_link: { file: 'filename', email: 'user@example.com' }
     *     // }
     * });
     *
     * //Using Promises
     * async.auto({
     *     get_data: function(callback) {
     *         console.log('in get_data');
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         console.log('in make_folder');
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: ['get_data', 'make_folder', function(results, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(results, callback) {
     *         // once the file is written let's email a link to it...
     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *     }]
     * }).then(results => {
     *     console.log('results = ', results);
     *     // results = {
     *     //     get_data: ['data', 'converted to array']
     *     //     make_folder; 'folder',
     *     //     write_file: 'filename'
     *     //     email_link: { file: 'filename', email: 'user@example.com' }
     *     // }
     * }).catch(err => {
     *     console.log('err = ', err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.auto({
     *             get_data: function(callback) {
     *                 // async code to get some data
     *                 callback(null, 'data', 'converted to array');
     *             },
     *             make_folder: function(callback) {
     *                 // async code to create a directory to store a file in
     *                 // this is run at the same time as getting the data
     *                 callback(null, 'folder');
     *             },
     *             write_file: ['get_data', 'make_folder', function(results, callback) {
     *                 // once there is some data and the directory exists,
     *                 // write the data to a file in the directory
     *                 callback(null, 'filename');
     *             }],
     *             email_link: ['write_file', function(results, callback) {
     *                 // once the file is written let's email a link to it...
     *                 callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *             }]
     *         });
     *         console.log('results = ', results);
     *         // results = {
     *         //     get_data: ['data', 'converted to array']
     *         //     make_folder; 'folder',
     *         //     write_file: 'filename'
     *         //     email_link: { file: 'filename', email: 'user@example.com' }
     *         // }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function auto(tasks, concurrency, callback) {
        if (typeof concurrency !== 'number') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = once(callback || promiseCallback());
        var numTasks = Object.keys(tasks).length;
        if (!numTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = numTasks;
        }

        var results = {};
        var runningTasks = 0;
        var canceled = false;
        var hasError = false;

        var listeners = Object.create(null);

        var readyTasks = [];

        // for cycle detection:
        var readyToCheck = []; // tasks that have been identified as reachable
        // without the possibility of returning to an ancestor task
        var uncheckedDependencies = {};

        Object.keys(tasks).forEach(key => {
            var task = tasks[key];
            if (!Array.isArray(task)) {
                // no dependencies
                enqueueTask(key, [task]);
                readyToCheck.push(key);
                return;
            }

            var dependencies = task.slice(0, task.length - 1);
            var remainingDependencies = dependencies.length;
            if (remainingDependencies === 0) {
                enqueueTask(key, task);
                readyToCheck.push(key);
                return;
            }
            uncheckedDependencies[key] = remainingDependencies;

            dependencies.forEach(dependencyName => {
                if (!tasks[dependencyName]) {
                    throw new Error('async.auto task `' + key +
                        '` has a non-existent dependency `' +
                        dependencyName + '` in ' +
                        dependencies.join(', '));
                }
                addListener(dependencyName, () => {
                    remainingDependencies--;
                    if (remainingDependencies === 0) {
                        enqueueTask(key, task);
                    }
                });
            });
        });

        checkForDeadlocks();
        processQueue();

        function enqueueTask(key, task) {
            readyTasks.push(() => runTask(key, task));
        }

        function processQueue() {
            if (canceled) return
            if (readyTasks.length === 0 && runningTasks === 0) {
                return callback(null, results);
            }
            while(readyTasks.length && runningTasks < concurrency) {
                var run = readyTasks.shift();
                run();
            }

        }

        function addListener(taskName, fn) {
            var taskListeners = listeners[taskName];
            if (!taskListeners) {
                taskListeners = listeners[taskName] = [];
            }

            taskListeners.push(fn);
        }

        function taskComplete(taskName) {
            var taskListeners = listeners[taskName] || [];
            taskListeners.forEach(fn => fn());
            processQueue();
        }


        function runTask(key, task) {
            if (hasError) return;

            var taskCallback = onlyOnce((err, ...result) => {
                runningTasks--;
                if (err === false) {
                    canceled = true;
                    return
                }
                if (result.length < 2) {
                    [result] = result;
                }
                if (err) {
                    var safeResults = {};
                    Object.keys(results).forEach(rkey => {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[key] = result;
                    hasError = true;
                    listeners = Object.create(null);
                    if (canceled) return
                    callback(err, safeResults);
                } else {
                    results[key] = result;
                    taskComplete(key);
                }
            });

            runningTasks++;
            var taskFn = wrapAsync(task[task.length - 1]);
            if (task.length > 1) {
                taskFn(results, taskCallback);
            } else {
                taskFn(taskCallback);
            }
        }

        function checkForDeadlocks() {
            // Kahn's algorithm
            // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
            // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
            var currentTask;
            var counter = 0;
            while (readyToCheck.length) {
                currentTask = readyToCheck.pop();
                counter++;
                getDependents(currentTask).forEach(dependent => {
                    if (--uncheckedDependencies[dependent] === 0) {
                        readyToCheck.push(dependent);
                    }
                });
            }

            if (counter !== numTasks) {
                throw new Error(
                    'async.auto cannot execute tasks due to a recursive dependency'
                );
            }
        }

        function getDependents(taskName) {
            var result = [];
            Object.keys(tasks).forEach(key => {
                const task = tasks[key];
                if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
                    result.push(key);
                }
            });
            return result;
        }

        return callback[PROMISE_SYMBOL]
    }

    var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
    var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /(=.+)?(\s*)$/;

    function stripComments(string) {
        let stripped = '';
        let index = 0;
        let endBlockComment = string.indexOf('*/');
        while (index < string.length) {
            if (string[index] === '/' && string[index+1] === '/') {
                // inline comment
                let endIndex = string.indexOf('\n', index);
                index = (endIndex === -1) ? string.length : endIndex;
            } else if ((endBlockComment !== -1) && (string[index] === '/') && (string[index+1] === '*')) {
                // block comment
                let endIndex = string.indexOf('*/', index);
                if (endIndex !== -1) {
                    index = endIndex + 2;
                    endBlockComment = string.indexOf('*/', index);
                } else {
                    stripped += string[index];
                    index++;
                }
            } else {
                stripped += string[index];
                index++;
            }
        }
        return stripped;
    }

    function parseParams(func) {
        const src = stripComments(func.toString());
        let match = src.match(FN_ARGS);
        if (!match) {
            match = src.match(ARROW_FN_ARGS);
        }
        if (!match) throw new Error('could not parse args in autoInject\nSource:\n' + src)
        let [, args] = match;
        return args
            .replace(/\s/g, '')
            .split(FN_ARG_SPLIT)
            .map((arg) => arg.replace(FN_ARG, '').trim());
    }

    /**
     * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
     * tasks are specified as parameters to the function, after the usual callback
     * parameter, with the parameter names matching the names of the tasks it
     * depends on. This can provide even more readable task graphs which can be
     * easier to maintain.
     *
     * If a final callback is specified, the task results are similarly injected,
     * specified as named parameters after the initial error parameter.
     *
     * The autoInject function is purely syntactic sugar and its semantics are
     * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
     *
     * @name autoInject
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.auto]{@link module:ControlFlow.auto}
     * @category Control Flow
     * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
     * the form 'func([dependencies...], callback). The object's key of a property
     * serves as the name of the task defined by that property, i.e. can be used
     * when specifying requirements for other tasks.
     * * The `callback` parameter is a `callback(err, result)` which must be called
     *   when finished, passing an `error` (which can be `null`) and the result of
     *   the function's execution. The remaining parameters name other tasks on
     *   which the task is dependent, and the results from those tasks are the
     *   arguments of those parameters.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback, and a `results` object with any completed
     * task results, similar to `auto`.
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * //  The example from `auto` can be rewritten as follows:
     * async.autoInject({
     *     get_data: function(callback) {
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: function(get_data, make_folder, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     },
     *     email_link: function(write_file, callback) {
     *         // once the file is written let's email a link to it...
     *         // write_file contains the filename returned by write_file.
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     *
     * // If you are using a JS minifier that mangles parameter names, `autoInject`
     * // will not work with plain functions, since the parameter names will be
     * // collapsed to a single letter identifier.  To work around this, you can
     * // explicitly specify the names of the parameters your task function needs
     * // in an array, similar to Angular.js dependency injection.
     *
     * // This still has an advantage over plain `auto`, since the results a task
     * // depends on are still spread into arguments.
     * async.autoInject({
     *     //...
     *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(write_file, callback) {
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }]
     *     //...
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     */
    function autoInject(tasks, callback) {
        var newTasks = {};

        Object.keys(tasks).forEach(key => {
            var taskFn = tasks[key];
            var params;
            var fnIsAsync = isAsync(taskFn);
            var hasNoDeps =
                (!fnIsAsync && taskFn.length === 1) ||
                (fnIsAsync && taskFn.length === 0);

            if (Array.isArray(taskFn)) {
                params = [...taskFn];
                taskFn = params.pop();

                newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
            } else if (hasNoDeps) {
                // no dependencies, use the function as-is
                newTasks[key] = taskFn;
            } else {
                params = parseParams(taskFn);
                if ((taskFn.length === 0 && !fnIsAsync) && params.length === 0) {
                    throw new Error("autoInject task functions require explicit parameters.");
                }

                // remove callback param
                if (!fnIsAsync) params.pop();

                newTasks[key] = params.concat(newTask);
            }

            function newTask(results, taskCb) {
                var newArgs = params.map(name => results[name]);
                newArgs.push(taskCb);
                wrapAsync(taskFn)(...newArgs);
            }
        });

        return auto(newTasks, callback);
    }

    // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
    // used for queues. This implementation assumes that the node provided by the user can be modified
    // to adjust the next and last properties. We implement only the minimal functionality
    // for queue support.
    class DLL {
        constructor() {
            this.head = this.tail = null;
            this.length = 0;
        }

        removeLink(node) {
            if (node.prev) node.prev.next = node.next;
            else this.head = node.next;
            if (node.next) node.next.prev = node.prev;
            else this.tail = node.prev;

            node.prev = node.next = null;
            this.length -= 1;
            return node;
        }

        empty () {
            while(this.head) this.shift();
            return this;
        }

        insertAfter(node, newNode) {
            newNode.prev = node;
            newNode.next = node.next;
            if (node.next) node.next.prev = newNode;
            else this.tail = newNode;
            node.next = newNode;
            this.length += 1;
        }

        insertBefore(node, newNode) {
            newNode.prev = node.prev;
            newNode.next = node;
            if (node.prev) node.prev.next = newNode;
            else this.head = newNode;
            node.prev = newNode;
            this.length += 1;
        }

        unshift(node) {
            if (this.head) this.insertBefore(this.head, node);
            else setInitial(this, node);
        }

        push(node) {
            if (this.tail) this.insertAfter(this.tail, node);
            else setInitial(this, node);
        }

        shift() {
            return this.head && this.removeLink(this.head);
        }

        pop() {
            return this.tail && this.removeLink(this.tail);
        }

        toArray() {
            return [...this]
        }

        *[Symbol.iterator] () {
            var cur = this.head;
            while (cur) {
                yield cur.data;
                cur = cur.next;
            }
        }

        remove (testFn) {
            var curr = this.head;
            while(curr) {
                var {next} = curr;
                if (testFn(curr)) {
                    this.removeLink(curr);
                }
                curr = next;
            }
            return this;
        }
    }

    function setInitial(dll, node) {
        dll.length = 1;
        dll.head = dll.tail = node;
    }

    function queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new RangeError('Concurrency must not be zero');
        }

        var _worker = wrapAsync(worker);
        var numRunning = 0;
        var workersList = [];
        const events = {
            error: [],
            drain: [],
            saturated: [],
            unsaturated: [],
            empty: []
        };

        function on (event, handler) {
            events[event].push(handler);
        }

        function once (event, handler) {
            const handleAndRemove = (...args) => {
                off(event, handleAndRemove);
                handler(...args);
            };
            events[event].push(handleAndRemove);
        }

        function off (event, handler) {
            if (!event) return Object.keys(events).forEach(ev => events[ev] = [])
            if (!handler) return events[event] = []
            events[event] = events[event].filter(ev => ev !== handler);
        }

        function trigger (event, ...args) {
            events[event].forEach(handler => handler(...args));
        }

        var processingScheduled = false;
        function _insert(data, insertAtFront, rejectOnError, callback) {
            if (callback != null && typeof callback !== 'function') {
                throw new Error('task callback must be a function');
            }
            q.started = true;

            var res, rej;
            function promiseCallback (err, ...args) {
                // we don't care about the error, let the global error handler
                // deal with it
                if (err) return rejectOnError ? rej(err) : res()
                if (args.length <= 1) return res(args[0])
                res(args);
            }

            var item = q._createTaskItem(
                data,
                rejectOnError ? promiseCallback :
                    (callback || promiseCallback)
            );

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }

            if (!processingScheduled) {
                processingScheduled = true;
                setImmediate$1(() => {
                    processingScheduled = false;
                    q.process();
                });
            }

            if (rejectOnError || !callback) {
                return new Promise((resolve, reject) => {
                    res = resolve;
                    rej = reject;
                })
            }
        }

        function _createCB(tasks) {
            return function (err, ...args) {
                numRunning -= 1;

                for (var i = 0, l = tasks.length; i < l; i++) {
                    var task = tasks[i];

                    var index = workersList.indexOf(task);
                    if (index === 0) {
                        workersList.shift();
                    } else if (index > 0) {
                        workersList.splice(index, 1);
                    }

                    task.callback(err, ...args);

                    if (err != null) {
                        trigger('error', err, task.data);
                    }
                }

                if (numRunning <= (q.concurrency - q.buffer) ) {
                    trigger('unsaturated');
                }

                if (q.idle()) {
                    trigger('drain');
                }
                q.process();
            };
        }

        function _maybeDrain(data) {
            if (data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                setImmediate$1(() => trigger('drain'));
                return true
            }
            return false
        }

        const eventMethod = (name) => (handler) => {
            if (!handler) {
                return new Promise((resolve, reject) => {
                    once(name, (err, data) => {
                        if (err) return reject(err)
                        resolve(data);
                    });
                })
            }
            off(name);
            on(name, handler);

        };

        var isProcessing = false;
        var q = {
            _tasks: new DLL(),
            _createTaskItem (data, callback) {
                return {
                    data,
                    callback
                };
            },
            *[Symbol.iterator] () {
                yield* q._tasks[Symbol.iterator]();
            },
            concurrency,
            payload,
            buffer: concurrency / 4,
            started: false,
            paused: false,
            push (data, callback) {
                if (Array.isArray(data)) {
                    if (_maybeDrain(data)) return
                    return data.map(datum => _insert(datum, false, false, callback))
                }
                return _insert(data, false, false, callback);
            },
            pushAsync (data, callback) {
                if (Array.isArray(data)) {
                    if (_maybeDrain(data)) return
                    return data.map(datum => _insert(datum, false, true, callback))
                }
                return _insert(data, false, true, callback);
            },
            kill () {
                off();
                q._tasks.empty();
            },
            unshift (data, callback) {
                if (Array.isArray(data)) {
                    if (_maybeDrain(data)) return
                    return data.map(datum => _insert(datum, true, false, callback))
                }
                return _insert(data, true, false, callback);
            },
            unshiftAsync (data, callback) {
                if (Array.isArray(data)) {
                    if (_maybeDrain(data)) return
                    return data.map(datum => _insert(datum, true, true, callback))
                }
                return _insert(data, true, true, callback);
            },
            remove (testFn) {
                q._tasks.remove(testFn);
            },
            process () {
                // Avoid trying to start too many processing operations. This can occur
                // when callbacks resolve synchronously (#1267).
                if (isProcessing) {
                    return;
                }
                isProcessing = true;
                while(!q.paused && numRunning < q.concurrency && q._tasks.length){
                    var tasks = [], data = [];
                    var l = q._tasks.length;
                    if (q.payload) l = Math.min(l, q.payload);
                    for (var i = 0; i < l; i++) {
                        var node = q._tasks.shift();
                        tasks.push(node);
                        workersList.push(node);
                        data.push(node.data);
                    }

                    numRunning += 1;

                    if (q._tasks.length === 0) {
                        trigger('empty');
                    }

                    if (numRunning === q.concurrency) {
                        trigger('saturated');
                    }

                    var cb = onlyOnce(_createCB(tasks));
                    _worker(data, cb);
                }
                isProcessing = false;
            },
            length () {
                return q._tasks.length;
            },
            running () {
                return numRunning;
            },
            workersList () {
                return workersList;
            },
            idle() {
                return q._tasks.length + numRunning === 0;
            },
            pause () {
                q.paused = true;
            },
            resume () {
                if (q.paused === false) { return; }
                q.paused = false;
                setImmediate$1(q.process);
            }
        };
        // define these as fixed properties, so people get useful errors when updating
        Object.defineProperties(q, {
            saturated: {
                writable: false,
                value: eventMethod('saturated')
            },
            unsaturated: {
                writable: false,
                value: eventMethod('unsaturated')
            },
            empty: {
                writable: false,
                value: eventMethod('empty')
            },
            drain: {
                writable: false,
                value: eventMethod('drain')
            },
            error: {
                writable: false,
                value: eventMethod('error')
            },
        });
        return q;
    }

    /**
     * Creates a `cargo` object with the specified payload. Tasks added to the
     * cargo will be processed altogether (up to the `payload` limit). If the
     * `worker` is in progress, the task is queued until it becomes available. Once
     * the `worker` has completed some tasks, each callback of those tasks is
     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
     * for how `cargo` and `queue` work.
     *
     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
     * at a time, cargo passes an array of tasks to a single worker, repeating
     * when the worker is finished.
     *
     * @name cargo
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {AsyncFunction} worker - An asynchronous function for processing an array
     * of queued tasks. Invoked with `(tasks, callback)`.
     * @param {number} [payload=Infinity] - An optional `integer` for determining
     * how many tasks should be processed per round; if omitted, the default is
     * unlimited.
     * @returns {module:ControlFlow.QueueObject} A cargo object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the cargo and inner queue.
     * @example
     *
     * // create a cargo object with payload 2
     * var cargo = async.cargo(function(tasks, callback) {
     *     for (var i=0; i<tasks.length; i++) {
     *         console.log('hello ' + tasks[i].name);
     *     }
     *     callback();
     * }, 2);
     *
     * // add some items
     * cargo.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * cargo.push({name: 'bar'}, function(err) {
     *     console.log('finished processing bar');
     * });
     * await cargo.push({name: 'baz'});
     * console.log('finished processing baz');
     */
    function cargo(worker, payload) {
        return queue(worker, 1, payload);
    }

    /**
     * Creates a `cargoQueue` object with the specified payload. Tasks added to the
     * cargoQueue will be processed together (up to the `payload` limit) in `concurrency` parallel workers.
     * If the all `workers` are in progress, the task is queued until one becomes available. Once
     * a `worker` has completed some tasks, each callback of those tasks is
     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
     * for how `cargo` and `queue` work.
     *
     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
     * at a time, and [`cargo`]{@link module:ControlFlow.cargo} passes an array of tasks to a single worker,
     * the cargoQueue passes an array of tasks to multiple parallel workers.
     *
     * @name cargoQueue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @see [async.cargo]{@link module:ControlFLow.cargo}
     * @category Control Flow
     * @param {AsyncFunction} worker - An asynchronous function for processing an array
     * of queued tasks. Invoked with `(tasks, callback)`.
     * @param {number} [concurrency=1] - An `integer` for determining how many
     * `worker` functions should be run in parallel.  If omitted, the concurrency
     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
     * @param {number} [payload=Infinity] - An optional `integer` for determining
     * how many tasks should be processed per round; if omitted, the default is
     * unlimited.
     * @returns {module:ControlFlow.QueueObject} A cargoQueue object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the cargoQueue and inner queue.
     * @example
     *
     * // create a cargoQueue object with payload 2 and concurrency 2
     * var cargoQueue = async.cargoQueue(function(tasks, callback) {
     *     for (var i=0; i<tasks.length; i++) {
     *         console.log('hello ' + tasks[i].name);
     *     }
     *     callback();
     * }, 2, 2);
     *
     * // add some items
     * cargoQueue.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * cargoQueue.push({name: 'bar'}, function(err) {
     *     console.log('finished processing bar');
     * });
     * cargoQueue.push({name: 'baz'}, function(err) {
     *     console.log('finished processing baz');
     * });
     * cargoQueue.push({name: 'boo'}, function(err) {
     *     console.log('finished processing boo');
     * });
     */
    function cargo$1(worker, concurrency, payload) {
        return queue(worker, concurrency, payload);
    }

    /**
     * Reduces `coll` into a single value using an async `iteratee` to return each
     * successive step. `memo` is the initial state of the reduction. This function
     * only operates in series.
     *
     * For performance reasons, it may make sense to split a call to this function
     * into a parallel map, and then use the normal `Array.prototype.reduce` on the
     * results. This function is for situations where each step in the reduction
     * needs to be async; if you can get the data before reducing it, then it's
     * probably a good idea to do so.
     *
     * @name reduce
     * @static
     * @memberOf module:Collections
     * @method
     * @alias inject
     * @alias foldl
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction.
     * The `iteratee` should complete with the next state of the reduction.
     * If the iteratee completes with an error, the reduction is stopped and the
     * main `callback` is immediately called with the error.
     * Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file3.txt', 'file4.txt'];
     *
     * // asynchronous function that computes the file size in bytes
     * // file size is added to the memoized value, then returned
     * function getFileSizeInBytes(memo, file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, memo + stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.reduce(fileList, 0, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // 6000
     *         // which is the sum of the file sizes of the three files
     *     }
     * });
     *
     * // Error Handling
     * async.reduce(withMissingFileList, 0, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(result);
     *     }
     * });
     *
     * // Using Promises
     * async.reduce(fileList, 0, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     *     // 6000
     *     // which is the sum of the file sizes of the three files
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.reduce(withMissingFileList, 0, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.reduce(fileList, 0, getFileSizeInBytes);
     *         console.log(result);
     *         // 6000
     *         // which is the sum of the file sizes of the three files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let result = await async.reduce(withMissingFileList, 0, getFileSizeInBytes);
     *         console.log(result);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */
    function reduce(coll, memo, iteratee, callback) {
        callback = once(callback);
        var _iteratee = wrapAsync(iteratee);
        return eachOfSeries$1(coll, (x, i, iterCb) => {
            _iteratee(memo, x, (err, v) => {
                memo = v;
                iterCb(err);
            });
        }, err => callback(err, memo));
    }
    var reduce$1 = awaitify(reduce, 4);

    /**
     * Version of the compose function that is more natural to read. Each function
     * consumes the return value of the previous function. It is the equivalent of
     * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name seq
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.compose]{@link module:ControlFlow.compose}
     * @category Control Flow
     * @param {...AsyncFunction} functions - the asynchronous functions to compose
     * @returns {Function} a function that composes the `functions` in order
     * @example
     *
     * // Requires lodash (or underscore), express3 and dresende's orm2.
     * // Part of an app, that fetches cats of the logged user.
     * // This example uses `seq` function to avoid overnesting and error
     * // handling clutter.
     * app.get('/cats', function(request, response) {
     *     var User = request.models.User;
     *     async.seq(
     *         User.get.bind(User),  // 'User.get' has signature (id, callback(err, data))
     *         function(user, fn) {
     *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
     *         }
     *     )(req.session.user_id, function (err, cats) {
     *         if (err) {
     *             console.error(err);
     *             response.json({ status: 'error', message: err.message });
     *         } else {
     *             response.json({ status: 'ok', message: 'Cats found', data: cats });
     *         }
     *     });
     * });
     */
    function seq(...functions) {
        var _functions = functions.map(wrapAsync);
        return function (...args) {
            var that = this;

            var cb = args[args.length - 1];
            if (typeof cb == 'function') {
                args.pop();
            } else {
                cb = promiseCallback();
            }

            reduce$1(_functions, args, (newargs, fn, iterCb) => {
                fn.apply(that, newargs.concat((err, ...nextargs) => {
                    iterCb(err, nextargs);
                }));
            },
            (err, results) => cb(err, ...results));

            return cb[PROMISE_SYMBOL]
        };
    }

    /**
     * Creates a function which is a composition of the passed asynchronous
     * functions. Each function consumes the return value of the function that
     * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
     * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
     *
     * If the last argument to the composed function is not a function, a promise
     * is returned when you call it.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name compose
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {...AsyncFunction} functions - the asynchronous functions to compose
     * @returns {Function} an asynchronous function that is the composed
     * asynchronous `functions`
     * @example
     *
     * function add1(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n + 1);
     *     }, 10);
     * }
     *
     * function mul3(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n * 3);
     *     }, 10);
     * }
     *
     * var add1mul3 = async.compose(mul3, add1);
     * add1mul3(4, function (err, result) {
     *     // result now equals 15
     * });
     */
    function compose(...args) {
        return seq(...args.reverse());
    }

    /**
     * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
     *
     * @name mapLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */
    function mapLimit (coll, limit, iteratee, callback) {
        return _asyncMap(eachOfLimit(limit), coll, iteratee, callback)
    }
    var mapLimit$1 = awaitify(mapLimit, 4);

    /**
     * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
     *
     * @name concatLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.concat]{@link module:Collections.concat}
     * @category Collection
     * @alias flatMapLimit
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
     * which should use an array as its result. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     */
    function concatLimit(coll, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(coll, limit, (val, iterCb) => {
            _iteratee(val, (err, ...args) => {
                if (err) return iterCb(err);
                return iterCb(err, args);
            });
        }, (err, mapResults) => {
            var result = [];
            for (var i = 0; i < mapResults.length; i++) {
                if (mapResults[i]) {
                    result = result.concat(...mapResults[i]);
                }
            }

            return callback(err, result);
        });
    }
    var concatLimit$1 = awaitify(concatLimit, 4);

    /**
     * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
     * the concatenated list. The `iteratee`s are called in parallel, and the
     * results are concatenated as they return. The results array will be returned in
     * the original order of `coll` passed to the `iteratee` function.
     *
     * @name concat
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @alias flatMap
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
     * which should use an array as its result. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * let directoryList = ['dir1','dir2','dir3'];
     * let withMissingDirectoryList = ['dir1','dir2','dir3', 'dir4'];
     *
     * // Using callbacks
     * async.concat(directoryList, fs.readdir, function(err, results) {
     *    if (err) {
     *        console.log(err);
     *    } else {
     *        console.log(results);
     *        // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     *    }
     * });
     *
     * // Error Handling
     * async.concat(withMissingDirectoryList, fs.readdir, function(err, results) {
     *    if (err) {
     *        console.log(err);
     *        // [ Error: ENOENT: no such file or directory ]
     *        // since dir4 does not exist
     *    } else {
     *        console.log(results);
     *    }
     * });
     *
     * // Using Promises
     * async.concat(directoryList, fs.readdir)
     * .then(results => {
     *     console.log(results);
     *     // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     * }).catch(err => {
     *      console.log(err);
     * });
     *
     * // Error Handling
     * async.concat(withMissingDirectoryList, fs.readdir)
     * .then(results => {
     *     console.log(results);
     * }).catch(err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4 does not exist
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.concat(directoryList, fs.readdir);
     *         console.log(results);
     *         // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     *     } catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let results = await async.concat(withMissingDirectoryList, fs.readdir);
     *         console.log(results);
     *     } catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *         // since dir4 does not exist
     *     }
     * }
     *
     */
    function concat(coll, iteratee, callback) {
        return concatLimit$1(coll, Infinity, iteratee, callback)
    }
    var concat$1 = awaitify(concat, 3);

    /**
     * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
     *
     * @name concatSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.concat]{@link module:Collections.concat}
     * @category Collection
     * @alias flatMapSeries
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
     * The iteratee should complete with an array an array of results.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     */
    function concatSeries(coll, iteratee, callback) {
        return concatLimit$1(coll, 1, iteratee, callback)
    }
    var concatSeries$1 = awaitify(concatSeries, 3);

    /**
     * Returns a function that when called, calls-back with the values provided.
     * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
     * [`auto`]{@link module:ControlFlow.auto}.
     *
     * @name constant
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {...*} arguments... - Any number of arguments to automatically invoke
     * callback with.
     * @returns {AsyncFunction} Returns a function that when invoked, automatically
     * invokes the callback with the previous given arguments.
     * @example
     *
     * async.waterfall([
     *     async.constant(42),
     *     function (value, next) {
     *         // value === 42
     *     },
     *     //...
     * ], callback);
     *
     * async.waterfall([
     *     async.constant(filename, "utf8"),
     *     fs.readFile,
     *     function (fileData, next) {
     *         //...
     *     }
     *     //...
     * ], callback);
     *
     * async.auto({
     *     hostname: async.constant("https://server.net/"),
     *     port: findFreePort,
     *     launchServer: ["hostname", "port", function (options, cb) {
     *         startServer(options, cb);
     *     }],
     *     //...
     * }, callback);
     */
    function constant(...args) {
        return function (...ignoredArgs/*, callback*/) {
            var callback = ignoredArgs.pop();
            return callback(null, ...args);
        };
    }

    function _createTester(check, getResult) {
        return (eachfn, arr, _iteratee, cb) => {
            var testPassed = false;
            var testResult;
            const iteratee = wrapAsync(_iteratee);
            eachfn(arr, (value, _, callback) => {
                iteratee(value, (err, result) => {
                    if (err || err === false) return callback(err);

                    if (check(result) && !testResult) {
                        testPassed = true;
                        testResult = getResult(true, value);
                        return callback(null, breakLoop);
                    }
                    callback();
                });
            }, err => {
                if (err) return cb(err);
                cb(null, testPassed ? testResult : getResult(false));
            });
        };
    }

    /**
     * Returns the first value in `coll` that passes an async truth test. The
     * `iteratee` is applied in parallel, meaning the first iteratee to return
     * `true` will fire the detect `callback` with that result. That means the
     * result might not be the first item in the original `coll` (in terms of order)
     * that passes the test.

     * If order within the original `coll` is important, then look at
     * [`detectSeries`]{@link module:Collections.detectSeries}.
     *
     * @name detect
     * @static
     * @memberOf module:Collections
     * @method
     * @alias find
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // dir1/file1.txt
     *        // result now equals the first file in the list that exists
     *    }
     *);
     *
     * // Using Promises
     * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists)
     * .then(result => {
     *     console.log(result);
     *     // dir1/file1.txt
     *     // result now equals the first file in the list that exists
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists);
     *         console.log(result);
     *         // dir1/file1.txt
     *         // result now equals the file in the list that exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function detect(coll, iteratee, callback) {
        return _createTester(bool => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback)
    }
    var detect$1 = awaitify(detect, 3);

    /**
     * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name detectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findLimit
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function detectLimit(coll, limit, iteratee, callback) {
        return _createTester(bool => bool, (res, item) => item)(eachOfLimit(limit), coll, iteratee, callback)
    }
    var detectLimit$1 = awaitify(detectLimit, 4);

    /**
     * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
     *
     * @name detectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findSeries
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function detectSeries(coll, iteratee, callback) {
        return _createTester(bool => bool, (res, item) => item)(eachOfLimit(1), coll, iteratee, callback)
    }

    var detectSeries$1 = awaitify(detectSeries, 3);

    function consoleFunc(name) {
        return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
            /* istanbul ignore else */
            if (typeof console === 'object') {
                /* istanbul ignore else */
                if (err) {
                    /* istanbul ignore else */
                    if (console.error) {
                        console.error(err);
                    }
                } else if (console[name]) { /* istanbul ignore else */
                    resultArgs.forEach(x => console[name](x));
                }
            }
        })
    }

    /**
     * Logs the result of an [`async` function]{@link AsyncFunction} to the
     * `console` using `console.dir` to display the properties of the resulting object.
     * Only works in Node.js or in browsers that support `console.dir` and
     * `console.error` (such as FF and Chrome).
     * If multiple arguments are returned from the async function,
     * `console.dir` is called on each argument in order.
     *
     * @name dir
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} function - The function you want to eventually apply
     * all arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, {hello: name});
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.dir(hello, 'world');
     * {hello: 'world'}
     */
    var dir = consoleFunc('dir');

    /**
     * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
     * the order of operations, the arguments `test` and `iteratee` are switched.
     *
     * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
     *
     * @name doWhilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {AsyncFunction} iteratee - A function which is called each time `test`
     * passes. Invoked with (callback).
     * @param {AsyncFunction} test - asynchronous truth test to perform after each
     * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
     * non-error args from the previous callback of `iteratee`.
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped.
     * `callback` will be passed an error and any arguments passed to the final
     * `iteratee`'s callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     */
    function doWhilst(iteratee, test, callback) {
        callback = onlyOnce(callback);
        var _fn = wrapAsync(iteratee);
        var _test = wrapAsync(test);
        var results;

        function next(err, ...args) {
            if (err) return callback(err);
            if (err === false) return;
            results = args;
            _test(...args, check);
        }

        function check(err, truth) {
            if (err) return callback(err);
            if (err === false) return;
            if (!truth) return callback(null, ...results);
            _fn(next);
        }

        return check(null, true);
    }

    var doWhilst$1 = awaitify(doWhilst, 3);

    /**
     * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
     * argument ordering differs from `until`.
     *
     * @name doUntil
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
     * @category Control Flow
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` fails. Invoked with (callback).
     * @param {AsyncFunction} test - asynchronous truth test to perform after each
     * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
     * non-error args from the previous callback of `iteratee`
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     */
    function doUntil(iteratee, test, callback) {
        const _test = wrapAsync(test);
        return doWhilst$1(iteratee, (...args) => {
            const cb = args.pop();
            _test(...args, (err, truth) => cb (err, !truth));
        }, callback);
    }

    function _withoutIndex(iteratee) {
        return (value, index, callback) => iteratee(value, callback);
    }

    /**
     * Applies the function `iteratee` to each item in `coll`, in parallel.
     * The `iteratee` is called with an item from the list, and a callback for when
     * it has finished. If the `iteratee` passes an error to its `callback`, the
     * main `callback` (for the `each` function) is immediately called with the
     * error.
     *
     * Note, that since this function applies `iteratee` to each item in parallel,
     * there is no guarantee that the iteratee functions will complete in order.
     *
     * @name each
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEach
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to
     * each item in `coll`. Invoked with (item, callback).
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOf`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const fileList = [ 'dir1/file2.txt', 'dir2/file3.txt', 'dir/file5.txt'];
     * const withMissingFileList = ['dir1/file1.txt', 'dir4/file2.txt'];
     *
     * // asynchronous function that deletes a file
     * const deleteFile = function(file, callback) {
     *     fs.unlink(file, callback);
     * };
     *
     * // Using callbacks
     * async.each(fileList, deleteFile, function(err) {
     *     if( err ) {
     *         console.log(err);
     *     } else {
     *         console.log('All files have been deleted successfully');
     *     }
     * });
     *
     * // Error Handling
     * async.each(withMissingFileList, deleteFile, function(err){
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using Promises
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         await async.each(files, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         await async.each(withMissingFileList, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *         // since dir4/file2.txt does not exist
     *         // dir1/file1.txt could have been deleted
     *     }
     * }
     *
     */
    function eachLimit(coll, iteratee, callback) {
        return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
    }

    var each = awaitify(eachLimit, 3);

    /**
     * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
     *
     * @name eachLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOfLimit`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachLimit$1(coll, limit, iteratee, callback) {
        return eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
    }
    var eachLimit$2 = awaitify(eachLimit$1, 4);

    /**
     * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
     *
     * Note, that unlike [`each`]{@link module:Collections.each}, this function applies iteratee to each item
     * in series and therefore the iteratee functions will complete in order.

     * @name eachSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each
     * item in `coll`.
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOfSeries`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachSeries(coll, iteratee, callback) {
        return eachLimit$2(coll, 1, iteratee, callback)
    }
    var eachSeries$1 = awaitify(eachSeries, 3);

    /**
     * Wrap an async function and ensure it calls its callback on a later tick of
     * the event loop.  If the function already calls its callback on a next tick,
     * no extra deferral is added. This is useful for preventing stack overflows
     * (`RangeError: Maximum call stack size exceeded`) and generally keeping
     * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
     * contained. ES2017 `async` functions are returned as-is -- they are immune
     * to Zalgo's corrupting influences, as they always resolve on a later tick.
     *
     * @name ensureAsync
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - an async function, one that expects a node-style
     * callback as its last argument.
     * @returns {AsyncFunction} Returns a wrapped function with the exact same call
     * signature as the function passed in.
     * @example
     *
     * function sometimesAsync(arg, callback) {
     *     if (cache[arg]) {
     *         return callback(null, cache[arg]); // this would be synchronous!!
     *     } else {
     *         doSomeIO(arg, callback); // this IO would be asynchronous
     *     }
     * }
     *
     * // this has a risk of stack overflows if many results are cached in a row
     * async.mapSeries(args, sometimesAsync, done);
     *
     * // this will defer sometimesAsync's callback if necessary,
     * // preventing stack overflows
     * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
     */
    function ensureAsync(fn) {
        if (isAsync(fn)) return fn;
        return function (...args/*, callback*/) {
            var callback = args.pop();
            var sync = true;
            args.push((...innerArgs) => {
                if (sync) {
                    setImmediate$1(() => callback(...innerArgs));
                } else {
                    callback(...innerArgs);
                }
            });
            fn.apply(this, args);
            sync = false;
        };
    }

    /**
     * Returns `true` if every element in `coll` satisfies an async test. If any
     * iteratee call returns `false`, the main `callback` is immediately called.
     *
     * @name every
     * @static
     * @memberOf module:Collections
     * @method
     * @alias all
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in parallel.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file5.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.every(fileList, fileExists, function(err, result) {
     *     console.log(result);
     *     // true
     *     // result is true since every file exists
     * });
     *
     * async.every(withMissingFileList, fileExists, function(err, result) {
     *     console.log(result);
     *     // false
     *     // result is false since NOT every file exists
     * });
     *
     * // Using Promises
     * async.every(fileList, fileExists)
     * .then( result => {
     *     console.log(result);
     *     // true
     *     // result is true since every file exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * async.every(withMissingFileList, fileExists)
     * .then( result => {
     *     console.log(result);
     *     // false
     *     // result is false since NOT every file exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.every(fileList, fileExists);
     *         console.log(result);
     *         // true
     *         // result is true since every file exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * async () => {
     *     try {
     *         let result = await async.every(withMissingFileList, fileExists);
     *         console.log(result);
     *         // false
     *         // result is false since NOT every file exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function every(coll, iteratee, callback) {
        return _createTester(bool => !bool, res => !res)(eachOf$1, coll, iteratee, callback)
    }
    var every$1 = awaitify(every, 3);

    /**
     * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
     *
     * @name everyLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in parallel.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */
    function everyLimit(coll, limit, iteratee, callback) {
        return _createTester(bool => !bool, res => !res)(eachOfLimit(limit), coll, iteratee, callback)
    }
    var everyLimit$1 = awaitify(everyLimit, 4);

    /**
     * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
     *
     * @name everySeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in series.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */
    function everySeries(coll, iteratee, callback) {
        return _createTester(bool => !bool, res => !res)(eachOfSeries$1, coll, iteratee, callback)
    }
    var everySeries$1 = awaitify(everySeries, 3);

    function filterArray(eachfn, arr, iteratee, callback) {
        var truthValues = new Array(arr.length);
        eachfn(arr, (x, index, iterCb) => {
            iteratee(x, (err, v) => {
                truthValues[index] = !!v;
                iterCb(err);
            });
        }, err => {
            if (err) return callback(err);
            var results = [];
            for (var i = 0; i < arr.length; i++) {
                if (truthValues[i]) results.push(arr[i]);
            }
            callback(null, results);
        });
    }

    function filterGeneric(eachfn, coll, iteratee, callback) {
        var results = [];
        eachfn(coll, (x, index, iterCb) => {
            iteratee(x, (err, v) => {
                if (err) return iterCb(err);
                if (v) {
                    results.push({index, value: x});
                }
                iterCb(err);
            });
        }, err => {
            if (err) return callback(err);
            callback(null, results
                .sort((a, b) => a.index - b.index)
                .map(v => v.value));
        });
    }

    function _filter(eachfn, coll, iteratee, callback) {
        var filter = isArrayLike(coll) ? filterArray : filterGeneric;
        return filter(eachfn, coll, wrapAsync(iteratee), callback);
    }

    /**
     * Returns a new array of all the values in `coll` which pass an async truth
     * test. This operation is performed in parallel, but the results array will be
     * in the same order as the original.
     *
     * @name filter
     * @static
     * @memberOf module:Collections
     * @method
     * @alias select
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * const files = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.filter(files, fileExists, function(err, results) {
     *    if(err) {
     *        console.log(err);
     *    } else {
     *        console.log(results);
     *        // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *        // results is now an array of the existing files
     *    }
     * });
     *
     * // Using Promises
     * async.filter(files, fileExists)
     * .then(results => {
     *     console.log(results);
     *     // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *     // results is now an array of the existing files
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.filter(files, fileExists);
     *         console.log(results);
     *         // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *         // results is now an array of the existing files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function filter (coll, iteratee, callback) {
        return _filter(eachOf$1, coll, iteratee, callback)
    }
    var filter$1 = awaitify(filter, 3);

    /**
     * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name filterLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback provided
     */
    function filterLimit (coll, limit, iteratee, callback) {
        return _filter(eachOfLimit(limit), coll, iteratee, callback)
    }
    var filterLimit$1 = awaitify(filterLimit, 4);

    /**
     * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
     *
     * @name filterSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results)
     * @returns {Promise} a promise, if no callback provided
     */
    function filterSeries (coll, iteratee, callback) {
        return _filter(eachOfSeries$1, coll, iteratee, callback)
    }
    var filterSeries$1 = awaitify(filterSeries, 3);

    /**
     * Calls the asynchronous function `fn` with a callback parameter that allows it
     * to call itself again, in series, indefinitely.

     * If an error is passed to the callback then `errback` is called with the
     * error, and execution stops, otherwise it will never be called.
     *
     * @name forever
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} fn - an async function to call repeatedly.
     * Invoked with (next).
     * @param {Function} [errback] - when `fn` passes an error to it's callback,
     * this function will be called, and execution stops. Invoked with (err).
     * @returns {Promise} a promise that rejects if an error occurs and an errback
     * is not passed
     * @example
     *
     * async.forever(
     *     function(next) {
     *         // next is suitable for passing to things that need a callback(err [, whatever]);
     *         // it will result in this function being called again.
     *     },
     *     function(err) {
     *         // if next is called with a value in its first parameter, it will appear
     *         // in here as 'err', and execution will stop.
     *     }
     * );
     */
    function forever(fn, errback) {
        var done = onlyOnce(errback);
        var task = wrapAsync(ensureAsync(fn));

        function next(err) {
            if (err) return done(err);
            if (err === false) return;
            task(next);
        }
        return next();
    }
    var forever$1 = awaitify(forever, 2);

    /**
     * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
     *
     * @name groupByLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.groupBy]{@link module:Collections.groupBy}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whoses
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     */
    function groupByLimit(coll, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(coll, limit, (val, iterCb) => {
            _iteratee(val, (err, key) => {
                if (err) return iterCb(err);
                return iterCb(err, {key, val});
            });
        }, (err, mapResults) => {
            var result = {};
            // from MDN, handle object having an `hasOwnProperty` prop
            var {hasOwnProperty} = Object.prototype;

            for (var i = 0; i < mapResults.length; i++) {
                if (mapResults[i]) {
                    var {key} = mapResults[i];
                    var {val} = mapResults[i];

                    if (hasOwnProperty.call(result, key)) {
                        result[key].push(val);
                    } else {
                        result[key] = [val];
                    }
                }
            }

            return callback(err, result);
        });
    }

    var groupByLimit$1 = awaitify(groupByLimit, 4);

    /**
     * Returns a new object, where each value corresponds to an array of items, from
     * `coll`, that returned the corresponding key. That is, the keys of the object
     * correspond to the values passed to the `iteratee` callback.
     *
     * Note: Since this function applies the `iteratee` to each item in parallel,
     * there is no guarantee that the `iteratee` functions will complete in order.
     * However, the values for each key in the `result` will be in the same order as
     * the original `coll`. For Objects, the values will roughly be in the order of
     * the original Objects' keys (but this can vary across JavaScript engines).
     *
     * @name groupBy
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whoses
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const files = ['dir1/file1.txt','dir2','dir4']
     *
     * // asynchronous function that detects file type as none, file, or directory
     * function detectFile(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(null, 'none');
     *         }
     *         callback(null, stat.isDirectory() ? 'directory' : 'file');
     *     });
     * }
     *
     * //Using callbacks
     * async.groupBy(files, detectFile, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *	       console.log(result);
     *         // {
     *         //     file: [ 'dir1/file1.txt' ],
     *         //     none: [ 'dir4' ],
     *         //     directory: [ 'dir2']
     *         // }
     *         // result is object containing the files grouped by type
     *     }
     * });
     *
     * // Using Promises
     * async.groupBy(files, detectFile)
     * .then( result => {
     *     console.log(result);
     *     // {
     *     //     file: [ 'dir1/file1.txt' ],
     *     //     none: [ 'dir4' ],
     *     //     directory: [ 'dir2']
     *     // }
     *     // result is object containing the files grouped by type
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.groupBy(files, detectFile);
     *         console.log(result);
     *         // {
     *         //     file: [ 'dir1/file1.txt' ],
     *         //     none: [ 'dir4' ],
     *         //     directory: [ 'dir2']
     *         // }
     *         // result is object containing the files grouped by type
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function groupBy (coll, iteratee, callback) {
        return groupByLimit$1(coll, Infinity, iteratee, callback)
    }

    /**
     * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
     *
     * @name groupBySeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.groupBy]{@link module:Collections.groupBy}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whose
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     */
    function groupBySeries (coll, iteratee, callback) {
        return groupByLimit$1(coll, 1, iteratee, callback)
    }

    /**
     * Logs the result of an `async` function to the `console`. Only works in
     * Node.js or in browsers that support `console.log` and `console.error` (such
     * as FF and Chrome). If multiple arguments are returned from the async
     * function, `console.log` is called on each argument in order.
     *
     * @name log
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} function - The function you want to eventually apply
     * all arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, 'hello ' + name);
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.log(hello, 'world');
     * 'hello world'
     */
    var log = consoleFunc('log');

    /**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name mapValuesLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */
    function mapValuesLimit(obj, limit, iteratee, callback) {
        callback = once(callback);
        var newObj = {};
        var _iteratee = wrapAsync(iteratee);
        return eachOfLimit(limit)(obj, (val, key, next) => {
            _iteratee(val, key, (err, result) => {
                if (err) return next(err);
                newObj[key] = result;
                next(err);
            });
        }, err => callback(err, newObj));
    }

    var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);

    /**
     * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
     *
     * Produces a new Object by mapping each value of `obj` through the `iteratee`
     * function. The `iteratee` is called each `value` and `key` from `obj` and a
     * callback for when it has finished processing. Each of these callbacks takes
     * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
     * passes an error to its callback, the main `callback` (for the `mapValues`
     * function) is immediately called with the error.
     *
     * Note, the order of the keys in the result is not guaranteed.  The keys will
     * be roughly in the order they complete, (but this is very engine-specific)
     *
     * @name mapValues
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileMap = {
     *     f1: 'file1.txt',
     *     f2: 'file2.txt',
     *     f3: 'file3.txt'
     * };
     *
     * const withMissingFileMap = {
     *     f1: 'file1.txt',
     *     f2: 'file2.txt',
     *     f3: 'file4.txt'
     * };
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, key, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.mapValues(fileMap, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // result is now a map of file size in bytes for each file, e.g.
     *         // {
     *         //     f1: 1000,
     *         //     f2: 2000,
     *         //     f3: 3000
     *         // }
     *     }
     * });
     *
     * // Error handling
     * async.mapValues(withMissingFileMap, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(result);
     *     }
     * });
     *
     * // Using Promises
     * async.mapValues(fileMap, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     *     // result is now a map of file size in bytes for each file, e.g.
     *     // {
     *     //     f1: 1000,
     *     //     f2: 2000,
     *     //     f3: 3000
     *     // }
     * }).catch (err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.mapValues(withMissingFileMap, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     * }).catch (err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.mapValues(fileMap, getFileSizeInBytes);
     *         console.log(result);
     *         // result is now a map of file size in bytes for each file, e.g.
     *         // {
     *         //     f1: 1000,
     *         //     f2: 2000,
     *         //     f3: 3000
     *         // }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let result = await async.mapValues(withMissingFileMap, getFileSizeInBytes);
     *         console.log(result);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */
    function mapValues(obj, iteratee, callback) {
        return mapValuesLimit$1(obj, Infinity, iteratee, callback)
    }

    /**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
     *
     * @name mapValuesSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */
    function mapValuesSeries(obj, iteratee, callback) {
        return mapValuesLimit$1(obj, 1, iteratee, callback)
    }

    /**
     * Caches the results of an async function. When creating a hash to store
     * function results against, the callback is omitted from the hash and an
     * optional hash function can be used.
     *
     * **Note: if the async function errs, the result will not be cached and
     * subsequent calls will call the wrapped function.**
     *
     * If no hash function is specified, the first argument is used as a hash key,
     * which may work reasonably if it is a string or a data type that converts to a
     * distinct string. Note that objects and arrays will not behave reasonably.
     * Neither will cases where the other arguments are significant. In such cases,
     * specify your own hash function.
     *
     * The cache of results is exposed as the `memo` property of the function
     * returned by `memoize`.
     *
     * @name memoize
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - The async function to proxy and cache results from.
     * @param {Function} hasher - An optional function for generating a custom hash
     * for storing results. It has all the arguments applied to it apart from the
     * callback, and must be synchronous.
     * @returns {AsyncFunction} a memoized version of `fn`
     * @example
     *
     * var slow_fn = function(name, callback) {
     *     // do something
     *     callback(null, result);
     * };
     * var fn = async.memoize(slow_fn);
     *
     * // fn can now be used as if it were slow_fn
     * fn('some name', function() {
     *     // callback
     * });
     */
    function memoize(fn, hasher = v => v) {
        var memo = Object.create(null);
        var queues = Object.create(null);
        var _fn = wrapAsync(fn);
        var memoized = initialParams((args, callback) => {
            var key = hasher(...args);
            if (key in memo) {
                setImmediate$1(() => callback(null, ...memo[key]));
            } else if (key in queues) {
                queues[key].push(callback);
            } else {
                queues[key] = [callback];
                _fn(...args, (err, ...resultArgs) => {
                    // #1465 don't memoize if an error occurred
                    if (!err) {
                        memo[key] = resultArgs;
                    }
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i](err, ...resultArgs);
                    }
                });
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    }

    /* istanbul ignore file */

    /**
     * Calls `callback` on a later loop around the event loop. In Node.js this just
     * calls `process.nextTick`.  In the browser it will use `setImmediate` if
     * available, otherwise `setTimeout(callback, 0)`, which means other higher
     * priority events may precede the execution of `callback`.
     *
     * This is used internally for browser-compatibility purposes.
     *
     * @name nextTick
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.setImmediate]{@link module:Utils.setImmediate}
     * @category Util
     * @param {Function} callback - The function to call on a later loop around
     * the event loop. Invoked with (args...).
     * @param {...*} args... - any number of additional arguments to pass to the
     * callback on the next tick.
     * @example
     *
     * var call_order = [];
     * async.nextTick(function() {
     *     call_order.push('two');
     *     // call_order now equals ['one','two']
     * });
     * call_order.push('one');
     *
     * async.setImmediate(function (a, b, c) {
     *     // a, b, and c equal 1, 2, and 3
     * }, 1, 2, 3);
     */
    var _defer$1;

    if (hasNextTick) {
        _defer$1 = process.nextTick;
    } else if (hasSetImmediate) {
        _defer$1 = setImmediate;
    } else {
        _defer$1 = fallback;
    }

    var nextTick = wrap(_defer$1);

    var parallel = awaitify((eachfn, tasks, callback) => {
        var results = isArrayLike(tasks) ? [] : {};

        eachfn(tasks, (task, key, taskCb) => {
            wrapAsync(task)((err, ...result) => {
                if (result.length < 2) {
                    [result] = result;
                }
                results[key] = result;
                taskCb(err);
            });
        }, err => callback(err, results));
    }, 3);

    /**
     * Run the `tasks` collection of functions in parallel, without waiting until
     * the previous function has completed. If any of the functions pass an error to
     * its callback, the main `callback` is immediately called with the value of the
     * error. Once the `tasks` have completed, the results are passed to the final
     * `callback` as an array.
     *
     * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
     * parallel execution of code.  If your tasks do not use any timers or perform
     * any I/O, they will actually be executed in series.  Any synchronous setup
     * sections for each task will happen one after the other.  JavaScript remains
     * single-threaded.
     *
     * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
     * execution of other tasks when a task fails.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     * results from {@link async.parallel}.
     *
     * @name parallel
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
     * [async functions]{@link AsyncFunction} to run.
     * Each async function can complete with any number of optional `result` values.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     *
     * @example
     *
     * //Using Callbacks
     * async.parallel([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ], function(err, results) {
     *     console.log(results);
     *     // results is equal to ['one','two'] even though
     *     // the second function had a shorter timeout.
     * });
     *
     * // an example using an object instead of an array
     * async.parallel({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * });
     *
     * //Using Promises
     * async.parallel([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ]).then(results => {
     *     console.log(results);
     *     // results is equal to ['one','two'] even though
     *     // the second function had a shorter timeout.
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // an example using an object instead of an array
     * async.parallel({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }).then(results => {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.parallel([
     *             function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 'one');
     *                 }, 200);
     *             },
     *             function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 'two');
     *                 }, 100);
     *             }
     *         ]);
     *         console.log(results);
     *         // results is equal to ['one','two'] even though
     *         // the second function had a shorter timeout.
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // an example using an object instead of an array
     * async () => {
     *     try {
     *         let results = await async.parallel({
     *             one: function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 1);
     *                 }, 200);
     *             },
     *            two: function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 2);
     *                 }, 100);
     *            }
     *         });
     *         console.log(results);
     *         // results is equal to: { one: 1, two: 2 }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function parallel$1(tasks, callback) {
        return parallel(eachOf$1, tasks, callback);
    }

    /**
     * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name parallelLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.parallel]{@link module:ControlFlow.parallel}
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
     * [async functions]{@link AsyncFunction} to run.
     * Each async function can complete with any number of optional `result` values.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     */
    function parallelLimit(tasks, limit, callback) {
        return parallel(eachOfLimit(limit), tasks, callback);
    }

    /**
     * A queue of tasks for the worker function to complete.
     * @typedef {Iterable} QueueObject
     * @memberOf module:ControlFlow
     * @property {Function} length - a function returning the number of items
     * waiting to be processed. Invoke with `queue.length()`.
     * @property {boolean} started - a boolean indicating whether or not any
     * items have been pushed and processed by the queue.
     * @property {Function} running - a function returning the number of items
     * currently being processed. Invoke with `queue.running()`.
     * @property {Function} workersList - a function returning the array of items
     * currently being processed. Invoke with `queue.workersList()`.
     * @property {Function} idle - a function returning false if there are items
     * waiting or being processed, or true if not. Invoke with `queue.idle()`.
     * @property {number} concurrency - an integer for determining how many `worker`
     * functions should be run in parallel. This property can be changed after a
     * `queue` is created to alter the concurrency on-the-fly.
     * @property {number} payload - an integer that specifies how many items are
     * passed to the worker function at a time. only applies if this is a
     * [cargo]{@link module:ControlFlow.cargo} object
     * @property {AsyncFunction} push - add a new task to the `queue`. Calls `callback`
     * once the `worker` has finished processing the task. Instead of a single task,
     * a `tasks` array can be submitted. The respective callback is used for every
     * task in the list. Invoke with `queue.push(task, [callback])`,
     * @property {AsyncFunction} unshift - add a new task to the front of the `queue`.
     * Invoke with `queue.unshift(task, [callback])`.
     * @property {AsyncFunction} pushAsync - the same as `q.push`, except this returns
     * a promise that rejects if an error occurs.
     * @property {AsyncFunction} unshiftAsync - the same as `q.unshift`, except this returns
     * a promise that rejects if an error occurs.
     * @property {Function} remove - remove items from the queue that match a test
     * function.  The test function will be passed an object with a `data` property,
     * and a `priority` property, if this is a
     * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
     * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
     * `function ({data, priority}) {}` and returns a Boolean.
     * @property {Function} saturated - a function that sets a callback that is
     * called when the number of running workers hits the `concurrency` limit, and
     * further tasks will be queued.  If the callback is omitted, `q.saturated()`
     * returns a promise for the next occurrence.
     * @property {Function} unsaturated - a function that sets a callback that is
     * called when the number of running workers is less than the `concurrency` &
     * `buffer` limits, and further tasks will not be queued. If the callback is
     * omitted, `q.unsaturated()` returns a promise for the next occurrence.
     * @property {number} buffer - A minimum threshold buffer in order to say that
     * the `queue` is `unsaturated`.
     * @property {Function} empty - a function that sets a callback that is called
     * when the last item from the `queue` is given to a `worker`. If the callback
     * is omitted, `q.empty()` returns a promise for the next occurrence.
     * @property {Function} drain - a function that sets a callback that is called
     * when the last item from the `queue` has returned from the `worker`. If the
     * callback is omitted, `q.drain()` returns a promise for the next occurrence.
     * @property {Function} error - a function that sets a callback that is called
     * when a task errors. Has the signature `function(error, task)`. If the
     * callback is omitted, `error()` returns a promise that rejects on the next
     * error.
     * @property {boolean} paused - a boolean for determining whether the queue is
     * in a paused state.
     * @property {Function} pause - a function that pauses the processing of tasks
     * until `resume()` is called. Invoke with `queue.pause()`.
     * @property {Function} resume - a function that resumes the processing of
     * queued tasks when the queue is paused. Invoke with `queue.resume()`.
     * @property {Function} kill - a function that removes the `drain` callback and
     * empties remaining tasks from the queue forcing it to go idle. No more tasks
     * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
     *
     * @example
     * const q = async.queue(worker, 2)
     * q.push(item1)
     * q.push(item2)
     * q.push(item3)
     * // queues are iterable, spread into an array to inspect
     * const items = [...q] // [item1, item2, item3]
     * // or use for of
     * for (let item of q) {
     *     console.log(item)
     * }
     *
     * q.drain(() => {
     *     console.log('all done')
     * })
     * // or
     * await q.drain()
     */

    /**
     * Creates a `queue` object with the specified `concurrency`. Tasks added to the
     * `queue` are processed in parallel (up to the `concurrency` limit). If all
     * `worker`s are in progress, the task is queued until one becomes available.
     * Once a `worker` completes a `task`, that `task`'s callback is called.
     *
     * @name queue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} worker - An async function for processing a queued task.
     * If you want to handle errors from an individual task, pass a callback to
     * `q.push()`. Invoked with (task, callback).
     * @param {number} [concurrency=1] - An `integer` for determining how many
     * `worker` functions should be run in parallel.  If omitted, the concurrency
     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can be
     * attached as certain properties to listen for specific events during the
     * lifecycle of the queue.
     * @example
     *
     * // create a queue object with concurrency 2
     * var q = async.queue(function(task, callback) {
     *     console.log('hello ' + task.name);
     *     callback();
     * }, 2);
     *
     * // assign a callback
     * q.drain(function() {
     *     console.log('all items have been processed');
     * });
     * // or await the end
     * await q.drain()
     *
     * // assign an error callback
     * q.error(function(err, task) {
     *     console.error('task experienced an error');
     * });
     *
     * // add some items to the queue
     * q.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * // callback is optional
     * q.push({name: 'bar'});
     *
     * // add some items to the queue (batch-wise)
     * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
     *     console.log('finished processing item');
     * });
     *
     * // add some items to the front of the queue
     * q.unshift({name: 'bar'}, function (err) {
     *     console.log('finished processing bar');
     * });
     */
    function queue$1 (worker, concurrency) {
        var _worker = wrapAsync(worker);
        return queue((items, cb) => {
            _worker(items[0], cb);
        }, concurrency, 1);
    }

    // Binary min-heap implementation used for priority queue.
    // Implementation is stable, i.e. push time is considered for equal priorities
    class Heap {
        constructor() {
            this.heap = [];
            this.pushCount = Number.MIN_SAFE_INTEGER;
        }

        get length() {
            return this.heap.length;
        }

        empty () {
            this.heap = [];
            return this;
        }

        percUp(index) {
            let p;

            while (index > 0 && smaller(this.heap[index], this.heap[p=parent(index)])) {
                let t = this.heap[index];
                this.heap[index] = this.heap[p];
                this.heap[p] = t;

                index = p;
            }
        }

        percDown(index) {
            let l;

            while ((l=leftChi(index)) < this.heap.length) {
                if (l+1 < this.heap.length && smaller(this.heap[l+1], this.heap[l])) {
                    l = l+1;
                }

                if (smaller(this.heap[index], this.heap[l])) {
                    break;
                }

                let t = this.heap[index];
                this.heap[index] = this.heap[l];
                this.heap[l] = t;

                index = l;
            }
        }

        push(node) {
            node.pushCount = ++this.pushCount;
            this.heap.push(node);
            this.percUp(this.heap.length-1);
        }

        unshift(node) {
            return this.heap.push(node);
        }

        shift() {
            let [top] = this.heap;

            this.heap[0] = this.heap[this.heap.length-1];
            this.heap.pop();
            this.percDown(0);

            return top;
        }

        toArray() {
            return [...this];
        }

        *[Symbol.iterator] () {
            for (let i = 0; i < this.heap.length; i++) {
                yield this.heap[i].data;
            }
        }

        remove (testFn) {
            let j = 0;
            for (let i = 0; i < this.heap.length; i++) {
                if (!testFn(this.heap[i])) {
                    this.heap[j] = this.heap[i];
                    j++;
                }
            }

            this.heap.splice(j);

            for (let i = parent(this.heap.length-1); i >= 0; i--) {
                this.percDown(i);
            }

            return this;
        }
    }

    function leftChi(i) {
        return (i<<1)+1;
    }

    function parent(i) {
        return ((i+1)>>1)-1;
    }

    function smaller(x, y) {
        if (x.priority !== y.priority) {
            return x.priority < y.priority;
        }
        else {
            return x.pushCount < y.pushCount;
        }
    }

    /**
     * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
     * completed in ascending priority order.
     *
     * @name priorityQueue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {AsyncFunction} worker - An async function for processing a queued task.
     * If you want to handle errors from an individual task, pass a callback to
     * `q.push()`.
     * Invoked with (task, callback).
     * @param {number} concurrency - An `integer` for determining how many `worker`
     * functions should be run in parallel.  If omitted, the concurrency defaults to
     * `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are three
     * differences between `queue` and `priorityQueue` objects:
     * * `push(task, priority, [callback])` - `priority` should be a number. If an
     *   array of `tasks` is given, all tasks will be assigned the same priority.
     * * `pushAsync(task, priority, [callback])` - the same as `priorityQueue.push`,
     *   except this returns a promise that rejects if an error occurs.
     * * The `unshift` and `unshiftAsync` methods were removed.
     */
    function priorityQueue(worker, concurrency) {
        // Start with a normal queue
        var q = queue$1(worker, concurrency);

        var {
            push,
            pushAsync
        } = q;

        q._tasks = new Heap();
        q._createTaskItem = ({data, priority}, callback) => {
            return {
                data,
                priority,
                callback
            };
        };

        function createDataItems(tasks, priority) {
            if (!Array.isArray(tasks)) {
                return {data: tasks, priority};
            }
            return tasks.map(data => { return {data, priority}; });
        }

        // Override push to accept second parameter representing priority
        q.push = function(data, priority = 0, callback) {
            return push(createDataItems(data, priority), callback);
        };

        q.pushAsync = function(data, priority = 0, callback) {
            return pushAsync(createDataItems(data, priority), callback);
        };

        // Remove unshift functions
        delete q.unshift;
        delete q.unshiftAsync;

        return q;
    }

    /**
     * Runs the `tasks` array of functions in parallel, without waiting until the
     * previous function has completed. Once any of the `tasks` complete or pass an
     * error to its callback, the main `callback` is immediately called. It's
     * equivalent to `Promise.race()`.
     *
     * @name race
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
     * to run. Each function can complete with an optional `result` value.
     * @param {Function} callback - A callback to run once any of the functions have
     * completed. This function gets an error or result from the first function that
     * completed. Invoked with (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * async.race([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ],
     * // main callback
     * function(err, result) {
     *     // the result will be equal to 'two' as it finishes earlier
     * });
     */
    function race(tasks, callback) {
        callback = once(callback);
        if (!Array.isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
        if (!tasks.length) return callback();
        for (var i = 0, l = tasks.length; i < l; i++) {
            wrapAsync(tasks[i])(callback);
        }
    }

    var race$1 = awaitify(race, 2);

    /**
     * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
     *
     * @name reduceRight
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reduce]{@link module:Collections.reduce}
     * @alias foldr
     * @category Collection
     * @param {Array} array - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction.
     * The `iteratee` should complete with the next state of the reduction.
     * If the iteratee completes with an error, the reduction is stopped and the
     * main `callback` is immediately called with the error.
     * Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */
    function reduceRight (array, memo, iteratee, callback) {
        var reversed = [...array].reverse();
        return reduce$1(reversed, memo, iteratee, callback);
    }

    /**
     * Wraps the async function in another function that always completes with a
     * result object, even when it errors.
     *
     * The result object has either the property `error` or `value`.
     *
     * @name reflect
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - The async function you want to wrap
     * @returns {Function} - A function that always passes null to it's callback as
     * the error. The second argument to the callback will be an `object` with
     * either an `error` or a `value` property.
     * @example
     *
     * async.parallel([
     *     async.reflect(function(callback) {
     *         // do some stuff ...
     *         callback(null, 'one');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff but error ...
     *         callback('bad stuff happened');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff ...
     *         callback(null, 'two');
     *     })
     * ],
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = 'bad stuff happened'
     *     // results[2].value = 'two'
     * });
     */
    function reflect(fn) {
        var _fn = wrapAsync(fn);
        return initialParams(function reflectOn(args, reflectCallback) {
            args.push((error, ...cbArgs) => {
                let retVal = {};
                if (error) {
                    retVal.error = error;
                }
                if (cbArgs.length > 0){
                    var value = cbArgs;
                    if (cbArgs.length <= 1) {
                        [value] = cbArgs;
                    }
                    retVal.value = value;
                }
                reflectCallback(null, retVal);
            });

            return _fn.apply(this, args);
        });
    }

    /**
     * A helper function that wraps an array or an object of functions with `reflect`.
     *
     * @name reflectAll
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.reflect]{@link module:Utils.reflect}
     * @category Util
     * @param {Array|Object|Iterable} tasks - The collection of
     * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
     * @returns {Array} Returns an array of async functions, each wrapped in
     * `async.reflect`
     * @example
     *
     * let tasks = [
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         // do some more stuff but error ...
     *         callback(new Error('bad stuff happened'));
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ];
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = Error('bad stuff happened')
     *     // results[2].value = 'two'
     * });
     *
     * // an example using an object instead of an array
     * let tasks = {
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         callback('two');
     *     },
     *     three: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'three');
     *         }, 100);
     *     }
     * };
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results.one.value = 'one'
     *     // results.two.error = 'two'
     *     // results.three.value = 'three'
     * });
     */
    function reflectAll(tasks) {
        var results;
        if (Array.isArray(tasks)) {
            results = tasks.map(reflect);
        } else {
            results = {};
            Object.keys(tasks).forEach(key => {
                results[key] = reflect.call(this, tasks[key]);
            });
        }
        return results;
    }

    function reject(eachfn, arr, _iteratee, callback) {
        const iteratee = wrapAsync(_iteratee);
        return _filter(eachfn, arr, (value, cb) => {
            iteratee(value, (err, v) => {
                cb(err, !v);
            });
        }, callback);
    }

    /**
     * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
     *
     * @name reject
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.reject(fileList, fileExists, function(err, results) {
     *    // [ 'dir3/file6.txt' ]
     *    // results now equals an array of the non-existing files
     * });
     *
     * // Using Promises
     * async.reject(fileList, fileExists)
     * .then( results => {
     *     console.log(results);
     *     // [ 'dir3/file6.txt' ]
     *     // results now equals an array of the non-existing files
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.reject(fileList, fileExists);
     *         console.log(results);
     *         // [ 'dir3/file6.txt' ]
     *         // results now equals an array of the non-existing files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function reject$1 (coll, iteratee, callback) {
        return reject(eachOf$1, coll, iteratee, callback)
    }
    var reject$2 = awaitify(reject$1, 3);

    /**
     * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name rejectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */
    function rejectLimit (coll, limit, iteratee, callback) {
        return reject(eachOfLimit(limit), coll, iteratee, callback)
    }
    var rejectLimit$1 = awaitify(rejectLimit, 4);

    /**
     * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
     *
     * @name rejectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */
    function rejectSeries (coll, iteratee, callback) {
        return reject(eachOfSeries$1, coll, iteratee, callback)
    }
    var rejectSeries$1 = awaitify(rejectSeries, 3);

    function constant$1(value) {
        return function () {
            return value;
        }
    }

    /**
     * Attempts to get a successful response from `task` no more than `times` times
     * before returning an error. If the task is successful, the `callback` will be
     * passed the result of the successful task. If all attempts fail, the callback
     * will be passed the error and result (if any) of the final attempt.
     *
     * @name retry
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @see [async.retryable]{@link module:ControlFlow.retryable}
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
     * object with `times` and `interval` or a number.
     * * `times` - The number of attempts to make before giving up.  The default
     *   is `5`.
     * * `interval` - The time to wait between retries, in milliseconds.  The
     *   default is `0`. The interval may also be specified as a function of the
     *   retry count (see example).
     * * `errorFilter` - An optional synchronous function that is invoked on
     *   erroneous result. If it returns `true` the retry attempts will continue;
     *   if the function returns `false` the retry flow is aborted with the current
     *   attempt's error and result being returned to the final callback.
     *   Invoked with (err).
     * * If `opts` is a number, the number specifies the number of times to retry,
     *   with the default interval of `0`.
     * @param {AsyncFunction} task - An async function to retry.
     * Invoked with (callback).
     * @param {Function} [callback] - An optional callback which is called when the
     * task has succeeded, or after the final failed attempt. It receives the `err`
     * and `result` arguments of the last attempt at completing the `task`. Invoked
     * with (err, results).
     * @returns {Promise} a promise if no callback provided
     *
     * @example
     *
     * // The `retry` function can be used as a stand-alone control flow by passing
     * // a callback, as shown below:
     *
     * // try calling apiMethod 3 times
     * async.retry(3, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 3 times, waiting 200 ms between each retry
     * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 10 times with exponential backoff
     * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
     * async.retry({
     *   times: 10,
     *   interval: function(retryCount) {
     *     return 50 * Math.pow(2, retryCount);
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod the default 5 times no delay between each retry
     * async.retry(apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod only when error condition satisfies, all other
     * // errors will abort the retry control flow and return to final callback
     * async.retry({
     *   errorFilter: function(err) {
     *     return err.message === 'Temporary error'; // only retry on a specific error
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // to retry individual methods that are not as reliable within other
     * // control flow functions, use the `retryable` wrapper:
     * async.auto({
     *     users: api.getUsers.bind(api),
     *     payments: async.retryable(3, api.getPayments.bind(api))
     * }, function(err, results) {
     *     // do something with the results
     * });
     *
     */
    const DEFAULT_TIMES = 5;
    const DEFAULT_INTERVAL = 0;

    function retry(opts, task, callback) {
        var options = {
            times: DEFAULT_TIMES,
            intervalFunc: constant$1(DEFAULT_INTERVAL)
        };

        if (arguments.length < 3 && typeof opts === 'function') {
            callback = task || promiseCallback();
            task = opts;
        } else {
            parseTimes(options, opts);
            callback = callback || promiseCallback();
        }

        if (typeof task !== 'function') {
            throw new Error("Invalid arguments for async.retry");
        }

        var _task = wrapAsync(task);

        var attempt = 1;
        function retryAttempt() {
            _task((err, ...args) => {
                if (err === false) return
                if (err && attempt++ < options.times &&
                    (typeof options.errorFilter != 'function' ||
                        options.errorFilter(err))) {
                    setTimeout(retryAttempt, options.intervalFunc(attempt - 1));
                } else {
                    callback(err, ...args);
                }
            });
        }

        retryAttempt();
        return callback[PROMISE_SYMBOL]
    }

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ?
                t.interval :
                constant$1(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    /**
     * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
     * wraps a task and makes it retryable, rather than immediately calling it
     * with retries.
     *
     * @name retryable
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.retry]{@link module:ControlFlow.retry}
     * @category Control Flow
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
     * options, exactly the same as from `retry`, except for a `opts.arity` that
     * is the arity of the `task` function, defaulting to `task.length`
     * @param {AsyncFunction} task - the asynchronous function to wrap.
     * This function will be passed any arguments passed to the returned wrapper.
     * Invoked with (...args, callback).
     * @returns {AsyncFunction} The wrapped function, which when invoked, will
     * retry on an error, based on the parameters specified in `opts`.
     * This function will accept the same parameters as `task`.
     * @example
     *
     * async.auto({
     *     dep1: async.retryable(3, getFromFlakyService),
     *     process: ["dep1", async.retryable(3, function (results, cb) {
     *         maybeProcessData(results.dep1, cb);
     *     })]
     * }, callback);
     */
    function retryable (opts, task) {
        if (!task) {
            task = opts;
            opts = null;
        }
        let arity = (opts && opts.arity) || task.length;
        if (isAsync(task)) {
            arity += 1;
        }
        var _task = wrapAsync(task);
        return initialParams((args, callback) => {
            if (args.length < arity - 1 || callback == null) {
                args.push(callback);
                callback = promiseCallback();
            }
            function taskFn(cb) {
                _task(...args, cb);
            }

            if (opts) retry(opts, taskFn, callback);
            else retry(taskFn, callback);

            return callback[PROMISE_SYMBOL]
        });
    }

    /**
     * Run the functions in the `tasks` collection in series, each one running once
     * the previous function has completed. If any functions in the series pass an
     * error to its callback, no more functions are run, and `callback` is
     * immediately called with the value of the error. Otherwise, `callback`
     * receives an array of results when `tasks` have completed.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function, and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     *  results from {@link async.series}.
     *
     * **Note** that while many implementations preserve the order of object
     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
     * explicitly states that
     *
     * > The mechanics and order of enumerating the properties is not specified.
     *
     * So if you rely on the order in which your series of functions are executed,
     * and want this to work on all platforms, consider using an array.
     *
     * @name series
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing
     * [async functions]{@link AsyncFunction} to run in series.
     * Each function can complete with any number of optional `result` values.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This function gets a results array (or object)
     * containing all the result arguments passed to the `task` callbacks. Invoked
     * with (err, result).
     * @return {Promise} a promise, if no callback is passed
     * @example
     *
     * //Using Callbacks
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ], function(err, results) {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * });
     *
     * // an example using objects instead of arrays
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * });
     *
     * //Using Promises
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ]).then(results => {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // an example using an object instead of an array
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }).then(results => {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.series([
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 'one');
     *                 }, 200);
     *             },
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 'two');
     *                 }, 100);
     *             }
     *         ]);
     *         console.log(results);
     *         // results is equal to ['one','two']
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // an example using an object instead of an array
     * async () => {
     *     try {
     *         let results = await async.parallel({
     *             one: function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 1);
     *                 }, 200);
     *             },
     *            two: function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 2);
     *                 }, 100);
     *            }
     *         });
     *         console.log(results);
     *         // results is equal to: { one: 1, two: 2 }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function series(tasks, callback) {
        return parallel(eachOfSeries$1, tasks, callback);
    }

    /**
     * Returns `true` if at least one element in the `coll` satisfies an async test.
     * If any iteratee call returns `true`, the main `callback` is immediately
     * called.
     *
     * @name some
     * @static
     * @memberOf module:Collections
     * @method
     * @alias any
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in parallel.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // true
     *        // result is true since some file in the list exists
     *    }
     *);
     *
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // false
     *        // result is false since none of the files exists
     *    }
     *);
     *
     * // Using Promises
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists)
     * .then( result => {
     *     console.log(result);
     *     // true
     *     // result is true since some file in the list exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists)
     * .then( result => {
     *     console.log(result);
     *     // false
     *     // result is false since none of the files exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists);
     *         console.log(result);
     *         // true
     *         // result is true since some file in the list exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * async () => {
     *     try {
     *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists);
     *         console.log(result);
     *         // false
     *         // result is false since none of the files exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function some(coll, iteratee, callback) {
        return _createTester(Boolean, res => res)(eachOf$1, coll, iteratee, callback)
    }
    var some$1 = awaitify(some, 3);

    /**
     * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
     *
     * @name someLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anyLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in parallel.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */
    function someLimit(coll, limit, iteratee, callback) {
        return _createTester(Boolean, res => res)(eachOfLimit(limit), coll, iteratee, callback)
    }
    var someLimit$1 = awaitify(someLimit, 4);

    /**
     * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
     *
     * @name someSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anySeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in series.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */
    function someSeries(coll, iteratee, callback) {
        return _createTester(Boolean, res => res)(eachOfSeries$1, coll, iteratee, callback)
    }
    var someSeries$1 = awaitify(someSeries, 3);

    /**
     * Sorts a list by the results of running each `coll` value through an async
     * `iteratee`.
     *
     * @name sortBy
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a value to use as the sort criteria as
     * its `result`.
     * Invoked with (item, callback).
     * @param {Function} callback - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is the items
     * from the original `coll` sorted by the values returned by the `iteratee`
     * calls. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback passed
     * @example
     *
     * // bigfile.txt is a file that is 251100 bytes in size
     * // mediumfile.txt is a file that is 11000 bytes in size
     * // smallfile.txt is a file that is 121 bytes in size
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes,
     *     function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *         }
     *     }
     * );
     *
     * // By modifying the callback parameter the
     * // sorting order can be influenced:
     *
     * // ascending order
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], function(file, callback) {
     *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
     *         if (getFileSizeErr) return callback(getFileSizeErr);
     *         callback(null, fileSize);
     *     });
     * }, function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *         }
     *     }
     * );
     *
     * // descending order
     * async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], function(file, callback) {
     *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
     *         if (getFileSizeErr) {
     *             return callback(getFileSizeErr);
     *         }
     *         callback(null, fileSize * -1);
     *     });
     * }, function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'bigfile.txt', 'mediumfile.txt', 'smallfile.txt']
     *         }
     *     }
     * );
     *
     * // Error handling
     * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes,
     *     function(err, results) {
     *         if (err) {
     *             console.log(err);
     *             // [ Error: ENOENT: no such file or directory ]
     *         } else {
     *             console.log(results);
     *         }
     *     }
     * );
     *
     * // Using Promises
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     *     // results is now the original array of files sorted by
     *     // file size (ascending by default), e.g.
     *     // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error handling
     * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * (async () => {
     *     try {
     *         let results = await async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
     *         console.log(results);
     *         // results is now the original array of files sorted by
     *         // file size (ascending by default), e.g.
     *         // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * })();
     *
     * // Error handling
     * async () => {
     *     try {
     *         let results = await async.sortBy(['missingfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
     *         console.log(results);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */
    function sortBy (coll, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return map$1(coll, (x, iterCb) => {
            _iteratee(x, (err, criteria) => {
                if (err) return iterCb(err);
                iterCb(err, {value: x, criteria});
            });
        }, (err, results) => {
            if (err) return callback(err);
            callback(null, results.sort(comparator).map(v => v.value));
        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    }
    var sortBy$1 = awaitify(sortBy, 3);

    /**
     * Sets a time limit on an asynchronous function. If the function does not call
     * its callback within the specified milliseconds, it will be called with a
     * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
     *
     * @name timeout
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} asyncFn - The async function to limit in time.
     * @param {number} milliseconds - The specified time limit.
     * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
     * to timeout Error for more information..
     * @returns {AsyncFunction} Returns a wrapped function that can be used with any
     * of the control flow functions.
     * Invoke this function with the same parameters as you would `asyncFunc`.
     * @example
     *
     * function myFunction(foo, callback) {
     *     doAsyncTask(foo, function(err, data) {
     *         // handle errors
     *         if (err) return callback(err);
     *
     *         // do some stuff ...
     *
     *         // return processed data
     *         return callback(null, data);
     *     });
     * }
     *
     * var wrapped = async.timeout(myFunction, 1000);
     *
     * // call `wrapped` as you would `myFunction`
     * wrapped({ bar: 'bar' }, function(err, data) {
     *     // if `myFunction` takes < 1000 ms to execute, `err`
     *     // and `data` will have their expected values
     *
     *     // else `err` will be an Error with the code 'ETIMEDOUT'
     * });
     */
    function timeout(asyncFn, milliseconds, info) {
        var fn = wrapAsync(asyncFn);

        return initialParams((args, callback) => {
            var timedOut = false;
            var timer;

            function timeoutCallback() {
                var name = asyncFn.name || 'anonymous';
                var error  = new Error('Callback function "' + name + '" timed out.');
                error.code = 'ETIMEDOUT';
                if (info) {
                    error.info = info;
                }
                timedOut = true;
                callback(error);
            }

            args.push((...cbArgs) => {
                if (!timedOut) {
                    callback(...cbArgs);
                    clearTimeout(timer);
                }
            });

            // setup timer and call original function
            timer = setTimeout(timeoutCallback, milliseconds);
            fn(...args);
        });
    }

    function range(size) {
        var result = Array(size);
        while (size--) {
            result[size] = size;
        }
        return result;
    }

    /**
     * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name timesLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} count - The number of times to run the function.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see [async.map]{@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     */
    function timesLimit(count, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(range(count), limit, _iteratee, callback);
    }

    /**
     * Calls the `iteratee` function `n` times, and accumulates results in the same
     * manner you would use with [map]{@link module:Collections.map}.
     *
     * @name times
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     * @example
     *
     * // Pretend this is some complicated async factory
     * var createUser = function(id, callback) {
     *     callback(null, {
     *         id: 'user' + id
     *     });
     * };
     *
     * // generate 5 users
     * async.times(5, function(n, next) {
     *     createUser(n, function(err, user) {
     *         next(err, user);
     *     });
     * }, function(err, users) {
     *     // we should now have 5 users
     * });
     */
    function times (n, iteratee, callback) {
        return timesLimit(n, Infinity, iteratee, callback)
    }

    /**
     * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
     *
     * @name timesSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     */
    function timesSeries (n, iteratee, callback) {
        return timesLimit(n, 1, iteratee, callback)
    }

    /**
     * A relative of `reduce`.  Takes an Object or Array, and iterates over each
     * element in parallel, each step potentially mutating an `accumulator` value.
     * The type of the accumulator defaults to the type of collection passed in.
     *
     * @name transform
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {*} [accumulator] - The initial state of the transform.  If omitted,
     * it will default to an empty Object or Array, depending on the type of `coll`
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * collection that potentially modifies the accumulator.
     * Invoked with (accumulator, item, key, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the transformed accumulator.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     *
     * // helper function that returns human-readable size format from bytes
     * function formatBytes(bytes, decimals = 2) {
     *   // implementation not included for brevity
     *   return humanReadbleFilesize;
     * }
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     *
     * // asynchronous function that returns the file size, transformed to human-readable format
     * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
     * function transformFileSize(acc, value, key, callback) {
     *     fs.stat(value, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         acc[key] = formatBytes(stat.size);
     *         callback(null);
     *     });
     * }
     *
     * // Using callbacks
     * async.transform(fileList, transformFileSize, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     *     }
     * });
     *
     * // Using Promises
     * async.transform(fileList, transformFileSize)
     * .then(result => {
     *     console.log(result);
     *     // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * (async () => {
     *     try {
     *         let result = await async.transform(fileList, transformFileSize);
     *         console.log(result);
     *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * })();
     *
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     *
     * // helper function that returns human-readable size format from bytes
     * function formatBytes(bytes, decimals = 2) {
     *   // implementation not included for brevity
     *   return humanReadbleFilesize;
     * }
     *
     * const fileMap = { f1: 'file1.txt', f2: 'file2.txt', f3: 'file3.txt' };
     *
     * // asynchronous function that returns the file size, transformed to human-readable format
     * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
     * function transformFileSize(acc, value, key, callback) {
     *     fs.stat(value, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         acc[key] = formatBytes(stat.size);
     *         callback(null);
     *     });
     * }
     *
     * // Using callbacks
     * async.transform(fileMap, transformFileSize, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     *     }
     * });
     *
     * // Using Promises
     * async.transform(fileMap, transformFileSize)
     * .then(result => {
     *     console.log(result);
     *     // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.transform(fileMap, transformFileSize);
     *         console.log(result);
     *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function transform (coll, accumulator, iteratee, callback) {
        if (arguments.length <= 3 && typeof accumulator === 'function') {
            callback = iteratee;
            iteratee = accumulator;
            accumulator = Array.isArray(coll) ? [] : {};
        }
        callback = once(callback || promiseCallback());
        var _iteratee = wrapAsync(iteratee);

        eachOf$1(coll, (v, k, cb) => {
            _iteratee(accumulator, v, k, cb);
        }, err => callback(err, accumulator));
        return callback[PROMISE_SYMBOL]
    }

    /**
     * It runs each task in series but stops whenever any of the functions were
     * successful. If one of the tasks were successful, the `callback` will be
     * passed the result of the successful task. If all tasks fail, the callback
     * will be passed the error and result (if any) of the final attempt.
     *
     * @name tryEach
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing functions to
     * run, each function is passed a `callback(err, result)` it must call on
     * completion with an error `err` (which can be `null`) and an optional `result`
     * value.
     * @param {Function} [callback] - An optional callback which is called when one
     * of the tasks has succeeded, or all have failed. It receives the `err` and
     * `result` arguments of the last attempt at completing the `task`. Invoked with
     * (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     * async.tryEach([
     *     function getDataFromFirstWebsite(callback) {
     *         // Try getting the data from the first website
     *         callback(err, data);
     *     },
     *     function getDataFromSecondWebsite(callback) {
     *         // First website failed,
     *         // Try getting the data from the backup website
     *         callback(err, data);
     *     }
     * ],
     * // optional callback
     * function(err, results) {
     *     Now do something with the data.
     * });
     *
     */
    function tryEach(tasks, callback) {
        var error = null;
        var result;
        return eachSeries$1(tasks, (task, taskCb) => {
            wrapAsync(task)((err, ...args) => {
                if (err === false) return taskCb(err);

                if (args.length < 2) {
                    [result] = args;
                } else {
                    result = args;
                }
                error = err;
                taskCb(err ? null : {});
            });
        }, () => callback(error, result));
    }

    var tryEach$1 = awaitify(tryEach);

    /**
     * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
     * unmemoized form. Handy for testing.
     *
     * @name unmemoize
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.memoize]{@link module:Utils.memoize}
     * @category Util
     * @param {AsyncFunction} fn - the memoized function
     * @returns {AsyncFunction} a function that calls the original unmemoized function
     */
    function unmemoize(fn) {
        return (...args) => {
            return (fn.unmemoized || fn)(...args);
        };
    }

    /**
     * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs.
     *
     * @name whilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} test - asynchronous truth test to perform before each
     * execution of `iteratee`. Invoked with ().
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` passes. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * var count = 0;
     * async.whilst(
     *     function test(cb) { cb(null, count < 5); },
     *     function iter(callback) {
     *         count++;
     *         setTimeout(function() {
     *             callback(null, count);
     *         }, 1000);
     *     },
     *     function (err, n) {
     *         // 5 seconds have passed, n = 5
     *     }
     * );
     */
    function whilst(test, iteratee, callback) {
        callback = onlyOnce(callback);
        var _fn = wrapAsync(iteratee);
        var _test = wrapAsync(test);
        var results = [];

        function next(err, ...rest) {
            if (err) return callback(err);
            results = rest;
            if (err === false) return;
            _test(check);
        }

        function check(err, truth) {
            if (err) return callback(err);
            if (err === false) return;
            if (!truth) return callback(null, ...results);
            _fn(next);
        }

        return _test(check);
    }
    var whilst$1 = awaitify(whilst, 3);

    /**
     * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs. `callback` will be passed an error and any
     * arguments passed to the final `iteratee`'s callback.
     *
     * The inverse of [whilst]{@link module:ControlFlow.whilst}.
     *
     * @name until
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {AsyncFunction} test - asynchronous truth test to perform before each
     * execution of `iteratee`. Invoked with (callback).
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` fails. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if a callback is not passed
     *
     * @example
     * const results = []
     * let finished = false
     * async.until(function test(cb) {
     *     cb(null, finished)
     * }, function iter(next) {
     *     fetchPage(url, (err, body) => {
     *         if (err) return next(err)
     *         results = results.concat(body.objects)
     *         finished = !!body.next
     *         next(err)
     *     })
     * }, function done (err) {
     *     // all pages have been fetched
     * })
     */
    function until(test, iteratee, callback) {
        const _test = wrapAsync(test);
        return whilst$1((cb) => _test((err, truth) => cb (err, !truth)), iteratee, callback);
    }

    /**
     * Runs the `tasks` array of functions in series, each passing their results to
     * the next in the array. However, if any of the `tasks` pass an error to their
     * own callback, the next function is not executed, and the main `callback` is
     * immediately called with the error.
     *
     * @name waterfall
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
     * to run.
     * Each function should complete with any number of `result` values.
     * The `result` values will be passed as arguments, in order, to the next task.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This will be passed the results of the last task's
     * callback. Invoked with (err, [results]).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * async.waterfall([
     *     function(callback) {
     *         callback(null, 'one', 'two');
     *     },
     *     function(arg1, arg2, callback) {
     *         // arg1 now equals 'one' and arg2 now equals 'two'
     *         callback(null, 'three');
     *     },
     *     function(arg1, callback) {
     *         // arg1 now equals 'three'
     *         callback(null, 'done');
     *     }
     * ], function (err, result) {
     *     // result now equals 'done'
     * });
     *
     * // Or, with named functions:
     * async.waterfall([
     *     myFirstFunction,
     *     mySecondFunction,
     *     myLastFunction,
     * ], function (err, result) {
     *     // result now equals 'done'
     * });
     * function myFirstFunction(callback) {
     *     callback(null, 'one', 'two');
     * }
     * function mySecondFunction(arg1, arg2, callback) {
     *     // arg1 now equals 'one' and arg2 now equals 'two'
     *     callback(null, 'three');
     * }
     * function myLastFunction(arg1, callback) {
     *     // arg1 now equals 'three'
     *     callback(null, 'done');
     * }
     */
    function waterfall (tasks, callback) {
        callback = once(callback);
        if (!Array.isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
        if (!tasks.length) return callback();
        var taskIndex = 0;

        function nextTask(args) {
            var task = wrapAsync(tasks[taskIndex++]);
            task(...args, onlyOnce(next));
        }

        function next(err, ...args) {
            if (err === false) return
            if (err || taskIndex === tasks.length) {
                return callback(err, ...args);
            }
            nextTask(args);
        }

        nextTask([]);
    }

    var waterfall$1 = awaitify(waterfall);

    /**
     * An "async function" in the context of Async is an asynchronous function with
     * a variable number of parameters, with the final parameter being a callback.
     * (`function (arg1, arg2, ..., callback) {}`)
     * The final callback is of the form `callback(err, results...)`, which must be
     * called once the function is completed.  The callback should be called with a
     * Error as its first argument to signal that an error occurred.
     * Otherwise, if no error occurred, it should be called with `null` as the first
     * argument, and any additional `result` arguments that may apply, to signal
     * successful completion.
     * The callback must be called exactly once, ideally on a later tick of the
     * JavaScript event loop.
     *
     * This type of function is also referred to as a "Node-style async function",
     * or a "continuation passing-style function" (CPS). Most of the methods of this
     * library are themselves CPS/Node-style async functions, or functions that
     * return CPS/Node-style async functions.
     *
     * Wherever we accept a Node-style async function, we also directly accept an
     * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
     * In this case, the `async` function will not be passed a final callback
     * argument, and any thrown error will be used as the `err` argument of the
     * implicit callback, and the return value will be used as the `result` value.
     * (i.e. a `rejected` of the returned Promise becomes the `err` callback
     * argument, and a `resolved` value becomes the `result`.)
     *
     * Note, due to JavaScript limitations, we can only detect native `async`
     * functions and not transpilied implementations.
     * Your environment must have `async`/`await` support for this to work.
     * (e.g. Node > v7.6, or a recent version of a modern browser).
     * If you are using `async` functions through a transpiler (e.g. Babel), you
     * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
     * because the `async function` will be compiled to an ordinary function that
     * returns a promise.
     *
     * @typedef {Function} AsyncFunction
     * @static
     */

    var index = {
        apply,
        applyEach: applyEach$1,
        applyEachSeries,
        asyncify,
        auto,
        autoInject,
        cargo,
        cargoQueue: cargo$1,
        compose,
        concat: concat$1,
        concatLimit: concatLimit$1,
        concatSeries: concatSeries$1,
        constant,
        detect: detect$1,
        detectLimit: detectLimit$1,
        detectSeries: detectSeries$1,
        dir,
        doUntil,
        doWhilst: doWhilst$1,
        each,
        eachLimit: eachLimit$2,
        eachOf: eachOf$1,
        eachOfLimit: eachOfLimit$2,
        eachOfSeries: eachOfSeries$1,
        eachSeries: eachSeries$1,
        ensureAsync,
        every: every$1,
        everyLimit: everyLimit$1,
        everySeries: everySeries$1,
        filter: filter$1,
        filterLimit: filterLimit$1,
        filterSeries: filterSeries$1,
        forever: forever$1,
        groupBy,
        groupByLimit: groupByLimit$1,
        groupBySeries,
        log,
        map: map$1,
        mapLimit: mapLimit$1,
        mapSeries: mapSeries$1,
        mapValues,
        mapValuesLimit: mapValuesLimit$1,
        mapValuesSeries,
        memoize,
        nextTick,
        parallel: parallel$1,
        parallelLimit,
        priorityQueue,
        queue: queue$1,
        race: race$1,
        reduce: reduce$1,
        reduceRight,
        reflect,
        reflectAll,
        reject: reject$2,
        rejectLimit: rejectLimit$1,
        rejectSeries: rejectSeries$1,
        retry,
        retryable,
        seq,
        series,
        setImmediate: setImmediate$1,
        some: some$1,
        someLimit: someLimit$1,
        someSeries: someSeries$1,
        sortBy: sortBy$1,
        timeout,
        times,
        timesLimit,
        timesSeries,
        transform,
        tryEach: tryEach$1,
        unmemoize,
        until,
        waterfall: waterfall$1,
        whilst: whilst$1,

        // aliases
        all: every$1,
        allLimit: everyLimit$1,
        allSeries: everySeries$1,
        any: some$1,
        anyLimit: someLimit$1,
        anySeries: someSeries$1,
        find: detect$1,
        findLimit: detectLimit$1,
        findSeries: detectSeries$1,
        flatMap: concat$1,
        flatMapLimit: concatLimit$1,
        flatMapSeries: concatSeries$1,
        forEach: each,
        forEachSeries: eachSeries$1,
        forEachLimit: eachLimit$2,
        forEachOf: eachOf$1,
        forEachOfSeries: eachOfSeries$1,
        forEachOfLimit: eachOfLimit$2,
        inject: reduce$1,
        foldl: reduce$1,
        foldr: reduceRight,
        select: filter$1,
        selectLimit: filterLimit$1,
        selectSeries: filterSeries$1,
        wrapSync: asyncify,
        during: whilst$1,
        doDuring: doWhilst$1
    };

    exports.default = index;
    exports.apply = apply;
    exports.applyEach = applyEach$1;
    exports.applyEachSeries = applyEachSeries;
    exports.asyncify = asyncify;
    exports.auto = auto;
    exports.autoInject = autoInject;
    exports.cargo = cargo;
    exports.cargoQueue = cargo$1;
    exports.compose = compose;
    exports.concat = concat$1;
    exports.concatLimit = concatLimit$1;
    exports.concatSeries = concatSeries$1;
    exports.constant = constant;
    exports.detect = detect$1;
    exports.detectLimit = detectLimit$1;
    exports.detectSeries = detectSeries$1;
    exports.dir = dir;
    exports.doUntil = doUntil;
    exports.doWhilst = doWhilst$1;
    exports.each = each;
    exports.eachLimit = eachLimit$2;
    exports.eachOf = eachOf$1;
    exports.eachOfLimit = eachOfLimit$2;
    exports.eachOfSeries = eachOfSeries$1;
    exports.eachSeries = eachSeries$1;
    exports.ensureAsync = ensureAsync;
    exports.every = every$1;
    exports.everyLimit = everyLimit$1;
    exports.everySeries = everySeries$1;
    exports.filter = filter$1;
    exports.filterLimit = filterLimit$1;
    exports.filterSeries = filterSeries$1;
    exports.forever = forever$1;
    exports.groupBy = groupBy;
    exports.groupByLimit = groupByLimit$1;
    exports.groupBySeries = groupBySeries;
    exports.log = log;
    exports.map = map$1;
    exports.mapLimit = mapLimit$1;
    exports.mapSeries = mapSeries$1;
    exports.mapValues = mapValues;
    exports.mapValuesLimit = mapValuesLimit$1;
    exports.mapValuesSeries = mapValuesSeries;
    exports.memoize = memoize;
    exports.nextTick = nextTick;
    exports.parallel = parallel$1;
    exports.parallelLimit = parallelLimit;
    exports.priorityQueue = priorityQueue;
    exports.queue = queue$1;
    exports.race = race$1;
    exports.reduce = reduce$1;
    exports.reduceRight = reduceRight;
    exports.reflect = reflect;
    exports.reflectAll = reflectAll;
    exports.reject = reject$2;
    exports.rejectLimit = rejectLimit$1;
    exports.rejectSeries = rejectSeries$1;
    exports.retry = retry;
    exports.retryable = retryable;
    exports.seq = seq;
    exports.series = series;
    exports.setImmediate = setImmediate$1;
    exports.some = some$1;
    exports.someLimit = someLimit$1;
    exports.someSeries = someSeries$1;
    exports.sortBy = sortBy$1;
    exports.timeout = timeout;
    exports.times = times;
    exports.timesLimit = timesLimit;
    exports.timesSeries = timesSeries;
    exports.transform = transform;
    exports.tryEach = tryEach$1;
    exports.unmemoize = unmemoize;
    exports.until = until;
    exports.waterfall = waterfall$1;
    exports.whilst = whilst$1;
    exports.all = every$1;
    exports.allLimit = everyLimit$1;
    exports.allSeries = everySeries$1;
    exports.any = some$1;
    exports.anyLimit = someLimit$1;
    exports.anySeries = someSeries$1;
    exports.find = detect$1;
    exports.findLimit = detectLimit$1;
    exports.findSeries = detectSeries$1;
    exports.flatMap = concat$1;
    exports.flatMapLimit = concatLimit$1;
    exports.flatMapSeries = concatSeries$1;
    exports.forEach = each;
    exports.forEachSeries = eachSeries$1;
    exports.forEachLimit = eachLimit$2;
    exports.forEachOf = eachOf$1;
    exports.forEachOfSeries = eachOfSeries$1;
    exports.forEachOfLimit = eachOfLimit$2;
    exports.inject = reduce$1;
    exports.foldl = reduce$1;
    exports.foldr = reduceRight;
    exports.select = filter$1;
    exports.selectLimit = filterLimit$1;
    exports.selectSeries = filterSeries$1;
    exports.wrapSync = asyncify;
    exports.during = whilst$1;
    exports.doDuring = doWhilst$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ 6463:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 6068:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Things we will need
 */
function __ncc_wildcard$0 (arg) {
  if (arg === "alpine") return __nccwpck_require__(1068);
  else if (arg === "amazon") return __nccwpck_require__(6466);
  else if (arg === "arch") return __nccwpck_require__(9511);
  else if (arg === "centos") return __nccwpck_require__(9012);
  else if (arg === "debian") return __nccwpck_require__(6212);
  else if (arg === "fedora") return __nccwpck_require__(1422);
  else if (arg === "kde") return __nccwpck_require__(3541);
  else if (arg === "manjaro") return __nccwpck_require__(770);
  else if (arg === "mint") return __nccwpck_require__(2430);
  else if (arg === "raspbian") return __nccwpck_require__(484);
  else if (arg === "red") return __nccwpck_require__(8310);
  else if (arg === "suse") return __nccwpck_require__(8264);
  else if (arg === "ubuntu") return __nccwpck_require__(6478);
  else if (arg === "zorin") return __nccwpck_require__(7054);
}
var async = __nccwpck_require__(7888)
var distros = __nccwpck_require__(1405)
var fs = __nccwpck_require__(7147)
var os = __nccwpck_require__(2037)

/**
 * Begin definition of globals.
 */
var cachedDistro = null // Store result of getLinuxDistro() after first call

/**
 * Module definition.
 */
module.exports = function getOs (cb) {
  // Node builtin as first line of defense.
  var osName = os.platform()
  // Linux is a special case.
  if (osName === 'linux') return getLinuxDistro(cb)
  // Else, node's builtin is acceptable.
  return cb(null, { os: osName })
}

/**
 * Identify the actual distribution name on a linux box.
 */
function getLinuxDistro (cb) {
  /**
   * First, we check to see if this function has been called before.
   * Since an OS doesn't change during runtime, its safe to cache
   * the result and return it for future calls.
   */
  if (cachedDistro) return cb(null, cachedDistro)

  /**
   * We are going to take our list of release files from os.json and
   * check to see which one exists. It is safe to assume that no more
   * than 1 file in the list from os.json will exist on a distribution.
   */
  getReleaseFile(Object.keys(distros), function (e, file) {
    if (e) return cb(e)

    /**
     * Multiple distributions may share the same release file.
     * We get our array of candidates and match the format of the release
     * files and match them to a potential distribution
     */
    var candidates = distros[file]
    var os = { os: 'linux', dist: candidates[0] }

    fs.readFile(file, 'utf-8', function (e, file) {
      if (e) return cb(e)

      /**
       * If we only know of one distribution that has this file, its
       * somewhat safe to assume that it is the distribution we are
       * running on.
       */
      if (candidates.length === 1) {
        return customLogic(os, getName(os.dist), file, function (e, os) {
          if (e) return cb(e)
          cachedDistro = os
          return cb(null, os)
        })
      }
      /**
       * First, set everything to lower case to keep inconsistent
       * specifications from mucking up our logic.
       */
      file = file.toLowerCase()
      /**
       * Now we need to check all of our potential candidates one by one.
       * If their name is in the release file, it is guarenteed to be the
       * distribution we are running on. If distributions share the same
       * release file, it is reasonably safe to assume they will have the
       * distribution name stored in their release file.
       */
      async.each(candidates, function (candidate, done) {
        var name = getName(candidate)
        if (file.indexOf(name) >= 0) {
          os.dist = candidate
          return customLogic(os, name, file, function (e, augmentedOs) {
            if (e) return done(e)
            os = augmentedOs
            return done()
          })
        } else {
          return done()
        }
      }, function (e) {
        if (e) return cb(e)
        cachedDistro = os
        return cb(null, os)
      })
    })
  })() // sneaky sneaky.
}

function getName (candidate) {
  /**
   * We only care about the first word. I.E. for Arch Linux it is safe
   * to simply search for "arch". Also note, we force lower case to
   * match file.toLowerCase() above.
   */
  var index = 0
  var name = 'linux'
  /**
   * Don't include 'linux' when searching since it is too aggressive when
   * matching (see #54)
   */
  while (name === 'linux') {
    name = candidate.split(' ')[index++].toLowerCase()
  }
  return name
}

/**
 * Loads a custom logic module to populate additional distribution information
 */
function customLogic (os, name, file, cb) {
  try { __ncc_wildcard$0(name)(os, file, cb) } catch (e) { cb(null, os) }
}

/**
 * getReleaseFile() checks an array of filenames and returns the first one it
 * finds on the filesystem.
 */
function getReleaseFile (names, cb) {
  var index = 0 // Lets keep track of which file we are on.
  /**
   * checkExists() is a first class function that we are using for recursion.
   */
  return function checkExists () {
    /**
     * Lets get the file metadata off the current file.
     */
    fs.stat(names[index], function (e, stat) {
      /**
       * Now we check if either the file didn't exist, or it is something
       * other than a file for some very very bizzar reason.
       */
      if (e || !stat.isFile()) {
        index++ // If it is not a file, we will check the next one!
        if (names.length <= index) { // Unless we are out of files.
          return cb(new Error('No unique release file found!')) // Then error.
        }
        return checkExists() // Re-call this function to check the next file.
      }
      cb(null, names[index]) // If we found a file, return it!
    })
  }
}


/***/ }),

/***/ 1068:
/***/ ((module) => {

var releaseRegex = /(.*)/

module.exports = function alpineCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 6466:
/***/ ((module) => {

var releaseRegex = /release (.*)/

module.exports = function amazonCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 9511:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(6478)


/***/ }),

/***/ 9012:
/***/ ((module) => {

var releaseRegex = /release ([^ ]+)/
var codenameRegex = /\((.*)\)/

module.exports = function centosCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  var codename = file.match(codenameRegex)
  if (codename && codename.length === 2) os.codename = codename[1]
  cb(null, os)
}


/***/ }),

/***/ 6212:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var exec = (__nccwpck_require__(2081).exec)
var lsbRelease = /Release:\t(.*)/
var lsbCodename = /Codename:\t(.*)/
var releaseRegex = /(.*)/

module.exports = function (os, file, cb) {
  // first try lsb_release
  return lsbrelease(os, file, cb)
}

function lsbrelease (os, file, cb) {
  exec('lsb_release -a', function (e, stdout, stderr) {
    if (e) return releasefile(os, file, cb)
    var release = stdout.match(lsbRelease)
    if (release && release.length === 2) os.release = release[1]
    var codename = stdout.match(lsbCodename)
    if (codename && release.length === 2) os.codename = codename[1]
    cb(null, os)
  })
}

function releasefile (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 1422:
/***/ ((module) => {

var releaseRegex = /release (..)/
var codenameRegex = /\((.*)\)/

module.exports = function fedoraCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  var codename = file.match(codenameRegex)
  if (codename && codename.length === 2) os.codename = codename[1]
  cb(null, os)
}


/***/ }),

/***/ 3541:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(6478)


/***/ }),

/***/ 770:
/***/ ((module) => {

var releaseRegex = /distrib_release=(.*)/
var codenameRegex = /distrib_codename=(.*)/

module.exports = function ubuntuCustomLogic (os, file, cb) {
  var codename = file.match(codenameRegex)
  if (codename && codename.length === 2) os.codename = codename[1]
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 2430:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(6478)


/***/ }),

/***/ 484:
/***/ ((module) => {

var releaseRegex = /VERSION_ID="(.*)"/
var codenameRegex = /VERSION="[0-9] \((.*)\)"/

module.exports = function raspbianCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  var codename = file.match(codenameRegex)
  if (codename && codename.length === 2) os.codename = codename[1]
  cb(null, os)
}


/***/ }),

/***/ 8310:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(9012)


/***/ }),

/***/ 8264:
/***/ ((module) => {

var releaseRegex = /VERSION = (.*)\n/

module.exports = function suseCustomLogic (os, file, cb) {
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 6478:
/***/ ((module) => {

var releaseRegex = /distrib_release=(.*)/
var codenameRegex = /distrib_codename=(.*)/

module.exports = function ubuntuCustomLogic (os, file, cb) {
  var codename = file.match(codenameRegex)
  if (codename && codename.length === 2) os.codename = codename[1]
  var release = file.match(releaseRegex)
  if (release && release.length === 2) os.release = release[1]
  cb(null, os)
}


/***/ }),

/***/ 7054:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(6478)


/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(665)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 1933:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/**
 * Parser functions.
 */

var parserFunctions = __nccwpck_require__(8068);
Object.keys(parserFunctions).forEach(function (k) { exports[k] = parserFunctions[k]; });

/**
 * Builder functions.
 */

var builderFunctions = __nccwpck_require__(9979);
Object.keys(builderFunctions).forEach(function (k) { exports[k] = builderFunctions[k]; });


/***/ }),

/***/ 9979:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

var base64 = __nccwpck_require__(6463);
var xmlbuilder = __nccwpck_require__(2958);

/**
 * Module exports.
 */

exports.build = build;

/**
 * Accepts a `Date` instance and returns an ISO date string.
 *
 * @param {Date} d - Date instance to serialize
 * @returns {String} ISO date string representation of `d`
 * @api private
 */

function ISODateString(d){
  function pad(n){
    return n < 10 ? '0' + n : n;
  }
  return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z';
}

/**
 * Returns the internal "type" of `obj` via the
 * `Object.prototype.toString()` trick.
 *
 * @param {Mixed} obj - any value
 * @returns {String} the internal "type" name
 * @api private
 */

var toString = Object.prototype.toString;
function type (obj) {
  var m = toString.call(obj).match(/\[object (.*)\]/);
  return m ? m[1] : m;
}

/**
 * Generate an XML plist string from the input object `obj`.
 *
 * @param {Object} obj - the object to convert
 * @param {Object} [opts] - optional options object
 * @returns {String} converted plist XML string
 * @api public
 */

function build (obj, opts) {
  var XMLHDR = {
    version: '1.0',
    encoding: 'UTF-8'
  };

  var XMLDTD = {
    pubid: '-//Apple//DTD PLIST 1.0//EN',
    sysid: 'http://www.apple.com/DTDs/PropertyList-1.0.dtd'
  };

  var doc = xmlbuilder.create('plist');

  doc.dec(XMLHDR.version, XMLHDR.encoding, XMLHDR.standalone);
  doc.dtd(XMLDTD.pubid, XMLDTD.sysid);
  doc.att('version', '1.0');

  walk_obj(obj, doc);

  if (!opts) opts = {};
  // default `pretty` to `true`
  opts.pretty = opts.pretty !== false;
  return doc.end(opts);
}

/**
 * depth first, recursive traversal of a javascript object. when complete,
 * next_child contains a reference to the build XML object.
 *
 * @api private
 */

function walk_obj(next, next_child) {
  var tag_type, i, prop;
  var name = type(next);

  if ('Undefined' == name) {
    return;
  } else if (Array.isArray(next)) {
    next_child = next_child.ele('array');
    for (i = 0; i < next.length; i++) {
      walk_obj(next[i], next_child);
    }

  } else if (Buffer.isBuffer(next)) {
    next_child.ele('data').raw(next.toString('base64'));

  } else if ('Object' == name) {
    next_child = next_child.ele('dict');
    for (prop in next) {
      if (next.hasOwnProperty(prop)) {
        next_child.ele('key').txt(prop);
        walk_obj(next[prop], next_child);
      }
    }

  } else if ('Number' == name) {
    // detect if this is an integer or real
    // TODO: add an ability to force one way or another via a "cast"
    tag_type = (next % 1 === 0) ? 'integer' : 'real';
    next_child.ele(tag_type).txt(next.toString());

  } else if ('Date' == name) {
    next_child.ele('date').txt(ISODateString(new Date(next)));

  } else if ('Boolean' == name) {
    next_child.ele(next ? 'true' : 'false');

  } else if ('String' == name) {
    next_child.ele('string').txt(next);

  } else if ('ArrayBuffer' == name) {
    next_child.ele('data').raw(base64.fromByteArray(next));

  } else if (next && next.buffer && 'ArrayBuffer' == type(next.buffer)) {
    // a typed array
    next_child.ele('data').raw(base64.fromByteArray(new Uint8Array(next.buffer), next_child));

  } else if ('Null' === name) {
    next_child.ele('null').txt('');

  }
}


/***/ }),

/***/ 8068:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

var DOMParser = (__nccwpck_require__(4399)/* .DOMParser */ .a);

/**
 * Module exports.
 */

exports.parse = parse;

var TEXT_NODE = 3;
var CDATA_NODE = 4;
var COMMENT_NODE = 8;


/**
 * We ignore raw text (usually whitespace), <!-- xml comments -->,
 * and raw CDATA nodes.
 *
 * @param {Element} node
 * @returns {Boolean}
 * @api private
 */

function shouldIgnoreNode (node) {
  return node.nodeType === TEXT_NODE
    || node.nodeType === COMMENT_NODE
    || node.nodeType === CDATA_NODE;
}

/**
 * Check if the node is empty. Some plist file has such node:
 * <key />
 * this node shoud be ignored.
 *
 * @see https://github.com/TooTallNate/plist.js/issues/66
 * @param {Element} node
 * @returns {Boolean}
 * @api private
 */
function isEmptyNode(node){
  if(!node.childNodes || node.childNodes.length === 0) {
    return true;
  } else {
    return false;
  }
}

function invariant(test, message) {
  if (!test) {
    throw new Error(message);
  }
}

/**
 * Parses a Plist XML string. Returns an Object.
 *
 * @param {String} xml - the XML String to decode
 * @returns {Mixed} the decoded value from the Plist XML
 * @api public
 */

function parse (xml) {
  var doc = new DOMParser().parseFromString(xml);
  invariant(
    doc.documentElement.nodeName === 'plist',
    'malformed document. First element should be <plist>'
  );
  var plist = parsePlistXML(doc.documentElement);

  // the root <plist> node gets interpreted as an Array,
  // so pull out the inner data first
  if (plist.length == 1) plist = plist[0];

  return plist;
}

/**
 * Convert an XML based plist document into a JSON representation.
 *
 * @param {Object} xml_node - current XML node in the plist
 * @returns {Mixed} built up JSON object
 * @api private
 */

function parsePlistXML (node) {
  var i, new_obj, key, val, new_arr, res, counter, type;

  if (!node)
    return null;

  if (node.nodeName === 'plist') {
    new_arr = [];
    if (isEmptyNode(node)) {
      return new_arr;
    }
    for (i=0; i < node.childNodes.length; i++) {
      if (!shouldIgnoreNode(node.childNodes[i])) {
        new_arr.push( parsePlistXML(node.childNodes[i]));
      }
    }
    return new_arr;
  } else if (node.nodeName === 'dict') {
    new_obj = {};
    key = null;
    counter = 0;
    if (isEmptyNode(node)) {
      return new_obj;
    }
    for (i=0; i < node.childNodes.length; i++) {
      if (shouldIgnoreNode(node.childNodes[i])) continue;
      if (counter % 2 === 0) {
        invariant(
          node.childNodes[i].nodeName === 'key',
          'Missing key while parsing <dict/>.'
        );
        key = parsePlistXML(node.childNodes[i]);
      } else {
        invariant(
          node.childNodes[i].nodeName !== 'key',
          'Unexpected key "'
            + parsePlistXML(node.childNodes[i])
            + '" while parsing <dict/>.'
        );
        new_obj[key] = parsePlistXML(node.childNodes[i]);
      }
      counter += 1;
    }
    if (counter % 2 === 1) {
      new_obj[key] = '';
    }
    
    return new_obj;

  } else if (node.nodeName === 'array') {
    new_arr = [];
    if (isEmptyNode(node)) {
      return new_arr;
    }
    for (i=0; i < node.childNodes.length; i++) {
      if (!shouldIgnoreNode(node.childNodes[i])) {
        res = parsePlistXML(node.childNodes[i]);
        if (null != res) new_arr.push(res);
      }
    }
    return new_arr;

  } else if (node.nodeName === '#text') {
    // TODO: what should we do with text types? (CDATA sections)

  } else if (node.nodeName === 'key') {
    if (isEmptyNode(node)) {
      return '';
    }

    invariant(
      node.childNodes[0].nodeValue !== '__proto__',
      '__proto__ keys can lead to prototype pollution. More details on CVE-2022-22912'
    );

    return node.childNodes[0].nodeValue;
  } else if (node.nodeName === 'string') {
    res = '';
    if (isEmptyNode(node)) {
      return res;
    }
    for (i=0; i < node.childNodes.length; i++) {
      var type = node.childNodes[i].nodeType;
      if (type === TEXT_NODE || type === CDATA_NODE) {
        res += node.childNodes[i].nodeValue;
      }
    }
    return res;

  } else if (node.nodeName === 'integer') {
    invariant(
      !isEmptyNode(node),
      'Cannot parse "" as integer.'
    );
    return parseInt(node.childNodes[0].nodeValue, 10);

  } else if (node.nodeName === 'real') {
    invariant(
      !isEmptyNode(node),
      'Cannot parse "" as real.'
    );
    res = '';
    for (i=0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === TEXT_NODE) {
        res += node.childNodes[i].nodeValue;
      }
    }
    return parseFloat(res);

  } else if (node.nodeName === 'data') {
    res = '';
    if (isEmptyNode(node)) {
      return Buffer.from(res, 'base64');
    }
    for (i=0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === TEXT_NODE) {
        res += node.childNodes[i].nodeValue.replace(/\s+/g, '');
      }
    }
    return Buffer.from(res, 'base64');

  } else if (node.nodeName === 'date') {
    invariant(
      !isEmptyNode(node),
      'Cannot parse "" as Date.'
    )
    return new Date(node.childNodes[0].nodeValue);

  } else if (node.nodeName === 'null') {
    return null;

  } else if (node.nodeName === 'true') {
    return true;

  } else if (node.nodeName === 'false') {
    return false;
  } else {
    throw new Error('Invalid PLIST tag ' + node.nodeName);
  }
}


/***/ }),

/***/ 4399:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var __webpack_unused_export__;
function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML?htmlEntity.entityMap:{'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"};
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source && typeof source === 'string'){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		throw new ParseError(error, this.locator);
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var htmlEntity = __nccwpck_require__(2975);
var sax = __nccwpck_require__(7860);
var XMLReader = sax.XMLReader;
var ParseError = sax.ParseError;
var DOMImplementation = /* unused reexport */ __nccwpck_require__(7009).DOMImplementation;
/* unused reexport */ __nccwpck_require__(7009) ;
exports.a = DOMParser;
__webpack_unused_export__ = DOMHandler;
//}


/***/ }),

/***/ 7009:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;
function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	getElementsByClassName: function(className) {
		var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
		return new LiveNodeList(this, function(base) {
			var ls = [];
			_visitNode(base.documentElement, function(node) {
				if(node !== base && node.nodeType == ELEMENT_NODE) {
					if(pattern.test(node.getAttribute('class'))) {
						ls.push(node);
					}
				}
			});
			return ls;
		});
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			if (uri) {
				// Avoid empty namespace value like xmlns:ds=""
				// Empty namespace URL will we produce an invalid XML document
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		/**
		 * Well-formedness constraint: No < in Attribute Values
		 * The replacement text of any entity referred to directly or indirectly in an attribute value must not contain a <.
		 * @see https://www.w3.org/TR/xml/#CleanAttrVals
		 * @see https://www.w3.org/TR/xml/#NT-AttValue
		 */
		return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g,_xmlEncoder), '"');
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 */
		return buf.push(node.data
			.replace(/[<&]/g,_xmlEncoder)
			.replace(/]]>/g, ']]&gt;')
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	__webpack_unused_export__ = Node;
	__webpack_unused_export__ = DOMException;
	exports.DOMImplementation = DOMImplementation;
	__webpack_unused_export__ = XMLSerializer;
//}


/***/ }),

/***/ 2975:
/***/ ((__unused_webpack_module, exports) => {

exports.entityMap = {
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: "\u00a0",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
};


/***/ }),

/***/ 7860:
/***/ ((__unused_webpack_module, exports) => {

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (qname in el.attributeNames) errorHandler.fatalError('Attribute ' + qname + ' redefined')
		el.addValue(qname, value, startIndex)
	}
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName'); // No known test case
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				addAttribute(attrName, value, start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value.replace(/&#?\w+;/g,entityReplacer), start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;
exports.ParseError = ParseError;


/***/ }),

/***/ 1532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(785)
const { re, t } = __nccwpck_require__(9523)
const cmp = __nccwpck_require__(5098)
const debug = __nccwpck_require__(106)
const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim()

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',')
    const memoKey = `parseRange:${memoOpts}:${range}`
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const LRU = __nccwpck_require__(7129)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(785)
const Comparator = __nccwpck_require__(1532)
const debug = __nccwpck_require__(106)
const SemVer = __nccwpck_require__(8088)
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(9523)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceTilde(c, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceCaret(c, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((c) => {
    return replaceXRange(c, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(106)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(2293)
const { re, t } = __nccwpck_require__(9523)

const parseOptions = __nccwpck_require__(785)
const { compareIdentifiers } = __nccwpck_require__(2463)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 5098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gt = __nccwpck_require__(4123)
const gte = __nccwpck_require__(5522)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 3466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = __nccwpck_require__(5925)
const { re, t } = __nccwpck_require__(9523)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const eq = __nccwpck_require__(1898)

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff


/***/ }),

/***/ 1898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5522:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 6017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MAX_LENGTH } = __nccwpck_require__(2293)
const { re, t } = __nccwpck_require__(9523)
const SemVer = __nccwpck_require__(8088)

const parseOptions = __nccwpck_require__(785)
const parse = (version, options) => {
  options = parseOptions(options)

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),

/***/ 2866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 6417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 8701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 6055:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(9523)
const constants = __nccwpck_require__(2293)
const SemVer = __nccwpck_require__(8088)
const identifiers = __nccwpck_require__(2463)
const parse = __nccwpck_require__(5925)
const valid = __nccwpck_require__(9601)
const clean = __nccwpck_require__(8848)
const inc = __nccwpck_require__(900)
const diff = __nccwpck_require__(4297)
const major = __nccwpck_require__(6688)
const minor = __nccwpck_require__(8447)
const patch = __nccwpck_require__(2866)
const prerelease = __nccwpck_require__(4016)
const compare = __nccwpck_require__(4309)
const rcompare = __nccwpck_require__(6417)
const compareLoose = __nccwpck_require__(2804)
const compareBuild = __nccwpck_require__(2156)
const sort = __nccwpck_require__(1426)
const rsort = __nccwpck_require__(8701)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gte = __nccwpck_require__(5522)
const lte = __nccwpck_require__(7520)
const cmp = __nccwpck_require__(5098)
const coerce = __nccwpck_require__(3466)
const Comparator = __nccwpck_require__(1532)
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const toComparators = __nccwpck_require__(2706)
const maxSatisfying = __nccwpck_require__(579)
const minSatisfying = __nccwpck_require__(832)
const minVersion = __nccwpck_require__(4179)
const validRange = __nccwpck_require__(2098)
const outside = __nccwpck_require__(420)
const gtr = __nccwpck_require__(9380)
const ltr = __nccwpck_require__(3323)
const intersects = __nccwpck_require__(7008)
const simplifyRange = __nccwpck_require__(5297)
const subset = __nccwpck_require__(7863)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 2293:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH,
}


/***/ }),

/***/ 106:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 2463:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 785:
/***/ ((module) => {

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl']
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((o, k) => {
    o[k] = true
    return o
  }, {})
module.exports = parseOptions


/***/ }),

/***/ 9523:
/***/ ((module, exports, __nccwpck_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH } = __nccwpck_require__(2293)
const debug = __nccwpck_require__(106)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(420)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}
module.exports = intersects


/***/ }),

/***/ 3323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(420)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 4179:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const gt = __nccwpck_require__(4123)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 420:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)
const gte = __nccwpck_require__(5522)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 7863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = [new Comparator('>=0.0.0-0')]
    } else {
      sub = [new Comparator('>=0.0.0')]
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = [new Comparator('>=0.0.0')]
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 2706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 2098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 2707:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 5859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __nccwpck_require__(6113);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(5859);
var bytesToUuid = __nccwpck_require__(2707);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 2839:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  module.exports = {
    Disconnected: 1,
    Preceding: 2,
    Following: 4,
    Contains: 8,
    ContainedBy: 16,
    ImplementationSpecific: 32
  };

}).call(this);


/***/ }),

/***/ 9267:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  module.exports = {
    Element: 1,
    Attribute: 2,
    Text: 3,
    CData: 4,
    EntityReference: 5,
    EntityDeclaration: 6,
    ProcessingInstruction: 7,
    Comment: 8,
    Document: 9,
    DocType: 10,
    DocumentFragment: 11,
    NotationDeclaration: 12,
    // Numeric codes up to 200 are reserved to W3C for possible future use.
    // Following are types internal to this library:
    Declaration: 201,
    Raw: 202,
    AttributeDeclaration: 203,
    ElementDeclaration: 204,
    Dummy: 205
  };

}).call(this);


/***/ }),

/***/ 8229:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Copies all enumerable own properties from `sources` to `target`
  var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject,
    hasProp = {}.hasOwnProperty;

  assign = function(target, ...sources) {
    var i, key, len, source;
    if (isFunction(Object.assign)) {
      Object.assign.apply(null, arguments);
    } else {
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        if (source != null) {
          for (key in source) {
            if (!hasProp.call(source, key)) continue;
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  // Determines if `val` is a Function object
  isFunction = function(val) {
    return !!val && Object.prototype.toString.call(val) === '[object Function]';
  };

  // Determines if `val` is an Object
  isObject = function(val) {
    var ref;
    return !!val && ((ref = typeof val) === 'function' || ref === 'object');
  };

  // Determines if `val` is an Array
  isArray = function(val) {
    if (isFunction(Array.isArray)) {
      return Array.isArray(val);
    } else {
      return Object.prototype.toString.call(val) === '[object Array]';
    }
  };

  // Determines if `val` is an empty Array or an Object with no own properties
  isEmpty = function(val) {
    var key;
    if (isArray(val)) {
      return !val.length;
    } else {
      for (key in val) {
        if (!hasProp.call(val, key)) continue;
        return false;
      }
      return true;
    }
  };

  // Determines if `val` is a plain Object
  isPlainObject = function(val) {
    var ctor, proto;
    return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
  };

  // Gets the primitive value of an object
  getValue = function(obj) {
    if (isFunction(obj.valueOf)) {
      return obj.valueOf();
    } else {
      return obj;
    }
  };

  module.exports.assign = assign;

  module.exports.isFunction = isFunction;

  module.exports.isObject = isObject;

  module.exports.isArray = isArray;

  module.exports.isEmpty = isEmpty;

  module.exports.isPlainObject = isPlainObject;

  module.exports.getValue = getValue;

}).call(this);


/***/ }),

/***/ 9766:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  module.exports = {
    None: 0,
    OpenTag: 1,
    InsideTag: 2,
    CloseTag: 3
  };

}).call(this);


/***/ }),

/***/ 8376:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLAttribute, XMLNode;

  NodeType = __nccwpck_require__(9267);

  XMLNode = __nccwpck_require__(7608);

  // Represents an attribute
  module.exports = XMLAttribute = (function() {
    class XMLAttribute {
      // Initializes a new instance of `XMLAttribute`

      // `parent` the parent node
      // `name` attribute target
      // `value` attribute value
      constructor(parent, name, value) {
        this.parent = parent;
        if (this.parent) {
          this.options = this.parent.options;
          this.stringify = this.parent.stringify;
        }
        if (name == null) {
          throw new Error("Missing attribute name. " + this.debugInfo(name));
        }
        this.name = this.stringify.name(name);
        this.value = this.stringify.attValue(value);
        this.type = NodeType.Attribute;
        // DOM level 3
        this.isId = false;
        this.schemaTypeInfo = null;
      }

      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }

      // Converts the XML fragment to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
      }

      
      // Returns debug string for this node
      debugInfo(name) {
        name = name || this.name;
        if (name == null) {
          return "parent: <" + this.parent.name + ">";
        } else {
          return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
        }
      }

      isEqualNode(node) {
        if (node.namespaceURI !== this.namespaceURI) {
          return false;
        }
        if (node.prefix !== this.prefix) {
          return false;
        }
        if (node.localName !== this.localName) {
          return false;
        }
        if (node.value !== this.value) {
          return false;
        }
        return true;
      }

    };

    // DOM level 1
    Object.defineProperty(XMLAttribute.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'ownerElement', {
      get: function() {
        return this.parent;
      }
    });

    // DOM level 3
    Object.defineProperty(XMLAttribute.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    // DOM level 4
    Object.defineProperty(XMLAttribute.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'specified', {
      get: function() {
        return true;
      }
    });

    return XMLAttribute;

  }).call(this);

}).call(this);


/***/ }),

/***/ 333:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLCData, XMLCharacterData;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  // Represents a  CDATA node
  module.exports = XMLCData = class XMLCData extends XMLCharacterData {
    // Initializes a new instance of `XMLCData`

    // `text` CDATA text
    constructor(parent, text) {
      super(parent);
      if (text == null) {
        throw new Error("Missing CDATA text. " + this.debugInfo());
      }
      this.name = "#cdata-section";
      this.type = NodeType.CData;
      this.value = this.stringify.cdata(text);
    }

    // Creates and returns a deep clone of `this`
    clone() {
      return Object.create(this);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 7709:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var XMLCharacterData, XMLNode;

  XMLNode = __nccwpck_require__(7608);

  // Represents a character data node
  module.exports = XMLCharacterData = (function() {
    class XMLCharacterData extends XMLNode {
      // Initializes a new instance of `XMLCharacterData`

      constructor(parent) {
        super(parent);
        this.value = '';
      }

      
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }

      // DOM level 1 functions to be implemented later
      substringData(offset, count) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      appendData(arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      insertData(offset, arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      deleteData(offset, count) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      replaceData(offset, count, arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      isEqualNode(node) {
        if (!super.isEqualNode(node)) {
          return false;
        }
        if (node.data !== this.data) {
          return false;
        }
        return true;
      }

    };

    // DOM level 1
    Object.defineProperty(XMLCharacterData.prototype, 'data', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    Object.defineProperty(XMLCharacterData.prototype, 'length', {
      get: function() {
        return this.value.length;
      }
    });

    // DOM level 3
    Object.defineProperty(XMLCharacterData.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    return XMLCharacterData;

  }).call(this);

}).call(this);


/***/ }),

/***/ 4407:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLCharacterData, XMLComment;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  // Represents a comment node
  module.exports = XMLComment = class XMLComment extends XMLCharacterData {
    // Initializes a new instance of `XMLComment`

    // `text` comment text
    constructor(parent, text) {
      super(parent);
      if (text == null) {
        throw new Error("Missing comment text. " + this.debugInfo());
      }
      this.name = "#comment";
      this.type = NodeType.Comment;
      this.value = this.stringify.comment(text);
    }

    // Creates and returns a deep clone of `this`
    clone() {
      return Object.create(this);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.comment(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 7465:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;

  XMLDOMErrorHandler = __nccwpck_require__(6744);

  XMLDOMStringList = __nccwpck_require__(7028);

  // Implements the DOMConfiguration interface
  module.exports = XMLDOMConfiguration = (function() {
    class XMLDOMConfiguration {
      constructor() {
        var clonedSelf;
        this.defaultParams = {
          "canonical-form": false,
          "cdata-sections": false,
          "comments": false,
          "datatype-normalization": false,
          "element-content-whitespace": true,
          "entities": true,
          "error-handler": new XMLDOMErrorHandler(),
          "infoset": true,
          "validate-if-schema": false,
          "namespaces": true,
          "namespace-declarations": true,
          "normalize-characters": false,
          "schema-location": '',
          "schema-type": '',
          "split-cdata-sections": true,
          "validate": false,
          "well-formed": true
        };
        this.params = clonedSelf = Object.create(this.defaultParams);
      }

      // Gets the value of a parameter.

      // `name` name of the parameter
      getParameter(name) {
        if (this.params.hasOwnProperty(name)) {
          return this.params[name];
        } else {
          return null;
        }
      }

      // Checks if setting a parameter to a specific value is supported.

      // `name` name of the parameter
      // `value` parameter value
      canSetParameter(name, value) {
        return true;
      }

      // Sets the value of a parameter.

      // `name` name of the parameter
      // `value` new value or null if the user wishes to unset the parameter
      setParameter(name, value) {
        if (value != null) {
          return this.params[name] = value;
        } else {
          return delete this.params[name];
        }
      }

    };

    // Returns the list of parameter names
    Object.defineProperty(XMLDOMConfiguration.prototype, 'parameterNames', {
      get: function() {
        return new XMLDOMStringList(Object.keys(this.defaultParams));
      }
    });

    return XMLDOMConfiguration;

  }).call(this);

}).call(this);


/***/ }),

/***/ 6744:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Represents the error handler for DOM operations
  var XMLDOMErrorHandler;

  module.exports = XMLDOMErrorHandler = class XMLDOMErrorHandler {
    // Initializes a new instance of `XMLDOMErrorHandler`

    constructor() {}

    // Called on the error handler when an error occurs.

    // `error` the error message as a string
    handleError(error) {
      throw new Error(error);
    }

  };

}).call(this);


/***/ }),

/***/ 5861:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Implements the DOMImplementation interface
  var XMLDOMImplementation;

  module.exports = XMLDOMImplementation = class XMLDOMImplementation {
    // Tests if the DOM implementation implements a specific feature.

    // `feature` package name of the feature to test. In Level 1, the
    //           legal values are "HTML" and "XML" (case-insensitive).
    // `version` version number of the package name to test. 
    //           In Level 1, this is the string "1.0". If the version is 
    //           not specified, supporting any version of the feature will 
    //           cause the method to return true.
    hasFeature(feature, version) {
      return true;
    }

    // Creates a new document type declaration.

    // `qualifiedName` qualified name of the document type to be created
    // `publicId` public identifier of the external subset
    // `systemId` system identifier of the external subset
    createDocumentType(qualifiedName, publicId, systemId) {
      throw new Error("This DOM method is not implemented.");
    }

    // Creates a new document.

    // `namespaceURI` namespace URI of the document element to create
    // `qualifiedName` the qualified name of the document to be created
    // `doctype` the type of document to be created or null
    createDocument(namespaceURI, qualifiedName, doctype) {
      throw new Error("This DOM method is not implemented.");
    }

    // Creates a new HTML document.

    // `title` document title
    createHTMLDocument(title) {
      throw new Error("This DOM method is not implemented.");
    }

    // Returns a specialized object which implements the specialized APIs 
    // of the specified feature and version.

    // `feature` name of the feature requested.
    // `version` version number of the feature to test
    getFeature(feature, version) {
      throw new Error("This DOM method is not implemented.");
    }

  };

}).call(this);


/***/ }),

/***/ 7028:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Represents a list of string entries
  var XMLDOMStringList;

  module.exports = XMLDOMStringList = (function() {
    class XMLDOMStringList {
      // Initializes a new instance of `XMLDOMStringList`
      // This is just a wrapper around an ordinary
      // JS array.

      // `arr` the array of string values
      constructor(arr) {
        this.arr = arr || [];
      }

      // Returns the indexth item in the collection.

      // `index` index into the collection
      item(index) {
        return this.arr[index] || null;
      }

      // Test if a string is part of this DOMStringList.

      // `str` the string to look for
      contains(str) {
        return this.arr.indexOf(str) !== -1;
      }

    };

    // Returns the number of strings in the list.
    Object.defineProperty(XMLDOMStringList.prototype, 'length', {
      get: function() {
        return this.arr.length;
      }
    });

    return XMLDOMStringList;

  }).call(this);

}).call(this);


/***/ }),

/***/ 1015:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDTDAttList, XMLNode;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents an attribute list
  module.exports = XMLDTDAttList = class XMLDTDAttList extends XMLNode {
    // Initializes a new instance of `XMLDTDAttList`

    // `parent` the parent `XMLDocType` element
    // `elementName` the name of the element containing this attribute
    // `attributeName` attribute name
    // `attributeType` type of the attribute
    // `defaultValueType` default value type (either #REQUIRED, #IMPLIED,
    //                    #FIXED or #DEFAULT)
    // `defaultValue` default value of the attribute
    //                (only used for #FIXED or #DEFAULT)
    constructor(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      super(parent);
      if (elementName == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      this.elementName = this.stringify.name(elementName);
      this.type = NodeType.AttributeDeclaration;
      this.attributeName = this.stringify.name(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      if (defaultValue) {
        this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      }
      this.defaultValueType = defaultValueType;
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 2421:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDTDElement, XMLNode;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents an attribute
  module.exports = XMLDTDElement = class XMLDTDElement extends XMLNode {
    // Initializes a new instance of `XMLDTDElement`

    // `parent` the parent `XMLDocType` element
    // `name` element name
    // `value` element content (defaults to #PCDATA)
    constructor(parent, name, value) {
      super(parent);
      if (name == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.ElementDeclaration;
      this.value = this.stringify.dtdElementValue(value);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 53:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDTDEntity, XMLNode, isObject;

  ({isObject} = __nccwpck_require__(8229));

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents an entity declaration in the DTD
  module.exports = XMLDTDEntity = (function() {
    class XMLDTDEntity extends XMLNode {
      // Initializes a new instance of `XMLDTDEntity`

      // `parent` the parent `XMLDocType` element
      // `pe` whether this is a parameter entity or a general entity
      //      defaults to `false` (general entity)
      // `name` the name of the entity
      // `value` internal entity value or an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      // `value.nData` notation declaration
      constructor(parent, pe, name, value) {
        super(parent);
        if (name == null) {
          throw new Error("Missing DTD entity name. " + this.debugInfo(name));
        }
        if (value == null) {
          throw new Error("Missing DTD entity value. " + this.debugInfo(name));
        }
        this.pe = !!pe;
        this.name = this.stringify.name(name);
        this.type = NodeType.EntityDeclaration;
        if (!isObject(value)) {
          this.value = this.stringify.dtdEntityValue(value);
          this.internal = true;
        } else {
          if (!value.pubID && !value.sysID) {
            throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          if (value.pubID && !value.sysID) {
            throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
          }
          this.internal = false;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
          if (value.nData != null) {
            this.nData = this.stringify.dtdNData(value.nData);
          }
          if (this.pe && this.nData) {
            throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
          }
        }
      }

      // Converts the XML fragment to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
      }

    };

    // DOM level 1
    Object.defineProperty(XMLDTDEntity.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'notationName', {
      get: function() {
        return this.nData || null;
      }
    });

    // DOM level 3
    Object.defineProperty(XMLDTDEntity.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlVersion', {
      get: function() {
        return null;
      }
    });

    return XMLDTDEntity;

  }).call(this);

}).call(this);


/***/ }),

/***/ 2837:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDTDNotation, XMLNode;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents a NOTATION entry in the DTD
  module.exports = XMLDTDNotation = (function() {
    class XMLDTDNotation extends XMLNode {
      // Initializes a new instance of `XMLDTDNotation`

      // `parent` the parent `XMLDocType` element
      // `name` the name of the notation
      // `value` an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      constructor(parent, name, value) {
        super(parent);
        if (name == null) {
          throw new Error("Missing DTD notation name. " + this.debugInfo(name));
        }
        if (!value.pubID && !value.sysID) {
          throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
        }
        this.name = this.stringify.name(name);
        this.type = NodeType.NotationDeclaration;
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
      }

      // Converts the XML fragment to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
      }

    };

    // DOM level 1
    Object.defineProperty(XMLDTDNotation.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDNotation.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    return XMLDTDNotation;

  }).call(this);

}).call(this);


/***/ }),

/***/ 6364:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDeclaration, XMLNode, isObject;

  ({isObject} = __nccwpck_require__(8229));

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents the XML declaration
  module.exports = XMLDeclaration = class XMLDeclaration extends XMLNode {
    // Initializes a new instance of `XMLDeclaration`

    // `parent` the document object

    // `version` A version number string, e.g. 1.0
    // `encoding` Encoding declaration, e.g. UTF-8
    // `standalone` standalone document declaration: true or false
    constructor(parent, version, encoding, standalone) {
      super(parent);
      // arguments may also be passed as an object
      if (isObject(version)) {
        ({version, encoding, standalone} = version);
      }
      if (!version) {
        version = '1.0';
      }
      this.type = NodeType.Declaration;
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    // Converts to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 1801:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject;

  ({isObject} = __nccwpck_require__(8229));

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLNamedNodeMap = __nccwpck_require__(4361);

  // Represents doctype declaration
  module.exports = XMLDocType = (function() {
    class XMLDocType extends XMLNode {
      // Initializes a new instance of `XMLDocType`

      // `parent` the document object

      // `pubID` public identifier of the external subset
      // `sysID` system identifier of the external subset
      constructor(parent, pubID, sysID) {
        var child, i, len, ref;
        super(parent);
        this.type = NodeType.DocType;
        // set DTD name to the name of the root node
        if (parent.children) {
          ref = parent.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType.Element) {
              this.name = child.name;
              break;
            }
          }
        }
        this.documentObject = parent;
        // arguments may also be passed as an object
        if (isObject(pubID)) {
          ({pubID, sysID} = pubID);
        }
        if (sysID == null) {
          [sysID, pubID] = [pubID, sysID];
        }
        if (pubID != null) {
          this.pubID = this.stringify.dtdPubID(pubID);
        }
        if (sysID != null) {
          this.sysID = this.stringify.dtdSysID(sysID);
        }
      }

      // Creates an element type declaration

      // `name` element name
      // `value` element content (defaults to #PCDATA)
      element(name, value) {
        var child;
        child = new XMLDTDElement(this, name, value);
        this.children.push(child);
        return this;
      }

      // Creates an attribute declaration

      // `elementName` the name of the element containing this attribute
      // `attributeName` attribute name
      // `attributeType` type of the attribute (defaults to CDATA)
      // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
      //                    #DEFAULT) (defaults to #IMPLIED)
      // `defaultValue` default value of the attribute
      //                (only used for #FIXED or #DEFAULT)
      attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        var child;
        child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
        this.children.push(child);
        return this;
      }

      // Creates a general entity declaration

      // `name` the name of the entity
      // `value` internal entity value or an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      // `value.nData` notation declaration
      entity(name, value) {
        var child;
        child = new XMLDTDEntity(this, false, name, value);
        this.children.push(child);
        return this;
      }

      // Creates a parameter entity declaration

      // `name` the name of the entity
      // `value` internal entity value or an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      pEntity(name, value) {
        var child;
        child = new XMLDTDEntity(this, true, name, value);
        this.children.push(child);
        return this;
      }

      // Creates a NOTATION declaration

      // `name` the name of the notation
      // `value` an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      notation(name, value) {
        var child;
        child = new XMLDTDNotation(this, name, value);
        this.children.push(child);
        return this;
      }

      // Converts to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.docType(this, this.options.writer.filterOptions(options));
      }

      // Aliases
      ele(name, value) {
        return this.element(name, value);
      }

      att(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
      }

      ent(name, value) {
        return this.entity(name, value);
      }

      pent(name, value) {
        return this.pEntity(name, value);
      }

      not(name, value) {
        return this.notation(name, value);
      }

      up() {
        return this.root() || this.documentObject;
      }

      isEqualNode(node) {
        if (!super.isEqualNode(node)) {
          return false;
        }
        if (node.name !== this.name) {
          return false;
        }
        if (node.publicId !== this.publicId) {
          return false;
        }
        if (node.systemId !== this.systemId) {
          return false;
        }
        return true;
      }

    };

    // DOM level 1
    Object.defineProperty(XMLDocType.prototype, 'entities', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if ((child.type === NodeType.EntityDeclaration) && !child.pe) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'notations', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.NotationDeclaration) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    // DOM level 2
    Object.defineProperty(XMLDocType.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'internalSubset', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    return XMLDocType;

  }).call(this);

}).call(this);


/***/ }),

/***/ 3730:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject;

  ({isPlainObject} = __nccwpck_require__(8229));

  XMLDOMImplementation = __nccwpck_require__(5861);

  XMLDOMConfiguration = __nccwpck_require__(7465);

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  // Represents an XML builder
  module.exports = XMLDocument = (function() {
    class XMLDocument extends XMLNode {
      // Initializes a new instance of `XMLDocument`

      // `options.keepNullNodes` whether nodes with null values will be kept
      //     or ignored: true or false
      // `options.keepNullAttributes` whether attributes with null values will be
      //     kept or ignored: true or false
      // `options.ignoreDecorators` whether decorator strings will be ignored when
      //     converting JS objects: true or false
      // `options.separateArrayItems` whether array items are created as separate
      //     nodes when passed as an object value: true or false
      // `options.noDoubleEncoding` whether existing html entities are encoded:
      //     true or false
      // `options.stringify` a set of functions to use for converting values to
      //     strings
      // `options.writer` the default XML writer to use for converting nodes to
      //     string. If the default writer is not set, the built-in XMLStringWriter
      //     will be used instead.
      constructor(options) {
        super(null);
        this.name = "#document";
        this.type = NodeType.Document;
        this.documentURI = null;
        this.domConfig = new XMLDOMConfiguration();
        options || (options = {});
        if (!options.writer) {
          options.writer = new XMLStringWriter();
        }
        this.options = options;
        this.stringify = new XMLStringifier(options);
      }

      // Ends the document and passes it to the given XML writer

      // `writer` is either an XML writer or a plain object to pass to the
      // constructor of the default XML writer. The default writer is assigned when
      // creating the XML document. Following flags are recognized by the
      // built-in XMLStringWriter:
      //   `writer.pretty` pretty prints the result
      //   `writer.indent` indentation for pretty print
      //   `writer.offset` how many indentations to add to every line for pretty print
      //   `writer.newline` newline sequence for pretty print
      end(writer) {
        var writerOptions;
        writerOptions = {};
        if (!writer) {
          writer = this.options.writer;
        } else if (isPlainObject(writer)) {
          writerOptions = writer;
          writer = this.options.writer;
        }
        return writer.document(this, writer.filterOptions(writerOptions));
      }

      // Converts the XML document to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.document(this, this.options.writer.filterOptions(options));
      }

      // DOM level 1 functions to be implemented later
      createElement(tagName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createDocumentFragment() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createTextNode(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createComment(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createCDATASection(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createProcessingInstruction(target, data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createAttribute(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createEntityReference(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByTagName(tagname) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM level 2 functions to be implemented later
      importNode(importedNode, deep) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createElementNS(namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createAttributeNS(namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByTagNameNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementById(elementId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM level 3 functions to be implemented later
      adoptNode(source) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      normalizeDocument() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      renameNode(node, namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM level 4 functions to be implemented later
      getElementsByClassName(classNames) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createEvent(eventInterface) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createRange() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createNodeIterator(root, whatToShow, filter) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      createTreeWalker(root, whatToShow, filter) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

    };

    // DOM level 1
    Object.defineProperty(XMLDocument.prototype, 'implementation', {
      value: new XMLDOMImplementation()
    });

    Object.defineProperty(XMLDocument.prototype, 'doctype', {
      get: function() {
        var child, i, len, ref;
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.DocType) {
            return child;
          }
        }
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'documentElement', {
      get: function() {
        return this.rootObject || null;
      }
    });

    // DOM level 3
    Object.defineProperty(XMLDocument.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'strictErrorChecking', {
      get: function() {
        return false;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlEncoding', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].encoding;
        } else {
          return null;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlStandalone', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].standalone === 'yes';
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlVersion', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].version;
        } else {
          return "1.0";
        }
      }
    });

    // DOM level 4
    Object.defineProperty(XMLDocument.prototype, 'URL', {
      get: function() {
        return this.documentURI;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'origin', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'compatMode', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'characterSet', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'contentType', {
      get: function() {
        return null;
      }
    });

    return XMLDocument;

  }).call(this);

}).call(this);


/***/ }),

/***/ 7356:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject,
    hasProp = {}.hasOwnProperty;

  ({isObject, isFunction, isPlainObject, getValue} = __nccwpck_require__(8229));

  NodeType = __nccwpck_require__(9267);

  XMLDocument = __nccwpck_require__(3730);

  XMLElement = __nccwpck_require__(9437);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLAttribute = __nccwpck_require__(8376);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  WriterState = __nccwpck_require__(9766);

  // Represents an XML builder
  module.exports = XMLDocumentCB = class XMLDocumentCB {
    // Initializes a new instance of `XMLDocumentCB`

    // `options.keepNullNodes` whether nodes with null values will be kept
    //     or ignored: true or false
    // `options.keepNullAttributes` whether attributes with null values will be
    //     kept or ignored: true or false
    // `options.ignoreDecorators` whether decorator strings will be ignored when
    //     converting JS objects: true or false
    // `options.separateArrayItems` whether array items are created as separate
    //     nodes when passed as an object value: true or false
    // `options.noDoubleEncoding` whether existing html entities are encoded:
    //     true or false
    // `options.stringify` a set of functions to use for converting values to
    //     strings
    // `options.writer` the default XML writer to use for converting nodes to
    //     string. If the default writer is not set, the built-in XMLStringWriter
    //     will be used instead.

    // `onData` the function to be called when a new chunk of XML is output. The
    //          string containing the XML chunk is passed to `onData` as its first
    //          argument, and the current indentation level as its second argument.
    // `onEnd`  the function to be called when the XML document is completed with
    //          `end`. `onEnd` does not receive any arguments.
    constructor(options, onData, onEnd) {
      var writerOptions;
      this.name = "?xml";
      this.type = NodeType.Document;
      options || (options = {});
      writerOptions = {};
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      } else if (isPlainObject(options.writer)) {
        writerOptions = options.writer;
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.writer = options.writer;
      this.writerOptions = this.writer.filterOptions(writerOptions);
      this.stringify = new XMLStringifier(options);
      this.onDataCallback = onData || function() {};
      this.onEndCallback = onEnd || function() {};
      this.currentNode = null;
      this.currentLevel = -1;
      this.openTags = {};
      this.documentStarted = false;
      this.documentCompleted = false;
      this.root = null;
    }

    // Creates a child element node from the given XMLNode

    // `node` the child node
    createChildNode(node) {
      var att, attName, attributes, child, i, len, ref, ref1;
      switch (node.type) {
        case NodeType.CData:
          this.cdata(node.value);
          break;
        case NodeType.Comment:
          this.comment(node.value);
          break;
        case NodeType.Element:
          attributes = {};
          ref = node.attribs;
          for (attName in ref) {
            if (!hasProp.call(ref, attName)) continue;
            att = ref[attName];
            attributes[attName] = att.value;
          }
          this.node(node.name, attributes);
          break;
        case NodeType.Dummy:
          this.dummy();
          break;
        case NodeType.Raw:
          this.raw(node.value);
          break;
        case NodeType.Text:
          this.text(node.value);
          break;
        case NodeType.ProcessingInstruction:
          this.instruction(node.target, node.value);
          break;
        default:
          throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
      }
      ref1 = node.children;
      // write child nodes recursively
      for (i = 0, len = ref1.length; i < len; i++) {
        child = ref1[i];
        this.createChildNode(child);
        if (child.type === NodeType.Element) {
          this.up();
        }
      }
      return this;
    }

    // Creates a dummy node

    dummy() {
      // no-op, just return this
      return this;
    }

    // Creates a node

    // `name` name of the node
    // `attributes` an object containing name/value pairs of attributes
    // `text` element text
    node(name, attributes, text) {
      if (name == null) {
        throw new Error("Missing node name.");
      }
      if (this.root && this.currentLevel === -1) {
        throw new Error("Document can only have one root node. " + this.debugInfo(name));
      }
      this.openCurrent();
      name = getValue(name);
      if (attributes == null) {
        attributes = {};
      }
      attributes = getValue(attributes);
      // swap argument order: text <-> attributes
      if (!isObject(attributes)) {
        [text, attributes] = [attributes, text];
      }
      this.currentNode = new XMLElement(this, name, attributes);
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      if (text != null) {
        this.text(text);
      }
      return this;
    }

    // Creates a child element node or an element type declaration when called
    // inside the DTD

    // `name` name of the node
    // `attributes` an object containing name/value pairs of attributes
    // `text` element text
    element(name, attributes, text) {
      var child, i, len, oldValidationFlag, ref, root;
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        this.dtdElement(...arguments);
      } else {
        if (Array.isArray(name) || isObject(name) || isFunction(name)) {
          oldValidationFlag = this.options.noValidation;
          this.options.noValidation = true;
          root = new XMLDocument(this.options).element('TEMP_ROOT');
          root.element(name);
          this.options.noValidation = oldValidationFlag;
          ref = root.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
        } else {
          this.node(name, attributes, text);
        }
      }
      return this;
    }

    // Adds or modifies an attribute

    // `name` attribute name
    // `value` attribute value
    attribute(name, value) {
      var attName, attValue;
      if (!this.currentNode || this.currentNode.children) {
        throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
      }
      if (name != null) {
        name = getValue(name);
      }
      if (isObject(name)) { // expand if object
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (this.options.keepNullAttributes && (value == null)) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
        } else if (value != null) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    }

    // Creates a text node

    // `value` element text
    text(value) {
      var node;
      this.openCurrent();
      node = new XMLText(this, value);
      this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates a CDATA node

    // `value` element text without CDATA delimiters
    cdata(value) {
      var node;
      this.openCurrent();
      node = new XMLCData(this, value);
      this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates a comment node

    // `value` comment text
    comment(value) {
      var node;
      this.openCurrent();
      node = new XMLComment(this, value);
      this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Adds unescaped raw text

    // `value` text
    raw(value) {
      var node;
      this.openCurrent();
      node = new XMLRaw(this, value);
      this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Adds a processing instruction

    // `target` instruction target
    // `value` instruction value
    instruction(target, value) {
      var i, insTarget, insValue, len, node;
      this.openCurrent();
      if (target != null) {
        target = getValue(target);
      }
      if (value != null) {
        value = getValue(value);
      }
      if (Array.isArray(target)) { // expand if array
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) { // expand if object
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        node = new XMLProcessingInstruction(this, target, value);
        this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      }
      return this;
    }

    // Creates the xml declaration

    // `version` A version number string, e.g. 1.0
    // `encoding` Encoding declaration, e.g. UTF-8
    // `standalone` standalone document declaration: true or false
    declaration(version, encoding, standalone) {
      var node;
      this.openCurrent();
      if (this.documentStarted) {
        throw new Error("declaration() must be the first node.");
      }
      node = new XMLDeclaration(this, version, encoding, standalone);
      this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates the document type declaration

    // `root`  the name of the root node
    // `pubID` the public identifier of the external subset
    // `sysID` the system identifier of the external subset
    doctype(root, pubID, sysID) {
      this.openCurrent();
      if (root == null) {
        throw new Error("Missing root node name.");
      }
      if (this.root) {
        throw new Error("dtd() must come before the root node.");
      }
      this.currentNode = new XMLDocType(this, pubID, sysID);
      this.currentNode.rootNodeName = root;
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      return this;
    }

    // Creates an element type declaration

    // `name` element name
    // `value` element content (defaults to #PCDATA)
    dtdElement(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDElement(this, name, value);
      this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates an attribute declaration

    // `elementName` the name of the element containing this attribute
    // `attributeName` attribute name
    // `attributeType` type of the attribute (defaults to CDATA)
    // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
    //                    #DEFAULT) (defaults to #IMPLIED)
    // `defaultValue` default value of the attribute
    //                (only used for #FIXED or #DEFAULT)
    attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var node;
      this.openCurrent();
      node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates a general entity declaration

    // `name` the name of the entity
    // `value` internal entity value or an object with external entity details
    // `value.pubID` public identifier
    // `value.sysID` system identifier
    // `value.nData` notation declaration
    entity(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, false, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates a parameter entity declaration

    // `name` the name of the entity
    // `value` internal entity value or an object with external entity details
    // `value.pubID` public identifier
    // `value.sysID` system identifier
    pEntity(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, true, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Creates a NOTATION declaration

    // `name` the name of the notation
    // `value` an object with external entity details
    // `value.pubID` public identifier
    // `value.sysID` system identifier
    notation(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDNotation(this, name, value);
      this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    }

    // Gets the parent node
    up() {
      if (this.currentLevel < 0) {
        throw new Error("The document node has no parent.");
      }
      if (this.currentNode) {
        if (this.currentNode.children) {
          this.closeNode(this.currentNode);
        } else {
          this.openNode(this.currentNode);
        }
        this.currentNode = null;
      } else {
        this.closeNode(this.openTags[this.currentLevel]);
      }
      delete this.openTags[this.currentLevel];
      this.currentLevel--;
      return this;
    }

    // Ends the document
    end() {
      while (this.currentLevel >= 0) {
        this.up();
      }
      return this.onEnd();
    }

    // Opens the current parent node
    openCurrent() {
      if (this.currentNode) {
        this.currentNode.children = true;
        return this.openNode(this.currentNode);
      }
    }

    // Writes the opening tag of the current node or the entire node if it has
    // no child nodes
    openNode(node) {
      var att, chunk, name, ref;
      if (!node.isOpen) {
        if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
          this.root = node;
        }
        chunk = '';
        if (node.type === NodeType.Element) {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<' + node.name;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
          }
          chunk += (node.children ? '>' : '/>') + this.writer.endline(node, this.writerOptions, this.currentLevel);
          this.writerOptions.state = WriterState.InsideTag; // if node.type is NodeType.DocType
        } else {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<!DOCTYPE ' + node.rootNodeName;
          
          // external identifier
          if (node.pubID && node.sysID) {
            chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            chunk += ' SYSTEM "' + node.sysID + '"';
          }
          
          // internal subset
          if (node.children) {
            chunk += ' [';
            this.writerOptions.state = WriterState.InsideTag;
          } else {
            this.writerOptions.state = WriterState.CloseTag;
            chunk += '>';
          }
          chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.onData(chunk, this.currentLevel);
        return node.isOpen = true;
      }
    }

    // Writes the closing tag of the current node
    closeNode(node) {
      var chunk;
      if (!node.isClosed) {
        chunk = '';
        this.writerOptions.state = WriterState.CloseTag;
        if (node.type === NodeType.Element) {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '</' + node.name + '>' + this.writer.endline(node, this.writerOptions, this.currentLevel); // if node.type is NodeType.DocType
        } else {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + ']>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.writerOptions.state = WriterState.None;
        this.onData(chunk, this.currentLevel);
        return node.isClosed = true;
      }
    }

    // Called when a new chunk of XML is output

    // `chunk` a string containing the XML chunk
    // `level` current indentation level
    onData(chunk, level) {
      this.documentStarted = true;
      return this.onDataCallback(chunk, level + 1);
    }

    // Called when the XML document is completed
    onEnd() {
      this.documentCompleted = true;
      return this.onEndCallback();
    }

    // Returns debug string
    debugInfo(name) {
      if (name == null) {
        return "";
      } else {
        return "node: <" + name + ">";
      }
    }

    // Node aliases
    ele() {
      return this.element(...arguments);
    }

    nod(name, attributes, text) {
      return this.node(name, attributes, text);
    }

    txt(value) {
      return this.text(value);
    }

    dat(value) {
      return this.cdata(value);
    }

    com(value) {
      return this.comment(value);
    }

    ins(target, value) {
      return this.instruction(target, value);
    }

    dec(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    }

    dtd(root, pubID, sysID) {
      return this.doctype(root, pubID, sysID);
    }

    e(name, attributes, text) {
      return this.element(name, attributes, text);
    }

    n(name, attributes, text) {
      return this.node(name, attributes, text);
    }

    t(value) {
      return this.text(value);
    }

    d(value) {
      return this.cdata(value);
    }

    c(value) {
      return this.comment(value);
    }

    r(value) {
      return this.raw(value);
    }

    i(target, value) {
      return this.instruction(target, value);
    }

    // Attribute aliases
    att() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList(...arguments);
      } else {
        return this.attribute(...arguments);
      }
    }

    a() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList(...arguments);
      } else {
        return this.attribute(...arguments);
      }
    }

    // DTD aliases
    // att() and ele() are defined above
    ent(name, value) {
      return this.entity(name, value);
    }

    pent(name, value) {
      return this.pEntity(name, value);
    }

    not(name, value) {
      return this.notation(name, value);
    }

  };

}).call(this);


/***/ }),

/***/ 3590:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLDummy, XMLNode;

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  // Represents a  raw node
  module.exports = XMLDummy = class XMLDummy extends XMLNode {
    // Initializes a new instance of `XMLDummy`

    // `XMLDummy` is a special node representing a node with 
    // a null value. Dummy nodes are created while recursively
    // building the XML tree. Simply skipping null values doesn't
    // work because that would break the recursive chain.
    constructor(parent) {
      super(parent);
      this.type = NodeType.Dummy;
    }

    // Creates and returns a deep clone of `this`
    clone() {
      return Object.create(this);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return '';
    }

  };

}).call(this);


/***/ }),

/***/ 9437:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject,
    hasProp = {}.hasOwnProperty;

  ({isObject, isFunction, getValue} = __nccwpck_require__(8229));

  XMLNode = __nccwpck_require__(7608);

  NodeType = __nccwpck_require__(9267);

  XMLAttribute = __nccwpck_require__(8376);

  XMLNamedNodeMap = __nccwpck_require__(4361);

  // Represents an element of the XML document
  module.exports = XMLElement = (function() {
    class XMLElement extends XMLNode {
      // Initializes a new instance of `XMLElement`

      // `parent` the parent node
      // `name` element name
      // `attributes` an object containing name/value pairs of attributes
      constructor(parent, name, attributes) {
        var child, j, len, ref;
        super(parent);
        if (name == null) {
          throw new Error("Missing element name. " + this.debugInfo());
        }
        this.name = this.stringify.name(name);
        this.type = NodeType.Element;
        this.attribs = {};
        this.schemaTypeInfo = null;
        if (attributes != null) {
          this.attribute(attributes);
        }
        // set properties if this is the root node
        if (parent.type === NodeType.Document) {
          this.isRoot = true;
          this.documentObject = parent;
          parent.rootObject = this;
          // set dtd name
          if (parent.children) {
            ref = parent.children;
            for (j = 0, len = ref.length; j < len; j++) {
              child = ref[j];
              if (child.type === NodeType.DocType) {
                child.name = this.name;
                break;
              }
            }
          }
        }
      }

      // Creates and returns a deep clone of `this`

      clone() {
        var att, attName, clonedSelf, ref;
        clonedSelf = Object.create(this);
        // remove document element
        if (clonedSelf.isRoot) {
          clonedSelf.documentObject = null;
        }
        // clone attributes
        clonedSelf.attribs = {};
        ref = this.attribs;
        for (attName in ref) {
          if (!hasProp.call(ref, attName)) continue;
          att = ref[attName];
          clonedSelf.attribs[attName] = att.clone();
        }
        // clone child nodes
        clonedSelf.children = [];
        this.children.forEach(function(child) {
          var clonedChild;
          clonedChild = child.clone();
          clonedChild.parent = clonedSelf;
          return clonedSelf.children.push(clonedChild);
        });
        return clonedSelf;
      }

      // Adds or modifies an attribute

      // `name` attribute name
      // `value` attribute value
      attribute(name, value) {
        var attName, attValue;
        if (name != null) {
          name = getValue(name);
        }
        if (isObject(name)) { // expand if object
          for (attName in name) {
            if (!hasProp.call(name, attName)) continue;
            attValue = name[attName];
            this.attribute(attName, attValue);
          }
        } else {
          if (isFunction(value)) {
            value = value.apply();
          }
          if (this.options.keepNullAttributes && (value == null)) {
            this.attribs[name] = new XMLAttribute(this, name, "");
          } else if (value != null) {
            this.attribs[name] = new XMLAttribute(this, name, value);
          }
        }
        return this;
      }

      // Removes an attribute

      // `name` attribute name
      removeAttribute(name) {
        var attName, j, len;
        // Also defined in DOM level 1
        // removeAttribute(name) removes an attribute by name.
        if (name == null) {
          throw new Error("Missing attribute name. " + this.debugInfo());
        }
        name = getValue(name);
        if (Array.isArray(name)) { // expand if array
          for (j = 0, len = name.length; j < len; j++) {
            attName = name[j];
            delete this.attribs[attName];
          }
        } else {
          delete this.attribs[name];
        }
        return this;
      }

      // Converts the XML fragment to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      // `options.allowEmpty` do not self close empty element tags
      toString(options) {
        return this.options.writer.element(this, this.options.writer.filterOptions(options));
      }

      // Aliases
      att(name, value) {
        return this.attribute(name, value);
      }

      a(name, value) {
        return this.attribute(name, value);
      }

      // DOM Level 1
      getAttribute(name) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name].value;
        } else {
          return null;
        }
      }

      setAttribute(name, value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getAttributeNode(name) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name];
        } else {
          return null;
        }
      }

      setAttributeNode(newAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      removeAttributeNode(oldAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByTagName(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM Level 2
      getAttributeNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      setAttributeNS(namespaceURI, qualifiedName, value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      removeAttributeNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getAttributeNodeNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      setAttributeNodeNS(newAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByTagNameNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      hasAttribute(name) {
        return this.attribs.hasOwnProperty(name);
      }

      hasAttributeNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM Level 3
      setIdAttribute(name, isId) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name].isId;
        } else {
          return isId;
        }
      }

      setIdAttributeNS(namespaceURI, localName, isId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      setIdAttributeNode(idAttr, isId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM Level 4
      getElementsByTagName(tagname) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByTagNameNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getElementsByClassName(classNames) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      isEqualNode(node) {
        var i, j, ref;
        if (!super.isEqualNode(node)) {
          return false;
        }
        if (node.namespaceURI !== this.namespaceURI) {
          return false;
        }
        if (node.prefix !== this.prefix) {
          return false;
        }
        if (node.localName !== this.localName) {
          return false;
        }
        if (node.attribs.length !== this.attribs.length) {
          return false;
        }
        for (i = j = 0, ref = this.attribs.length - 1; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
          if (!this.attribs[i].isEqualNode(node.attribs[i])) {
            return false;
          }
        }
        return true;
      }

    };

    // DOM level 1
    Object.defineProperty(XMLElement.prototype, 'tagName', {
      get: function() {
        return this.name;
      }
    });

    // DOM level 4
    Object.defineProperty(XMLElement.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLElement.prototype, 'id', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'className', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'classList', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'attributes', {
      get: function() {
        if (!this.attributeMap || !this.attributeMap.nodes) {
          this.attributeMap = new XMLNamedNodeMap(this.attribs);
        }
        return this.attributeMap;
      }
    });

    return XMLElement;

  }).call(this);

}).call(this);


/***/ }),

/***/ 4361:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Represents a map of nodes accessed by a string key
  var XMLNamedNodeMap;

  module.exports = XMLNamedNodeMap = (function() {
    class XMLNamedNodeMap {
      // Initializes a new instance of `XMLNamedNodeMap`
      // This is just a wrapper around an ordinary
      // JS object.

      // `nodes` the object containing nodes.
      constructor(nodes) {
        this.nodes = nodes;
      }

      // Creates and returns a deep clone of `this`

      clone() {
        // this class should not be cloned since it wraps
        // around a given object. The calling function should check
        // whether the wrapped object is null and supply a new object
        // (from the clone).
        return this.nodes = null;
      }

      // DOM Level 1
      getNamedItem(name) {
        return this.nodes[name];
      }

      setNamedItem(node) {
        var oldNode;
        oldNode = this.nodes[node.nodeName];
        this.nodes[node.nodeName] = node;
        return oldNode || null;
      }

      removeNamedItem(name) {
        var oldNode;
        oldNode = this.nodes[name];
        delete this.nodes[name];
        return oldNode || null;
      }

      item(index) {
        return this.nodes[Object.keys(this.nodes)[index]] || null;
      }

      // DOM level 2 functions to be implemented later
      getNamedItemNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented.");
      }

      setNamedItemNS(node) {
        throw new Error("This DOM method is not implemented.");
      }

      removeNamedItemNS(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented.");
      }

    };

    
    // DOM level 1
    Object.defineProperty(XMLNamedNodeMap.prototype, 'length', {
      get: function() {
        return Object.keys(this.nodes).length || 0;
      }
    });

    return XMLNamedNodeMap;

  }).call(this);

}).call(this);


/***/ }),

/***/ 7608:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject,
    hasProp = {}.hasOwnProperty,
    splice = [].splice;

  ({isObject, isFunction, isEmpty, getValue} = __nccwpck_require__(8229));

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  XMLProcessingInstruction = null;

  XMLDummy = null;

  NodeType = null;

  XMLNodeList = null;

  XMLNamedNodeMap = null;

  DocumentPosition = null;

  // Represents a generic XMl element
  module.exports = XMLNode = (function() {
    class XMLNode {
      // Initializes a new instance of `XMLNode`

      // `parent` the parent node
      constructor(parent1) {
        this.parent = parent1;
        if (this.parent) {
          this.options = this.parent.options;
          this.stringify = this.parent.stringify;
        }
        this.value = null;
        this.children = [];
        this.baseURI = null;
        // first execution, load dependencies that are otherwise
        // circular (so we can't load them at the top)
        if (!XMLElement) {
          XMLElement = __nccwpck_require__(9437);
          XMLCData = __nccwpck_require__(333);
          XMLComment = __nccwpck_require__(4407);
          XMLDeclaration = __nccwpck_require__(6364);
          XMLDocType = __nccwpck_require__(1801);
          XMLRaw = __nccwpck_require__(6329);
          XMLText = __nccwpck_require__(1318);
          XMLProcessingInstruction = __nccwpck_require__(6939);
          XMLDummy = __nccwpck_require__(3590);
          NodeType = __nccwpck_require__(9267);
          XMLNodeList = __nccwpck_require__(6768);
          XMLNamedNodeMap = __nccwpck_require__(4361);
          DocumentPosition = __nccwpck_require__(2839);
        }
      }

      
      // Sets the parent node of this node and its children recursively

      // `parent` the parent node
      setParent(parent) {
        var child, j, len, ref1, results;
        this.parent = parent;
        if (parent) {
          this.options = parent.options;
          this.stringify = parent.stringify;
        }
        ref1 = this.children;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          results.push(child.setParent(this));
        }
        return results;
      }

      // Creates a child element node

      // `name` node name or an object describing the XML tree
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      element(name, attributes, text) {
        var childNode, item, j, k, key, lastChild, len, len1, val;
        lastChild = null;
        if (attributes === null && (text == null)) {
          [attributes, text] = [{}, null];
        }
        if (attributes == null) {
          attributes = {};
        }
        attributes = getValue(attributes);
        // swap argument order: text <-> attributes
        if (!isObject(attributes)) {
          [text, attributes] = [attributes, text];
        }
        if (name != null) {
          name = getValue(name);
        }
        // expand if array
        if (Array.isArray(name)) {
          for (j = 0, len = name.length; j < len; j++) {
            item = name[j];
            lastChild = this.element(item);
          }
        // evaluate if function
        } else if (isFunction(name)) {
          lastChild = this.element(name.apply());
        // expand if object
        } else if (isObject(name)) {
          for (key in name) {
            if (!hasProp.call(name, key)) continue;
            val = name[key];
            if (isFunction(val)) {
              // evaluate if function
              val = val.apply();
            }
            // assign attributes
            if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
              lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
            // skip empty arrays
            } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
              lastChild = this.dummy();
            // empty objects produce one node
            } else if (isObject(val) && isEmpty(val)) {
              lastChild = this.element(key);
            // skip null and undefined nodes
            } else if (!this.options.keepNullNodes && (val == null)) {
              lastChild = this.dummy();
            
            // expand list by creating child nodes
            } else if (!this.options.separateArrayItems && Array.isArray(val)) {
              for (k = 0, len1 = val.length; k < len1; k++) {
                item = val[k];
                childNode = {};
                childNode[key] = item;
                lastChild = this.element(childNode);
              }
            
            // expand child nodes under parent
            } else if (isObject(val)) {
              // if the key is #text expand child nodes under this node to support mixed content
              if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                lastChild = this.element(val);
              } else {
                lastChild = this.element(key);
                lastChild.element(val);
              }
            } else {
              
              // text node
              lastChild = this.element(key, val);
            }
          }
        // skip null nodes
        } else if (!this.options.keepNullNodes && text === null) {
          lastChild = this.dummy();
        } else {
          // text node
          if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
            lastChild = this.text(text);
          // cdata node
          } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
            lastChild = this.cdata(text);
          // comment node
          } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
            lastChild = this.comment(text);
          // raw text node
          } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
            lastChild = this.raw(text);
          // processing instruction
          } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
            lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
          } else {
            // element node
            lastChild = this.node(name, attributes, text);
          }
        }
        if (lastChild == null) {
          throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
        }
        return lastChild;
      }

      // Creates a child element node before the current node

      // `name` node name or an object describing the XML tree
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      insertBefore(name, attributes, text) {
        var child, i, newChild, refChild, removed;
        // DOM level 1
        // insertBefore(newChild, refChild) inserts the child node newChild before refChild
        if (name != null ? name.type : void 0) {
          newChild = name;
          refChild = attributes;
          newChild.setParent(this);
          if (refChild) {
            // temporarily remove children starting *with* refChild
            i = children.indexOf(refChild);
            removed = children.splice(i);
            
            // add the new child
            children.push(newChild);
            
            // add back removed children after new child
            Array.prototype.push.apply(children, removed);
          } else {
            children.push(newChild);
          }
          return newChild;
        } else {
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          
          // temporarily remove children starting *with* this
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          
          // add the new child
          child = this.parent.element(name, attributes, text);
          
          // add back removed children after new child
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        }
      }

      // Creates a child element node after the current node

      // `name` node name or an object describing the XML tree
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      insertAfter(name, attributes, text) {
        var child, i, removed;
        if (this.isRoot) {
          throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
        }
        
        // temporarily remove children starting *after* this
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        
        // add the new child
        child = this.parent.element(name, attributes, text);
        
        // add back removed children after new child
        Array.prototype.push.apply(this.parent.children, removed);
        return child;
      }

      // Deletes a child element node

      remove() {
        var i, ref1;
        if (this.isRoot) {
          throw new Error("Cannot remove the root element. " + this.debugInfo());
        }
        i = this.parent.children.indexOf(this);
        splice.apply(this.parent.children, [i, i - i + 1].concat(ref1 = [])), ref1;
        return this.parent;
      }

      // Creates a node

      // `name` name of the node
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      node(name, attributes, text) {
        var child;
        if (name != null) {
          name = getValue(name);
        }
        attributes || (attributes = {});
        attributes = getValue(attributes);
        // swap argument order: text <-> attributes
        if (!isObject(attributes)) {
          [text, attributes] = [attributes, text];
        }
        child = new XMLElement(this, name, attributes);
        if (text != null) {
          child.text(text);
        }
        this.children.push(child);
        return child;
      }

      // Creates a text node

      // `value` element text
      text(value) {
        var child;
        if (isObject(value)) {
          this.element(value);
        }
        child = new XMLText(this, value);
        this.children.push(child);
        return this;
      }

      // Creates a CDATA node

      // `value` element text without CDATA delimiters
      cdata(value) {
        var child;
        child = new XMLCData(this, value);
        this.children.push(child);
        return this;
      }

      // Creates a comment node

      // `value` comment text
      comment(value) {
        var child;
        child = new XMLComment(this, value);
        this.children.push(child);
        return this;
      }

      // Creates a comment node before the current node

      // `value` comment text
      commentBefore(value) {
        var child, i, removed;
        // temporarily remove children starting *with* this
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        // add the new child
        child = this.parent.comment(value);
        // add back removed children after new child
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      }

      // Creates a comment node after the current node

      // `value` comment text
      commentAfter(value) {
        var child, i, removed;
        // temporarily remove children starting *after* this
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        // add the new child
        child = this.parent.comment(value);
        // add back removed children after new child
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      }

      // Adds unescaped raw text

      // `value` text
      raw(value) {
        var child;
        child = new XMLRaw(this, value);
        this.children.push(child);
        return this;
      }

      // Adds a dummy node
      dummy() {
        var child;
        child = new XMLDummy(this);
        // Normally when a new node is created it is added to the child node collection.
        // However, dummy nodes are never added to the XML tree. They are created while
        // converting JS objects to XML nodes in order not to break the recursive function
        // chain. They can be thought of as invisible nodes. They can be traversed through
        // by using prev(), next(), up(), etc. functions but they do not exists in the tree.

        // @children.push child
        return child;
      }

      // Adds a processing instruction

      // `target` instruction target
      // `value` instruction value
      instruction(target, value) {
        var insTarget, insValue, instruction, j, len;
        if (target != null) {
          target = getValue(target);
        }
        if (value != null) {
          value = getValue(value);
        }
        if (Array.isArray(target)) { // expand if array
          for (j = 0, len = target.length; j < len; j++) {
            insTarget = target[j];
            this.instruction(insTarget);
          }
        } else if (isObject(target)) { // expand if object
          for (insTarget in target) {
            if (!hasProp.call(target, insTarget)) continue;
            insValue = target[insTarget];
            this.instruction(insTarget, insValue);
          }
        } else {
          if (isFunction(value)) {
            value = value.apply();
          }
          instruction = new XMLProcessingInstruction(this, target, value);
          this.children.push(instruction);
        }
        return this;
      }

      // Creates a processing instruction node before the current node

      // `target` instruction target
      // `value` instruction value
      instructionBefore(target, value) {
        var child, i, removed;
        // temporarily remove children starting *with* this
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        // add the new child
        child = this.parent.instruction(target, value);
        // add back removed children after new child
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      }

      // Creates a processing instruction node after the current node

      // `target` instruction target
      // `value` instruction value
      instructionAfter(target, value) {
        var child, i, removed;
        // temporarily remove children starting *after* this
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        // add the new child
        child = this.parent.instruction(target, value);
        // add back removed children after new child
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      }

      // Creates the xml declaration

      // `version` A version number string, e.g. 1.0
      // `encoding` Encoding declaration, e.g. UTF-8
      // `standalone` standalone document declaration: true or false
      declaration(version, encoding, standalone) {
        var doc, xmldec;
        doc = this.document();
        xmldec = new XMLDeclaration(doc, version, encoding, standalone);
        // Replace XML declaration if exists, otherwise insert at top
        if (doc.children.length === 0) {
          doc.children.unshift(xmldec);
        } else if (doc.children[0].type === NodeType.Declaration) {
          doc.children[0] = xmldec;
        } else {
          doc.children.unshift(xmldec);
        }
        return doc.root() || doc;
      }

      // Creates the document type declaration

      // `pubID` the public identifier of the external subset
      // `sysID` the system identifier of the external subset
      dtd(pubID, sysID) {
        var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
        doc = this.document();
        doctype = new XMLDocType(doc, pubID, sysID);
        ref1 = doc.children;
        // Replace DTD if exists
        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          child = ref1[i];
          if (child.type === NodeType.DocType) {
            doc.children[i] = doctype;
            return doctype;
          }
        }
        ref2 = doc.children;
        // insert before root node if the root node exists
        for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
          child = ref2[i];
          if (child.isRoot) {
            doc.children.splice(i, 0, doctype);
            return doctype;
          }
        }
        // otherwise append to end
        doc.children.push(doctype);
        return doctype;
      }

      // Gets the parent node
      up() {
        if (this.isRoot) {
          throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
        }
        return this.parent;
      }

      // Gets the root node
      root() {
        var node;
        node = this;
        while (node) {
          if (node.type === NodeType.Document) {
            return node.rootObject;
          } else if (node.isRoot) {
            return node;
          } else {
            node = node.parent;
          }
        }
      }

      // Gets the node representing the XML document
      document() {
        var node;
        node = this;
        while (node) {
          if (node.type === NodeType.Document) {
            return node;
          } else {
            node = node.parent;
          }
        }
      }

      // Ends the document and converts string
      end(options) {
        return this.document().end(options);
      }

      // Gets the previous node
      prev() {
        var i;
        i = this.parent.children.indexOf(this);
        if (i < 1) {
          throw new Error("Already at the first node. " + this.debugInfo());
        }
        return this.parent.children[i - 1];
      }

      // Gets the next node
      next() {
        var i;
        i = this.parent.children.indexOf(this);
        if (i === -1 || i === this.parent.children.length - 1) {
          throw new Error("Already at the last node. " + this.debugInfo());
        }
        return this.parent.children[i + 1];
      }

      // Imports cloned root from another XML document

      // `doc` the XML document to insert nodes from
      importDocument(doc) {
        var child, clonedRoot, j, len, ref1;
        clonedRoot = doc.root().clone();
        clonedRoot.parent = this;
        clonedRoot.isRoot = false;
        this.children.push(clonedRoot);
        // set properties if imported element becomes the root node
        if (this.type === NodeType.Document) {
          clonedRoot.isRoot = true;
          clonedRoot.documentObject = this;
          this.rootObject = clonedRoot;
          // set dtd name
          if (this.children) {
            ref1 = this.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              if (child.type === NodeType.DocType) {
                child.name = clonedRoot.name;
                break;
              }
            }
          }
        }
        return this;
      }

      
      // Returns debug string for this node
      debugInfo(name) {
        var ref1, ref2;
        name = name || this.name;
        if ((name == null) && !((ref1 = this.parent) != null ? ref1.name : void 0)) {
          return "";
        } else if (name == null) {
          return "parent: <" + this.parent.name + ">";
        } else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) {
          return "node: <" + name + ">";
        } else {
          return "node: <" + name + ">, parent: <" + this.parent.name + ">";
        }
      }

      // Aliases
      ele(name, attributes, text) {
        return this.element(name, attributes, text);
      }

      nod(name, attributes, text) {
        return this.node(name, attributes, text);
      }

      txt(value) {
        return this.text(value);
      }

      dat(value) {
        return this.cdata(value);
      }

      com(value) {
        return this.comment(value);
      }

      ins(target, value) {
        return this.instruction(target, value);
      }

      doc() {
        return this.document();
      }

      dec(version, encoding, standalone) {
        return this.declaration(version, encoding, standalone);
      }

      e(name, attributes, text) {
        return this.element(name, attributes, text);
      }

      n(name, attributes, text) {
        return this.node(name, attributes, text);
      }

      t(value) {
        return this.text(value);
      }

      d(value) {
        return this.cdata(value);
      }

      c(value) {
        return this.comment(value);
      }

      r(value) {
        return this.raw(value);
      }

      i(target, value) {
        return this.instruction(target, value);
      }

      u() {
        return this.up();
      }

      // can be deprecated in a future release
      importXMLBuilder(doc) {
        return this.importDocument(doc);
      }

      // Adds or modifies an attribute.

      // `name` attribute name
      // `value` attribute value
      attribute(name, value) {
        throw new Error("attribute() applies to element nodes only.");
      }

      att(name, value) {
        return this.attribute(name, value);
      }

      a(name, value) {
        return this.attribute(name, value);
      }

      // Removes an attribute

      // `name` attribute name
      removeAttribute(name) {
        throw new Error("attribute() applies to element nodes only.");
      }

      // DOM level 1 functions to be implemented later
      replaceChild(newChild, oldChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      removeChild(oldChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      appendChild(newChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      hasChildNodes() {
        return this.children.length !== 0;
      }

      cloneNode(deep) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      normalize() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM level 2
      isSupported(feature, version) {
        return true;
      }

      hasAttributes() {
        return this.attribs.length !== 0;
      }

      // DOM level 3 functions to be implemented later
      compareDocumentPosition(other) {
        var ref, res;
        ref = this;
        if (ref === other) {
          return 0;
        } else if (this.document() !== other.document()) {
          res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
          if (Math.random() < 0.5) {
            res |= DocumentPosition.Preceding;
          } else {
            res |= DocumentPosition.Following;
          }
          return res;
        } else if (ref.isAncestor(other)) {
          return DocumentPosition.Contains | DocumentPosition.Preceding;
        } else if (ref.isDescendant(other)) {
          return DocumentPosition.Contains | DocumentPosition.Following;
        } else if (ref.isPreceding(other)) {
          return DocumentPosition.Preceding;
        } else {
          return DocumentPosition.Following;
        }
      }

      isSameNode(other) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      lookupPrefix(namespaceURI) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      isDefaultNamespace(namespaceURI) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      lookupNamespaceURI(prefix) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      isEqualNode(node) {
        var i, j, ref1;
        if (node.nodeType !== this.nodeType) {
          return false;
        }
        if (node.children.length !== this.children.length) {
          return false;
        }
        for (i = j = 0, ref1 = this.children.length - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); i = 0 <= ref1 ? ++j : --j) {
          if (!this.children[i].isEqualNode(node.children[i])) {
            return false;
          }
        }
        return true;
      }

      getFeature(feature, version) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      setUserData(key, data, handler) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      getUserData(key) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // Returns true if other is an inclusive descendant of node,
      // and false otherwise.
      contains(other) {
        if (!other) {
          return false;
        }
        return other === this || this.isDescendant(other);
      }

      // An object A is called a descendant of an object B, if either A is 
      // a child of B or A is a child of an object C that is a descendant of B.
      isDescendant(node) {
        var child, isDescendantChild, j, len, ref1;
        ref1 = this.children;
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          if (node === child) {
            return true;
          }
          isDescendantChild = child.isDescendant(node);
          if (isDescendantChild) {
            return true;
          }
        }
        return false;
      }

      // An object A is called an ancestor of an object B if and only if
      // B is a descendant of A.
      isAncestor(node) {
        return node.isDescendant(this);
      }

      // An object A is preceding an object B if A and B are in the 
      // same tree and A comes before B in tree order.
      isPreceding(node) {
        var nodePos, thisPos;
        nodePos = this.treePosition(node);
        thisPos = this.treePosition(this);
        if (nodePos === -1 || thisPos === -1) {
          return false;
        } else {
          return nodePos < thisPos;
        }
      }

      // An object A is folllowing an object B if A and B are in the 
      // same tree and A comes after B in tree order.
      isFollowing(node) {
        var nodePos, thisPos;
        nodePos = this.treePosition(node);
        thisPos = this.treePosition(this);
        if (nodePos === -1 || thisPos === -1) {
          return false;
        } else {
          return nodePos > thisPos;
        }
      }

      // Returns the preorder position of the given node in the tree, or -1
      // if the node is not in the tree.
      treePosition(node) {
        var found, pos;
        pos = 0;
        found = false;
        this.foreachTreeNode(this.document(), function(childNode) {
          pos++;
          if (!found && childNode === node) {
            return found = true;
          }
        });
        if (found) {
          return pos;
        } else {
          return -1;
        }
      }

      
      // Depth-first preorder traversal through the XML tree
      foreachTreeNode(node, func) {
        var child, j, len, ref1, res;
        node || (node = this.document());
        ref1 = node.children;
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          if (res = func(child)) {
            return res;
          } else {
            res = this.foreachTreeNode(child, func);
            if (res) {
              return res;
            }
          }
        }
      }

    };

    // DOM level 1
    Object.defineProperty(XMLNode.prototype, 'nodeName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeValue', {
      get: function() {
        return this.value;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'parentNode', {
      get: function() {
        return this.parent;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'childNodes', {
      get: function() {
        if (!this.childNodeList || !this.childNodeList.nodes) {
          this.childNodeList = new XMLNodeList(this.children);
        }
        return this.childNodeList;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'firstChild', {
      get: function() {
        return this.children[0] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'lastChild', {
      get: function() {
        return this.children[this.children.length - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'previousSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nextSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i + 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'ownerDocument', {
      get: function() {
        return this.document() || null;
      }
    });

    // DOM level 3
    Object.defineProperty(XMLNode.prototype, 'textContent', {
      get: function() {
        var child, j, len, ref1, str;
        if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
          str = '';
          ref1 = this.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            if (child.textContent) {
              str += child.textContent;
            }
          }
          return str;
        } else {
          return null;
        }
      },
      set: function(value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    return XMLNode;

  }).call(this);

}).call(this);


/***/ }),

/***/ 6768:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Represents a list of nodes
  var XMLNodeList;

  module.exports = XMLNodeList = (function() {
    class XMLNodeList {
      // Initializes a new instance of `XMLNodeList`
      // This is just a wrapper around an ordinary
      // JS array.

      // `nodes` the array containing nodes.
      constructor(nodes) {
        this.nodes = nodes;
      }

      // Creates and returns a deep clone of `this`

      clone() {
        // this class should not be cloned since it wraps
        // around a given array. The calling function should check
        // whether the wrapped array is null and supply a new array
        // (from the clone).
        return this.nodes = null;
      }

      // DOM Level 1
      item(index) {
        return this.nodes[index] || null;
      }

    };

    // DOM level 1
    Object.defineProperty(XMLNodeList.prototype, 'length', {
      get: function() {
        return this.nodes.length || 0;
      }
    });

    return XMLNodeList;

  }).call(this);

}).call(this);


/***/ }),

/***/ 6939:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLCharacterData, XMLProcessingInstruction;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  // Represents a processing instruction
  module.exports = XMLProcessingInstruction = class XMLProcessingInstruction extends XMLCharacterData {
    // Initializes a new instance of `XMLProcessingInstruction`

    // `parent` the parent node
    // `target` instruction target
    // `value` instruction value
    constructor(parent, target, value) {
      super(parent);
      if (target == null) {
        throw new Error("Missing instruction target. " + this.debugInfo());
      }
      this.type = NodeType.ProcessingInstruction;
      this.target = this.stringify.insTarget(target);
      this.name = this.target;
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    // Creates and returns a deep clone of `this`
    clone() {
      return Object.create(this);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
    }

    isEqualNode(node) {
      if (!super.isEqualNode(node)) {
        return false;
      }
      if (node.target !== this.target) {
        return false;
      }
      return true;
    }

  };

}).call(this);


/***/ }),

/***/ 6329:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLNode, XMLRaw;

  NodeType = __nccwpck_require__(9267);

  XMLNode = __nccwpck_require__(7608);

  // Represents a  raw node
  module.exports = XMLRaw = class XMLRaw extends XMLNode {
    // Initializes a new instance of `XMLRaw`

    // `text` raw text
    constructor(parent, text) {
      super(parent);
      if (text == null) {
        throw new Error("Missing raw text. " + this.debugInfo());
      }
      this.type = NodeType.Raw;
      this.value = this.stringify.raw(text);
    }

    // Creates and returns a deep clone of `this`
    clone() {
      return Object.create(this);
    }

    // Converts the XML fragment to string

    // `options.pretty` pretty prints the result
    // `options.indent` indentation for pretty print
    // `options.offset` how many indentations to add to every line for pretty print
    // `options.newline` newline sequence for pretty print
    toString(options) {
      return this.options.writer.raw(this, this.options.writer.filterOptions(options));
    }

  };

}).call(this);


/***/ }),

/***/ 8601:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, WriterState, XMLStreamWriter, XMLWriterBase,
    hasProp = {}.hasOwnProperty;

  NodeType = __nccwpck_require__(9267);

  XMLWriterBase = __nccwpck_require__(6752);

  WriterState = __nccwpck_require__(9766);

  // Prints XML nodes to a stream
  module.exports = XMLStreamWriter = class XMLStreamWriter extends XMLWriterBase {
    // Initializes a new instance of `XMLStreamWriter`

    // `stream` output stream
    // `options.pretty` pretty prints the result
    // `options.indent` indentation string
    // `options.newline` newline sequence
    // `options.offset` a fixed number of indentations to add to every line
    // `options.allowEmpty` do not self close empty element tags
    // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
    // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
    constructor(stream, options) {
      super(options);
      this.stream = stream;
    }

    endline(node, options, level) {
      if (node.isLastRootNode && options.state === WriterState.CloseTag) {
        return '';
      } else {
        return super.endline(node, options, level);
      }
    }

    document(doc, options) {
      var child, i, j, k, len1, len2, ref, ref1, results;
      ref = doc.children;
      // set a flag so that we don't insert a newline after the last root level node 
      for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
        child = ref[i];
        child.isLastRootNode = i === doc.children.length - 1;
      }
      options = this.filterOptions(options);
      ref1 = doc.children;
      results = [];
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        child = ref1[k];
        results.push(this.writeChildNode(child, options, 0));
      }
      return results;
    }

    cdata(node, options, level) {
      return this.stream.write(super.cdata(node, options, level));
    }

    comment(node, options, level) {
      return this.stream.write(super.comment(node, options, level));
    }

    declaration(node, options, level) {
      return this.stream.write(super.declaration(node, options, level));
    }

    docType(node, options, level) {
      var child, j, len1, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      this.stream.write(this.indent(node, options, level));
      this.stream.write('<!DOCTYPE ' + node.root().name);
      // external identifier
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      // internal subset
      if (node.children.length > 0) {
        this.stream.write(' [');
        this.stream.write(this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          child = ref[j];
          this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        this.stream.write(']');
      }
      // close tag
      options.state = WriterState.CloseTag;
      this.stream.write(options.spaceBeforeSlash + '>');
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    }

    element(node, options, level) {
      var att, attLen, child, childNodeCount, firstChildNode, j, len, len1, name, prettySuppressed, r, ratt, ref, ref1, ref2, rline;
      level || (level = 0);
      // open tag
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<' + node.name;
      // attributes
      if (options.pretty && options.width > 0) {
        len = r.length;
        ref = node.attribs;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          ratt = this.attribute(att, options, level);
          attLen = ratt.length;
          if (len + attLen > options.width) {
            rline = this.indent(node, options, level + 1) + ratt;
            r += this.endline(node, options, level) + rline;
            len = rline.length;
          } else {
            rline = ' ' + ratt;
            r += rline;
            len += rline.length;
          }
        }
      } else {
        ref1 = node.attribs;
        for (name in ref1) {
          if (!hasProp.call(ref1, name)) continue;
          att = ref1[name];
          r += this.attribute(att, options, level);
        }
      }
      this.stream.write(r);
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw || e.type === NodeType.CData) && e.value === '';
      })) {
        // empty element
        if (options.allowEmpty) {
          this.stream.write('>');
          options.state = WriterState.CloseTag;
          this.stream.write('</' + node.name + '>');
        } else {
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + '/>');
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw || firstChildNode.type === NodeType.CData) && (firstChildNode.value != null)) {
        // do not indent text-only nodes
        this.stream.write('>');
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        this.stream.write('</' + node.name + '>');
      } else {
        this.stream.write('>' + this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref2 = node.children;
        // inner tags
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          child = ref2[j];
          this.writeChildNode(child, options, level + 1);
        }
        // close tag
        options.state = WriterState.CloseTag;
        this.stream.write(this.indent(node, options, level) + '</' + node.name + '>');
      }
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    }

    processingInstruction(node, options, level) {
      return this.stream.write(super.processingInstruction(node, options, level));
    }

    raw(node, options, level) {
      return this.stream.write(super.raw(node, options, level));
    }

    text(node, options, level) {
      return this.stream.write(super.text(node, options, level));
    }

    dtdAttList(node, options, level) {
      return this.stream.write(super.dtdAttList(node, options, level));
    }

    dtdElement(node, options, level) {
      return this.stream.write(super.dtdElement(node, options, level));
    }

    dtdEntity(node, options, level) {
      return this.stream.write(super.dtdEntity(node, options, level));
    }

    dtdNotation(node, options, level) {
      return this.stream.write(super.dtdNotation(node, options, level));
    }

  };

}).call(this);


/***/ }),

/***/ 5913:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var XMLStringWriter, XMLWriterBase;

  XMLWriterBase = __nccwpck_require__(6752);

  // Prints XML nodes as plain text
  module.exports = XMLStringWriter = class XMLStringWriter extends XMLWriterBase {
    // Initializes a new instance of `XMLStringWriter`

    // `options.pretty` pretty prints the result
    // `options.indent` indentation string
    // `options.newline` newline sequence
    // `options.offset` a fixed number of indentations to add to every line
    // `options.allowEmpty` do not self close empty element tags
    // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
    // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
    constructor(options) {
      super(options);
    }

    document(doc, options) {
      var child, i, len, r, ref;
      options = this.filterOptions(options);
      r = '';
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += this.writeChildNode(child, options, 0);
      }
      // remove trailing newline
      if (options.pretty && r.slice(-options.newline.length) === options.newline) {
        r = r.slice(0, -options.newline.length);
      }
      return r;
    }

  };

}).call(this);


/***/ }),

/***/ 8594:
/***/ (function(module) {

// Generated by CoffeeScript 2.4.1
(function() {
  // Converts values to strings
  var XMLStringifier,
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    class XMLStringifier {
      // Initializes a new instance of `XMLStringifier`

      // `options.version` The version number string of the XML spec to validate against, e.g. 1.0
      // `options.noDoubleEncoding` whether existing html entities are encoded: true or false
      // `options.stringify` a set of functions to use for converting values to strings
      // `options.noValidation` whether values will be validated and escaped or returned as is
      // `options.invalidCharReplacement` a character to replace invalid characters and disable character validation
      constructor(options) {
        var key, ref, value;
        // Checks whether the given string contains legal characters
        // Fails with an exception on error

        // `str` the string to check
        this.assertLegalChar = this.assertLegalChar.bind(this);
        // Checks whether the given string contains legal characters for a name
        // Fails with an exception on error

        // `str` the string to check
        this.assertLegalName = this.assertLegalName.bind(this);
        options || (options = {});
        this.options = options;
        if (!this.options.version) {
          this.options.version = '1.0';
        }
        ref = options.stringify || {};
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          this[key] = value;
        }
      }

      // Defaults
      name(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalName('' + val || '');
      }

      text(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar(this.textEscape('' + val || ''));
      }

      cdata(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = '' + val || '';
        val = val.replace(']]>', ']]]]><![CDATA[>');
        return this.assertLegalChar(val);
      }

      comment(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = '' + val || '';
        if (val.match(/--/)) {
          throw new Error("Comment text cannot contain double-hypen: " + val);
        }
        return this.assertLegalChar(val);
      }

      raw(val) {
        if (this.options.noValidation) {
          return val;
        }
        return '' + val || '';
      }

      attValue(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar(this.attEscape(val = '' + val || ''));
      }

      insTarget(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      insValue(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = '' + val || '';
        if (val.match(/\?>/)) {
          throw new Error("Invalid processing instruction value: " + val);
        }
        return this.assertLegalChar(val);
      }

      xmlVersion(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = '' + val || '';
        if (!val.match(/1\.[0-9]+/)) {
          throw new Error("Invalid version number: " + val);
        }
        return val;
      }

      xmlEncoding(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = '' + val || '';
        if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
          throw new Error("Invalid encoding: " + val);
        }
        return this.assertLegalChar(val);
      }

      xmlStandalone(val) {
        if (this.options.noValidation) {
          return val;
        }
        if (val) {
          return "yes";
        } else {
          return "no";
        }
      }

      dtdPubID(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdSysID(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdElementValue(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdAttType(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdAttDefault(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdEntityValue(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      dtdNData(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar('' + val || '');
      }

      assertLegalChar(str) {
        var regex, res;
        if (this.options.noValidation) {
          return str;
        }
        if (this.options.version === '1.0') {
          // Valid characters from https://www.w3.org/TR/xml/#charsets
          // any Unicode character, excluding the surrogate blocks, FFFE, and FFFF.
          // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
          // This ES5 compatible Regexp has been generated using the "regenerate" NPM module:
          //   let xml_10_InvalidChars = regenerate()
          //     .addRange(0x0000, 0x0008)
          //     .add(0x000B, 0x000C)
          //     .addRange(0x000E, 0x001F)
          //     .addRange(0xD800, 0xDFFF)
          //     .addRange(0xFFFE, 0xFFFF)
          regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g;
          if (this.options.invalidCharReplacement !== void 0) {
            str = str.replace(regex, this.options.invalidCharReplacement);
          } else if (res = str.match(regex)) {
            throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
          }
        } else if (this.options.version === '1.1') {
          // Valid characters from https://www.w3.org/TR/xml11/#charsets
          // any Unicode character, excluding the surrogate blocks, FFFE, and FFFF.
          // [#x1-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
          // This ES5 compatible Regexp has been generated using the "regenerate" NPM module:
          //   let xml_11_InvalidChars = regenerate()
          //     .add(0x0000)
          //     .addRange(0xD800, 0xDFFF)
          //     .addRange(0xFFFE, 0xFFFF)
          regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g;
          if (this.options.invalidCharReplacement !== void 0) {
            str = str.replace(regex, this.options.invalidCharReplacement);
          } else if (res = str.match(regex)) {
            throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
          }
        }
        return str;
      }

      assertLegalName(str) {
        var regex;
        if (this.options.noValidation) {
          return str;
        }
        str = this.assertLegalChar(str);
        regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
        if (!str.match(regex)) {
          throw new Error(`Invalid character in name: ${str}`);
        }
        return str;
      }

      // Escapes special characters in text

      // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping

      // `str` the string to escape
      textEscape(str) {
        var ampregex;
        if (this.options.noValidation) {
          return str;
        }
        ampregex = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g;
        return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
      }

      // Escapes special characters in attribute values

      // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping

      // `str` the string to escape
      attEscape(str) {
        var ampregex;
        if (this.options.noValidation) {
          return str;
        }
        ampregex = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g;
        return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
      }

    };

    // strings to match while converting from JS objects
    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    return XMLStringifier;

  }).call(this);

}).call(this);


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, XMLCharacterData, XMLText;

  NodeType = __nccwpck_require__(9267);

  XMLCharacterData = __nccwpck_require__(7709);

  // Represents a text node
  module.exports = XMLText = (function() {
    class XMLText extends XMLCharacterData {
      // Initializes a new instance of `XMLText`

      // `text` element text
      constructor(parent, text) {
        super(parent);
        if (text == null) {
          throw new Error("Missing element text. " + this.debugInfo());
        }
        this.name = "#text";
        this.type = NodeType.Text;
        this.value = this.stringify.text(text);
      }

      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }

      // Converts the XML fragment to string

      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.text(this, this.options.writer.filterOptions(options));
      }

      // DOM level 1 functions to be implemented later
      splitText(offset) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

      // DOM level 3 functions to be implemented later
      replaceWholeText(content) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }

    };

    // DOM level 3
    Object.defineProperty(XMLText.prototype, 'isElementContentWhitespace', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLText.prototype, 'wholeText', {
      get: function() {
        var next, prev, str;
        str = '';
        prev = this.previousSibling;
        while (prev) {
          str = prev.data + str;
          prev = prev.previousSibling;
        }
        str += this.data;
        next = this.nextSibling;
        while (next) {
          str = str + next.data;
          next = next.nextSibling;
        }
        return str;
      }
    });

    return XMLText;

  }).call(this);

}).call(this);


/***/ }),

/***/ 6752:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign,
    hasProp = {}.hasOwnProperty;

  ({assign} = __nccwpck_require__(8229));

  NodeType = __nccwpck_require__(9267);

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLElement = __nccwpck_require__(9437);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDummy = __nccwpck_require__(3590);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDNotation = __nccwpck_require__(2837);

  WriterState = __nccwpck_require__(9766);

  // Base class for XML writers
  module.exports = XMLWriterBase = class XMLWriterBase {
    // Initializes a new instance of `XMLWriterBase`

    // `options.pretty` pretty prints the result
    // `options.indent` indentation string
    // `options.newline` newline sequence
    // `options.offset` a fixed number of indentations to add to every line
    // `options.width` maximum column width
    // `options.allowEmpty` do not self close empty element tags
    // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
    // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
    constructor(options) {
      var key, ref, value;
      options || (options = {});
      this.options = options;
      ref = options.writer || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this["_" + key] = this[key];
        this[key] = value;
      }
    }

    // Filters writer options and provides defaults

    // `options` writer options
    filterOptions(options) {
      var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
      options || (options = {});
      options = assign({}, this.options, options);
      filteredOptions = {
        writer: this
      };
      filteredOptions.pretty = options.pretty || false;
      filteredOptions.allowEmpty = options.allowEmpty || false;
      filteredOptions.indent = (ref = options.indent) != null ? ref : '  ';
      filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : '\n';
      filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
      filteredOptions.width = (ref3 = options.width) != null ? ref3 : 0;
      filteredOptions.dontPrettyTextNodes = (ref4 = (ref5 = options.dontPrettyTextNodes) != null ? ref5 : options.dontprettytextnodes) != null ? ref4 : 0;
      filteredOptions.spaceBeforeSlash = (ref6 = (ref7 = options.spaceBeforeSlash) != null ? ref7 : options.spacebeforeslash) != null ? ref6 : '';
      if (filteredOptions.spaceBeforeSlash === true) {
        filteredOptions.spaceBeforeSlash = ' ';
      }
      filteredOptions.suppressPrettyCount = 0;
      filteredOptions.user = {};
      filteredOptions.state = WriterState.None;
      return filteredOptions;
    }

    // Returns the indentation string for the current level

    // `node` current node
    // `options` writer options
    // `level` current indentation level
    indent(node, options, level) {
      var indentLevel;
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else if (options.pretty) {
        indentLevel = (level || 0) + options.offset + 1;
        if (indentLevel > 0) {
          return new Array(indentLevel).join(options.indent);
        }
      }
      return '';
    }

    // Returns the newline string

    // `node` current node
    // `options` writer options
    // `level` current indentation level
    endline(node, options, level) {
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else {
        return options.newline;
      }
    }

    attribute(att, options, level) {
      var r;
      this.openAttribute(att, options, level);
      if (options.pretty && options.width > 0) {
        r = att.name + '="' + att.value + '"';
      } else {
        r = ' ' + att.name + '="' + att.value + '"';
      }
      this.closeAttribute(att, options, level);
      return r;
    }

    cdata(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<![CDATA[';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ']]>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    comment(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!-- ';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ' -->' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    declaration(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?xml';
      options.state = WriterState.InsideTag;
      r += ' version="' + node.version + '"';
      if (node.encoding != null) {
        r += ' encoding="' + node.encoding + '"';
      }
      if (node.standalone != null) {
        r += ' standalone="' + node.standalone + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    docType(node, options, level) {
      var child, i, len1, r, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      r += '<!DOCTYPE ' + node.root().name;
      // external identifier
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      // internal subset
      if (node.children.length > 0) {
        r += ' [';
        r += this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (i = 0, len1 = ref.length; i < len1; i++) {
          child = ref[i];
          r += this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        r += ']';
      }
      // close tag
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    element(node, options, level) {
      var att, attLen, child, childNodeCount, firstChildNode, i, j, len, len1, len2, name, prettySuppressed, r, ratt, ref, ref1, ref2, ref3, rline;
      level || (level = 0);
      prettySuppressed = false;
      // open tag
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<' + node.name;
      // attributes
      if (options.pretty && options.width > 0) {
        len = r.length;
        ref = node.attribs;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          ratt = this.attribute(att, options, level);
          attLen = ratt.length;
          if (len + attLen > options.width) {
            rline = this.indent(node, options, level + 1) + ratt;
            r += this.endline(node, options, level) + rline;
            len = rline.length;
          } else {
            rline = ' ' + ratt;
            r += rline;
            len += rline.length;
          }
        }
      } else {
        ref1 = node.attribs;
        for (name in ref1) {
          if (!hasProp.call(ref1, name)) continue;
          att = ref1[name];
          r += this.attribute(att, options, level);
        }
      }
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw || e.type === NodeType.CData) && e.value === '';
      })) {
        // empty element
        if (options.allowEmpty) {
          r += '>';
          options.state = WriterState.CloseTag;
          r += '</' + node.name + '>' + this.endline(node, options, level);
        } else {
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + '/>' + this.endline(node, options, level);
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw || firstChildNode.type === NodeType.CData) && (firstChildNode.value != null)) {
        // do not indent text-only nodes
        r += '>';
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        r += this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        r += '</' + node.name + '>' + this.endline(node, options, level);
      } else {
        // if ANY are a text node, then suppress pretty now
        if (options.dontPrettyTextNodes) {
          ref2 = node.children;
          for (i = 0, len1 = ref2.length; i < len1; i++) {
            child = ref2[i];
            if ((child.type === NodeType.Text || child.type === NodeType.Raw || child.type === NodeType.CData) && (child.value != null)) {
              options.suppressPrettyCount++;
              prettySuppressed = true;
              break;
            }
          }
        }
        // close the opening tag, after dealing with newline
        r += '>' + this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref3 = node.children;
        // inner tags
        for (j = 0, len2 = ref3.length; j < len2; j++) {
          child = ref3[j];
          r += this.writeChildNode(child, options, level + 1);
        }
        // close tag
        options.state = WriterState.CloseTag;
        r += this.indent(node, options, level) + '</' + node.name + '>';
        if (prettySuppressed) {
          options.suppressPrettyCount--;
        }
        r += this.endline(node, options, level);
        options.state = WriterState.None;
      }
      this.closeNode(node, options, level);
      return r;
    }

    writeChildNode(node, options, level) {
      switch (node.type) {
        case NodeType.CData:
          return this.cdata(node, options, level);
        case NodeType.Comment:
          return this.comment(node, options, level);
        case NodeType.Element:
          return this.element(node, options, level);
        case NodeType.Raw:
          return this.raw(node, options, level);
        case NodeType.Text:
          return this.text(node, options, level);
        case NodeType.ProcessingInstruction:
          return this.processingInstruction(node, options, level);
        case NodeType.Dummy:
          return '';
        case NodeType.Declaration:
          return this.declaration(node, options, level);
        case NodeType.DocType:
          return this.docType(node, options, level);
        case NodeType.AttributeDeclaration:
          return this.dtdAttList(node, options, level);
        case NodeType.ElementDeclaration:
          return this.dtdElement(node, options, level);
        case NodeType.EntityDeclaration:
          return this.dtdEntity(node, options, level);
        case NodeType.NotationDeclaration:
          return this.dtdNotation(node, options, level);
        default:
          throw new Error("Unknown XML node type: " + node.constructor.name);
      }
    }

    processingInstruction(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?';
      options.state = WriterState.InsideTag;
      r += node.target;
      if (node.value) {
        r += ' ' + node.value;
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    raw(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    text(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    dtdAttList(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ATTLIST';
      options.state = WriterState.InsideTag;
      r += ' ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
      if (node.defaultValueType !== '#DEFAULT') {
        r += ' ' + node.defaultValueType;
      }
      if (node.defaultValue) {
        r += ' "' + node.defaultValue + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    dtdElement(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ELEMENT';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name + ' ' + node.value;
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    dtdEntity(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ENTITY';
      options.state = WriterState.InsideTag;
      if (node.pe) {
        r += ' %';
      }
      r += ' ' + node.name;
      if (node.value) {
        r += ' "' + node.value + '"';
      } else {
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.nData) {
          r += ' NDATA ' + node.nData;
        }
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    dtdNotation(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!NOTATION';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.pubID) {
        r += ' PUBLIC "' + node.pubID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    }

    openNode(node, options, level) {}

    closeNode(node, options, level) {}

    openAttribute(att, options, level) {}

    closeAttribute(att, options, level) {}

  };

}).call(this);


/***/ }),

/***/ 2958:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.4.1
(function() {
  var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction;

  ({assign, isFunction} = __nccwpck_require__(8229));

  XMLDOMImplementation = __nccwpck_require__(5861);

  XMLDocument = __nccwpck_require__(3730);

  XMLDocumentCB = __nccwpck_require__(7356);

  XMLStringWriter = __nccwpck_require__(5913);

  XMLStreamWriter = __nccwpck_require__(8601);

  NodeType = __nccwpck_require__(9267);

  WriterState = __nccwpck_require__(9766);

  // Creates a new document and returns the root node for
  // chain-building the document tree

  // `name` name of the root element

  // `xmldec.version` A version number string, e.g. 1.0
  // `xmldec.encoding` Encoding declaration, e.g. UTF-8
  // `xmldec.standalone` standalone document declaration: true or false

  // `doctype.pubID` public identifier of the external subset
  // `doctype.sysID` system identifier of the external subset

  // `options.headless` whether XML declaration and doctype will be included:
  //     true or false
  // `options.keepNullNodes` whether nodes with null values will be kept
  //     or ignored: true or false
  // `options.keepNullAttributes` whether attributes with null values will be
  //     kept or ignored: true or false
  // `options.ignoreDecorators` whether decorator strings will be ignored when
  //     converting JS objects: true or false
  // `options.separateArrayItems` whether array items are created as separate
  //     nodes when passed as an object value: true or false
  // `options.noDoubleEncoding` whether existing html entities are encoded:
  //     true or false
  // `options.stringify` a set of functions to use for converting values to
  //     strings
  // `options.writer` the default XML writer to use for converting nodes to
  //     string. If the default writer is not set, the built-in XMLStringWriter
  //     will be used instead.
  module.exports.create = function(name, xmldec, doctype, options) {
    var doc, root;
    if (name == null) {
      throw new Error("Root element needs a name.");
    }
    options = assign({}, xmldec, doctype, options);
    // create the document node
    doc = new XMLDocument(options);
    // add the root node
    root = doc.element(name);
    // prolog
    if (!options.headless) {
      doc.declaration(options);
      if ((options.pubID != null) || (options.sysID != null)) {
        doc.dtd(options);
      }
    }
    return root;
  };

  // Creates a new document and returns the document node for
  // chain-building the document tree

  // `options.keepNullNodes` whether nodes with null values will be kept
  //     or ignored: true or false
  // `options.keepNullAttributes` whether attributes with null values will be
  //     kept or ignored: true or false
  // `options.ignoreDecorators` whether decorator strings will be ignored when
  //     converting JS objects: true or false
  // `options.separateArrayItems` whether array items are created as separate
  //     nodes when passed as an object value: true or false
  // `options.noDoubleEncoding` whether existing html entities are encoded:
  //     true or false
  // `options.stringify` a set of functions to use for converting values to
  //     strings
  // `options.writer` the default XML writer to use for converting nodes to
  //     string. If the default writer is not set, the built-in XMLStringWriter
  //     will be used instead.

  // `onData` the function to be called when a new chunk of XML is output. The
  //          string containing the XML chunk is passed to `onData` as its single
  //          argument.
  // `onEnd`  the function to be called when the XML document is completed with
  //          `end`. `onEnd` does not receive any arguments.
  module.exports.begin = function(options, onData, onEnd) {
    if (isFunction(options)) {
      [onData, onEnd] = [options, onData];
      options = {};
    }
    if (onData) {
      return new XMLDocumentCB(options, onData, onEnd);
    } else {
      return new XMLDocument(options);
    }
  };

  module.exports.stringWriter = function(options) {
    return new XMLStringWriter(options);
  };

  module.exports.streamWriter = function(stream, options) {
    return new XMLStreamWriter(stream, options);
  };

  module.exports.implementation = new XMLDOMImplementation();

  module.exports.nodeType = NodeType;

  module.exports.writerState = WriterState;

}).call(this);


/***/ }),

/***/ 4091:
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 665:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(4091)(Yallist)
} catch (er) {}


/***/ }),

/***/ 3759:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verify = exports.importKeys = void 0;
const exec = __importStar(__nccwpck_require__(1514));
const tc = __importStar(__nccwpck_require__(7784));
function importKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        let keys = yield tc.downloadTool("https://swift.org/keys/all-keys.asc");
        yield exec.exec("gpg", ["--import", keys]);
    });
}
exports.importKeys = importKeys;
function verify(signature, archive) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec("gpg", [
            "--keyserver",
            "hkp://keyserver.ubuntu.com",
            "--refresh-keys",
            "Swift",
        ]);
        yield exec.exec("gpg", ["--verify", signature, archive]);
    });
}
exports.verify = verify;


/***/ }),

/***/ 2574:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.install = void 0;
const core = __importStar(__nccwpck_require__(2186));
const tc = __importStar(__nccwpck_require__(7784));
const io = __importStar(__nccwpck_require__(7436));
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const gpg = __importStar(__nccwpck_require__(3759));
const utils_1 = __nccwpck_require__(1314);
const exec = __importStar(__nccwpck_require__(1514));
const SWIFT_TOOL_CACHE_NAME = "swift";
function install(versionSpec, manifest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tc.find(SWIFT_TOOL_CACHE_NAME, versionSpec)) {
            yield exportVariables(versionSpec, manifest);
            return;
        }
        core.info(`Version ${versionSpec} was not found in the local cache`);
        let archivePath = yield tc.downloadTool(manifest.download_url);
        let extractPath = "";
        switch (manifest.platform) {
            case "xcode":
                archivePath = yield tc.downloadTool(manifest.download_url, path.join((0, utils_1.getTempDirectory)(), manifest.filename));
                const { exitCode, stdout, stderr } = yield exec.getExecOutput("installer", ["-pkg", archivePath, "-target", "CurrentUserHomeDirectory"]);
                if (exitCode !== 0) {
                    core.setFailed(stderr);
                }
                core.debug(stdout);
                const toolchain = manifest.filename.replace("-osx.pkg", ".xctoolchain");
                yield tc.cacheFile(path.join((0, utils_1.getToolchainsDirectory)(), toolchain), toolchain, SWIFT_TOOL_CACHE_NAME, versionSpec);
                break;
            case "ubuntu":
                archivePath = yield tc.downloadTool(manifest.download_url);
                yield gpg.importKeys();
                // core.info(`Downloading signature form ${manifest.download_url}.sig`);
                const signatureUrl = manifest.download_url + ".sig";
                const signature = yield tc.downloadTool(signatureUrl);
                yield gpg.verify(signature, archivePath);
                extractPath = yield tc.extractTar(archivePath);
                extractPath = path.join(extractPath, `swift-${versionSpec}-RELEASE-${manifest.platform}${manifest.platform_version || ""}`);
                yield tc.cacheDir(extractPath, SWIFT_TOOL_CACHE_NAME, versionSpec);
                break;
            case "windows":
                break;
            default:
                break;
        }
        yield exportVariables(versionSpec, manifest);
    });
}
exports.install = install;
function exportVariables(versionSpec, manifest) {
    return __awaiter(this, void 0, void 0, function* () {
        const installDir = tc.find(SWIFT_TOOL_CACHE_NAME, versionSpec);
        if (!installDir) {
            throw new Error([
                `Version ${versionSpec} with platform ${manifest.platform}${manifest.platform_version || ""} not found`,
                `The list of all available versions can be found here: https://www.swift.org/download`,
            ].join(os.EOL));
        }
        let SWIFT_VERSION = "";
        let SWIFT_PATH = "";
        switch (manifest.platform) {
            case "xcode":
                yield io.mkdirP((0, utils_1.getToolchainsDirectory)());
                const toolchain = manifest.filename.replace("-osx.pkg", ".xctoolchain");
                SWIFT_PATH = path.join((0, utils_1.getToolchainsDirectory)(), toolchain);
                if (fs.existsSync(SWIFT_PATH)) {
                    io.rmRF(SWIFT_PATH);
                }
                if (fs.existsSync((0, utils_1.getLatestSwiftToolchain)())) {
                    io.rmRF((0, utils_1.getLatestSwiftToolchain)());
                }
                fs.symlinkSync(path.join(installDir, toolchain), SWIFT_PATH);
                fs.symlinkSync(path.join(installDir, toolchain), (0, utils_1.getLatestSwiftToolchain)());
                const TOOLCHAINS = yield (0, utils_1.parseBundleIDFromPropertyList)(path.join(installDir, "Info.plist"));
                SWIFT_VERSION = (yield exec.getExecOutput("xcrun", [
                    "--toolchain",
                    `${TOOLCHAINS}`,
                    "--run",
                    "swift",
                    "--version",
                ])).stdout;
                core.exportVariable("TOOLCHAINS", TOOLCHAINS);
                break;
            case "ubuntu":
                SWIFT_VERSION = (yield exec.getExecOutput(path.join(SWIFT_PATH, "swift"), ["--version"])).stdout;
                SWIFT_PATH = path.join(installDir, "/usr/bin");
                break;
            default:
                break;
        }
        SWIFT_VERSION = (0, utils_1.parseVersionFromLog)(SWIFT_VERSION);
        core.addPath(SWIFT_PATH);
        core.setOutput("swift-version", SWIFT_VERSION);
        core.info(`Successfully set up Swift (${SWIFT_VERSION})`);
    });
}


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.main = void 0;
const core = __importStar(__nccwpck_require__(2186));
const manifest = __importStar(__nccwpck_require__(1635));
const installer = __importStar(__nccwpck_require__(2574));
const system_1 = __nccwpck_require__(4300);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let system = yield (0, system_1.getSystem)();
            const inputVersion = core.getInput("swift-version");
            if (inputVersion.length === 0) {
                core.warning("The `swift-version` input is not set. The latest version of Swift will be used.");
            }
            const versionSpec = manifest.evaluateVersion(inputVersion, system);
            const release = manifest.resolveReleaseFile(versionSpec, system);
            yield installer.install(versionSpec, release);
        }
        catch (err) {
            core.setFailed(err.message);
        }
    });
}
exports.main = main;


/***/ }),

/***/ 1635:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateVersion = exports.resolveReleaseFile = void 0;
const core = __importStar(__nccwpck_require__(2186));
const tc = __importStar(__nccwpck_require__(7784));
const semver = __importStar(__nccwpck_require__(1383));
const os = __importStar(__nccwpck_require__(612));
const system_1 = __nccwpck_require__(4300);
const SWIFT_WEBROOT = "https://download.swift.org";
const VERSIONS_LIST = [
    ["5.7.1", system_1.OS.all()],
    ["5.7", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.6.3", system_1.OS.all()],
    ["5.6.2", system_1.OS.all()],
    ["5.6.1", system_1.OS.all()],
    ["5.6", system_1.OS.all()],
    ["5.5.3", system_1.OS.all()],
    ["5.5.2", system_1.OS.all()],
    ["5.5.1", system_1.OS.all()],
    ["5.5", system_1.OS.all()],
    ["5.4.3", system_1.OS.all()],
    ["5.4.2", system_1.OS.all()],
    ["5.4.1", system_1.OS.all()],
    ["5.4", system_1.OS.all()],
    ["5.3.3", system_1.OS.all()],
    ["5.3.2", system_1.OS.all()],
    ["5.3.1", system_1.OS.all()],
    ["5.3", system_1.OS.all()],
    ["5.2.5", [system_1.OS.Ubuntu]],
    ["5.2.4", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.2.3", [system_1.OS.Ubuntu]],
    ["5.2.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.2.1", [system_1.OS.Ubuntu]],
    ["5.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.1.5", [system_1.OS.Ubuntu]],
    ["5.1.4", [system_1.OS.Ubuntu]],
    ["5.1.3", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.1.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.1.1", [system_1.OS.Ubuntu]],
    ["5.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.0.3", [system_1.OS.Ubuntu]],
    ["5.0.2", [system_1.OS.Ubuntu]],
    ["5.0.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["5.0", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.2.4", [system_1.OS.Ubuntu]],
    ["4.2.3", [system_1.OS.Ubuntu]],
    ["4.2.2", [system_1.OS.Ubuntu]],
    ["4.2.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.1.3", [system_1.OS.Ubuntu]],
    ["4.1.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.1.1", [system_1.OS.Ubuntu]],
    ["4.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.0.3", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.0.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["4.0", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["3.1.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["3.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["3.0.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["3.0.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["3.0", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["2.2.1", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
    ["2.2", [system_1.OS.MacOS, system_1.OS.Ubuntu]],
];
//download.swift.org/swift-5.7.1-release/ubuntu2204/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04.tar.gz
//download.swift.org/swift-5.7.1-release/ubuntu2204-aarch64/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz
//download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg
function resolveReleaseFile(versionSpec, system) {
    let platform;
    let platformVersion;
    let filename;
    switch (system.os) {
        case system_1.OS.MacOS:
            platform = "xcode";
            filename = `swift-${versionSpec}-RELEASE-osx.pkg`;
            break;
        case system_1.OS.Ubuntu:
            core.info(`${os.arch()}, ${os.platform()}, ${os.release()}, ${os.version()}`);
            platform = `ubuntu`;
            platformVersion = system.version;
            filename = `swift-${versionSpec}-RELEASE-${platform}${platformVersion}.tar.gz`;
            break;
        case system_1.OS.Windows:
            platform = "windows";
            platformVersion = "10";
            filename = `swift-${versionSpec}-RELEASE-${platform}${platformVersion}.exe`;
            break;
        default:
            throw new Error("Cannot create release file for an unsupported OS");
    }
    const SWIFT_BRANCH = `swift-${versionSpec}-release`;
    const SWIFT_WEBDIR = `${SWIFT_WEBROOT}/${SWIFT_BRANCH}/${platform}${(platformVersion === null || platformVersion === void 0 ? void 0 : platformVersion.replace(".", "")) || ""}`;
    return {
        filename: filename,
        platform: platform,
        platform_version: platformVersion,
        arch: process.arch,
        download_url: `${SWIFT_WEBDIR}/swift-${versionSpec}-RELEASE/${filename}`,
    };
}
exports.resolveReleaseFile = resolveReleaseFile;
function evaluateVersion(version, system) {
    let range = semver.validRange(version);
    if (range === null) {
        throw new Error("Version range is invalid");
    }
    let versions = VERSIONS_LIST.filter(([_, os]) => os.includes(system.os)).map(([version, _]) => semver.coerce(version).version);
    const semanticVersion = semver.coerce(tc.evaluateVersions(versions, version));
    return !semanticVersion
        ? ""
        : `${semanticVersion.major}.${semanticVersion.minor}${semanticVersion.patch > 0 ? `.${semanticVersion.patch}` : ""}`;
}
exports.evaluateVersion = evaluateVersion;


/***/ }),

/***/ 4300:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSystem = exports.OS = void 0;
const getos_1 = __importDefault(__nccwpck_require__(6068));
var OS;
(function (OS) {
    OS[OS["MacOS"] = 0] = "MacOS";
    OS[OS["Ubuntu"] = 1] = "Ubuntu";
    OS[OS["Windows"] = 2] = "Windows";
})(OS = exports.OS || (exports.OS = {}));
(function (OS) {
    function all() {
        return [OS.MacOS, OS.Ubuntu, OS.Windows];
    }
    OS.all = all;
})(OS = exports.OS || (exports.OS = {}));
const AVAILABLE_OS = {
    macOS: ["latest", "12.0", "11.0", "10.15"],
    Ubuntu: ["latest", "22.04", "20.04", "18.04", "16.04"],
    Windows: ["latest", "10"],
};
function getSystem() {
    return __awaiter(this, void 0, void 0, function* () {
        let detectedSystem = yield new Promise((resolve, reject) => {
            (0, getos_1.default)((error, os) => {
                os ? resolve(os) : reject(error || "No OS detected");
            });
        });
        let system;
        switch (detectedSystem.os) {
            case "darwin":
                system = { os: OS.MacOS, version: "latest", name: "macOS" };
                break;
            case "linux":
                if (detectedSystem.dist !== "Ubuntu") {
                    throw new Error(`"${detectedSystem.dist}" is not a supported linux distribution`);
                }
                system = {
                    os: OS.Ubuntu,
                    version: detectedSystem.release,
                    name: "Ubuntu",
                };
                break;
            case "win32":
                system = { os: OS.Windows, version: "latest", name: "Windows" };
                break;
            default:
                throw new Error(`"${detectedSystem.os}" is not a supported platform`);
        }
        if (!AVAILABLE_OS[system.name].includes(system.version)) {
            throw new Error(`Version "${system.version}" of ${system.name} is not supported`);
        }
        return system;
    });
}
exports.getSystem = getSystem;


/***/ }),

/***/ 1314:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLatestSwiftToolchain = exports.getToolchainsDirectory = exports.getTempDirectory = exports.parseBundleIDFromPropertyList = exports.parseVersionFromLog = void 0;
const assert = __importStar(__nccwpck_require__(9491));
const pl = __importStar(__nccwpck_require__(1933));
const fs = __importStar(__nccwpck_require__(7147));
const path_1 = __importDefault(__nccwpck_require__(1017));
const os = __importStar(__nccwpck_require__(2037));
function parseVersionFromLog(message) {
    var _a;
    const match = message.match(/Swift\ version (?<version>[0-9]+\.[0-9+]+(\.[0-9]+)?)/);
    return ((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.version) || "";
}
exports.parseVersionFromLog = parseVersionFromLog;
function parseBundleIDFromPropertyList(plist) {
    try {
        const { CFBundleIdentifier } = pl.parse(fs.readFileSync(plist, "utf8"));
        return CFBundleIdentifier || "";
    }
    catch (error) {
        return "";
    }
}
exports.parseBundleIDFromPropertyList = parseBundleIDFromPropertyList;
function getTempDirectory() {
    const tempDirectory = process.env["RUNNER_TEMP"] || "";
    assert.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
    return tempDirectory;
}
exports.getTempDirectory = getTempDirectory;
function getToolchainsDirectory() {
    return path_1.default.join(os.homedir(), "/Library/Developer/Toolchains");
}
exports.getToolchainsDirectory = getToolchainsDirectory;
function getLatestSwiftToolchain() {
    return path_1.default.join(getToolchainsDirectory(), "swift-latest.xctoolchain");
}
exports.getLatestSwiftToolchain = getLatestSwiftToolchain;


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 612:
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 1405:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"/etc/fedora-release":["Fedora"],"/etc/redhat-release":["RHEL","RHAS","Red Hat Linux","Scientific Linux","ScientificSL","ScientificCERNSLC","ScientificFermiLTS","ScientificSLF","CentOS"],"/etc/redhat_version":["RHEL","RHAS","Red Hat Linux","Scientific Linux","ScientificSL","ScientificCERNSLC","ScientificFermiLTS","ScientificSLF"],"/etc/SuSE-release":["SUSE Linux"],"/etc/lsb-release":["Ubuntu","Chakra","IYCC","Linux Mint","elementary OS","Arch Linux","Manjaro Linux","KDE neon","Zorin"],"/etc/debian_version":["Debian"],"/etc/debian_release":["Debian"],"/etc/arch-release":["Arch Linux"],"/etc/NIXOS":["NixOS"],"/etc/annvix-release":["Annvix"],"/etc/arklinux-release":["Arklinux"],"/etc/aurox-release":["Aurox Linux"],"/etc/blackcat-release":["BlackCat"],"/etc/cobalt-release":["Cobalt"],"/etc/conectiva-release":["Conectiva"],"/etc/eos-version":["FreeEOS"],"/etc/gentoo-release":["Gentoo Linux"],"/etc/hlfs-release":["HLFS"],"/etc/hlfs_version":["HFLS"],"/etc/immunix-release":["Immunix"],"/knoppix_version":["Knoppix"],"/etc/lfs-release":["Linux-From-Scratch"],"/etc/lfs_version":["Linux-From-Scratch"],"/etc/linuxppc-release":["Linux-PPC"],"/etc/mageia-release":["Mageia"],"/etc/mandriva-release":["Mandriva Linux","Mandrake Linux"],"/etc/mandakelinux-release":["Mandriva Linux","Mandrake Linux"],"/etc/mandrake-release":["Mandrake","Mandriva Linux","Mandrake Linux"],"/etc/mklinux-release":["MkLinux"],"/etc/nld-release":["Novell Linux Desktop"],"/etc/pld-release":["PLD Linux"],"/etc/rubix-version":["Rubix"],"/etc/slackware-version":["Slackware"],"/etc/slackware-release":["Slackware"],"/etc/e-smith-release":["SME Server"],"/etc/release":["Solaris SPARC"],"/etc/sun-release":["Sun JDS"],"/etc/novell-release":["SUSE Linux"],"/etc/sles-release":["SUSE Linux ES9"],"/etc/synoinfo.conf":["Synology"],"/etc/tinysofa-release":["Tiny Sofa"],"/etc/trustix-release":["Trustix"],"/etc/trustix-version":["Trustix"],"/etc/turbolinux-release":["TurboLinux"],"/etc/ultrapenguin-release":["UltraPenguin"],"/etc/UnitedLinux-release":["UnitedLinux"],"/etc/va-release":["VA-Linux/RH-VALE"],"/etc/yellowdog-release":["Yellow Dog"],"/etc/alpine-release":["Alpine Linux"],"/etc/system-release":["Amazon Linux"],"/etc/os-release":["Raspbian"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __nccwpck_require__(399);
(0, main_1.main)();

})();

module.exports = __webpack_exports__;
/******/ })()
;