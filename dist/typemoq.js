(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('circular-json')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'circular-json'], factory) :
	(factory((global.TypeMoq = {}),global._,global.CircularJSON));
}(this, (function (exports,_,CircularJSON) {

(function (MockBehavior) {
    MockBehavior[MockBehavior["Loose"] = 0] = "Loose";
    MockBehavior[MockBehavior["Strict"] = 1] = "Strict";
})(exports.MockBehavior || (exports.MockBehavior = {}));

(function (ExpectedCallType) {
    ExpectedCallType[ExpectedCallType["InAnyOrder"] = 0] = "InAnyOrder";
    ExpectedCallType[ExpectedCallType["InSequence"] = 1] = "InSequence";
})(exports.ExpectedCallType || (exports.ExpectedCallType = {}));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Exception = (function (_super) {
    __extends$1(Exception, _super);
    function Exception(name, message) {
        var _this = _super.call(this, message) || this;
        _this.name = name;
        Object.setPrototypeOf(_this, Exception.prototype);
        return _this;
    }
    Exception.prototype.toString = function () {
        var errMsg = this.message ? this.name + " - " + this.message : this.name;
        return errMsg;
    };
    return Exception;
}(Error));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MockExceptionReason;
(function (MockExceptionReason) {
    MockExceptionReason[MockExceptionReason["NoSetup"] = "no setup expression found for"] = "NoSetup";
    MockExceptionReason[MockExceptionReason["MoreThanOneSetup"] = "more than one setup expression found for"] = "MoreThanOneSetup";
    MockExceptionReason[MockExceptionReason["InvalidArg"] = "invalid argument"] = "InvalidArg";
    MockExceptionReason[MockExceptionReason["InvalidSetup"] = "invalid setup expression"] = "InvalidSetup";
    MockExceptionReason[MockExceptionReason["InvalidMatcher"] = "invalid matching expression"] = "InvalidMatcher";
    MockExceptionReason[MockExceptionReason["UnknownGlobalType"] = "unknown global type"] = "UnknownGlobalType";
    MockExceptionReason[MockExceptionReason["CallCountVerificationFailed"] = "invocation count verification failed"] = "CallCountVerificationFailed";
    MockExceptionReason[MockExceptionReason["CallOrderVerificationFailed"] = "invocation order verification failed"] = "CallOrderVerificationFailed";
    MockExceptionReason[MockExceptionReason["InvalidDynamicProxyRuntime"] = "invalid dynamic proxy runtime"] = "InvalidDynamicProxyRuntime";
})(MockExceptionReason || (MockExceptionReason = {}));
var MockException = (function (_super) {
    __extends$2(MockException, _super);
    function MockException(reason, ctx, message) {
        if (message === void 0) { message = undefined; }
        var _this = _super.call(this, "MockException", message) || this;
        _this.reason = reason;
        _this.ctx = ctx;
        _this.message = message;
        Object.setPrototypeOf(_this, MockException.prototype);
        return _this;
    }
    MockException.prototype.toString = function () {
        var errMsg = this.name + " - " + this.reason;
        if (this.message)
            errMsg = errMsg + " (" + this.message + ")";
        return errMsg;
    };
    return MockException;
}(Exception));

var Times = (function () {
    function Times(_condition, min, max, failMessage) {
        this._condition = _condition;
        this.min = min;
        this.max = max;
        this._failMessage = _.template(failMessage);
    }
    Times.prototype.failMessage = function (call) {
        return this._failMessage({ i: call, min: this.min, max: this.max, c: this._lastCallCount });
    };
    Times.prototype.verify = function (callCount) {
        this._lastCallCount = callCount;
        return this._condition(callCount);
    };
    Times.checkArg = function (n, target) {
        if (n < 0)
            throw new MockException(MockExceptionReason.InvalidArg, undefined, target + " argument cannot be a negative number");
    };
    Times.exactly = function (n) {
        Times.checkArg(n, "'Times.exactly'");
        return new Times(function (c) { return c === n; }, n, n, Times.NO_MATCHING_CALLS_EXACTLY_N_TIMES);
    };
    Times.atLeast = function (n) {
        Times.checkArg(n, "'Times.atLeast'");
        return new Times(function (c) { return c >= n; }, n, 255, Times.NO_MATCHING_CALLS_AT_LEAST_N_TIMES);
    };
    Times.atMost = function (n) {
        Times.checkArg(n, "'Times.atMost'");
        return new Times(function (c) { return c >= 0 && c <= n; }, 0, n, Times.NO_MATCHING_CALLS_AT_MOST_N_TIMES);
    };
    Times.never = function () {
        return Times.exactly(0);
    };
    Times.once = function () {
        return Times.exactly(1);
    };
    Times.atLeastOnce = function () {
        return Times.atLeast(1);
    };
    Times.atMostOnce = function () {
        return Times.atMost(1);
    };
    Times.prototype.toString = function () {
        var res = "";
        if (this.min === this.max) {
            if (this.min === 0) {
                res = "never";
            }
            else if (this.min === 1) {
                res = "once";
            }
            else {
                res = this.min + " times";
            }
        }
        else {
            if (this.min === 0 && this.max !== 255)
                res = "at most " + this.max + " times";
            else
                res = "at least " + this.min + " times";
        }
        return res;
    };
    Times.NO_MATCHING_CALLS_EXACTLY_N_TIMES = "expected invocation of <%= i %> exactly <%= min %> times, invoked <%= c %> times";
    Times.NO_MATCHING_CALLS_AT_LEAST_N_TIMES = "expected invocation of <%= i %> at least <%= min %> times, invoked <%= c %> times";
    Times.NO_MATCHING_CALLS_AT_MOST_N_TIMES = "expected invocation of <%= i %> at most <%= max %> times, invoked <%= c %> times";
    return Times;
}());

var PropertyRetriever = (function () {
    function PropertyRetriever() {
    }
    PropertyRetriever.getOwnEnumerables = function (obj) {
        return this._getPropertyNames(obj, true, false, this._enumerable);
    };
    PropertyRetriever.getOwnNonenumerables = function (obj) {
        return this._getPropertyNames(obj, true, false, this._notEnumerable);
    };
    PropertyRetriever.getOwnEnumerablesAndNonenumerables = function (obj) {
        return this._getPropertyNames(obj, true, false, this._enumerableAndNotEnumerable);
    };
    PropertyRetriever.getPrototypeEnumerables = function (obj) {
        return this._getPropertyNames(obj, false, true, this._enumerable);
    };
    PropertyRetriever.getPrototypeNonenumerables = function (obj) {
        return this._getPropertyNames(obj, false, true, this._notEnumerable);
    };
    PropertyRetriever.getPrototypeEnumerablesAndNonenumerables = function (obj) {
        return this._getPropertyNames(obj, false, true, this._enumerableAndNotEnumerable);
    };
    PropertyRetriever.getOwnAndPrototypeEnumerables = function (obj) {
        return this._getPropertyNames(obj, true, true, this._enumerable);
    };
    PropertyRetriever.getOwnAndPrototypeNonenumerables = function (obj) {
        return this._getPropertyNames(obj, true, true, this._notEnumerable);
    };
    PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables = function (obj) {
        return this._getPropertyNames(obj, true, true, this._enumerableAndNotEnumerable);
    };
    PropertyRetriever._enumerable = function (obj, prop) {
        return obj.propertyIsEnumerable(prop);
    };
    PropertyRetriever._notEnumerable = function (obj, prop) {
        return !obj.propertyIsEnumerable(prop);
    };
    PropertyRetriever._enumerableAndNotEnumerable = function (obj, prop) {
        return true;
    };
    PropertyRetriever._getPropertyNames = function (obj, iterateSelfBool, iteratePrototypeBool, includePropCb) {
        var result = [];
        do {
            if (iterateSelfBool) {
                var props = Object.getOwnPropertyNames(obj);
                var _loop_1 = function (prop) {
                    var duplicate = _.find(result, function (p) { return p.name === prop; });
                    if (!duplicate && includePropCb(obj, prop)) {
                        var propDesc = Object.getOwnPropertyDescriptor(obj, prop);
                        result.push({ name: prop, desc: propDesc });
                    }
                };
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var prop = props_1[_i];
                    _loop_1(prop);
                }
                
            }
            if (!iteratePrototypeBool) {
                break;
            }
            iterateSelfBool = true;
        } while (obj = Object.getPrototypeOf(obj));
        return result;
    };
    return PropertyRetriever;
}());

var Consts = (function () {
    function Consts() {
    }
    Consts.IMATCH_ID_VALUE = "438A51D3-6864-49D7-A655-CA1153B86965";
    Consts.IMATCH_ID_NAME = "___id";
    Consts.IMATCH_MATCHES_NAME = "___matches";
    Consts.IPROXY_ID_VALUE = "BCDF5CE5-F0DF-40B7-8BA0-69DF395033C8";
    Consts.IPROXY_ID_NAME = "___id";
    return Consts;
}());

var Match = (function () {
    function Match() {
    }
    Match.isMatcher = function (x) {
        return !_.isNil(x) &&
            !_.isUndefined(x[Consts.IMATCH_MATCHES_NAME]) &&
            !_.isUndefined(x[Consts.IMATCH_ID_NAME]) &&
            x[Consts.IMATCH_ID_NAME] === Consts.IMATCH_ID_VALUE;
    };
    return Match;
}());

var Utils = (function () {
    function Utils() {
    }
    Utils.functionName = function (fun) {
        var res;
        if (fun.name) {
            res = fun.name;
        }
        else {
            var repr = fun.toString();
            repr = repr.substr("function ".length);
            res = repr.substr(0, repr.indexOf("("));
        }
        return res;
    };
    Utils.objectName = function (obj) {
        var res = Utils.functionName(obj.constructor);
        return res;
    };
    Utils.argsName = function (args) {
        var argsArray = Array.prototype.slice.call(args);
        var sargs = argsArray.map(function (x) {
            var res = "";
            if (Match.isMatcher(x)) {
                res = x.toString();
            }
            else {
                var replacer = function (key, value) {
                    if (value === undefined)
                        return "undefined";
                    if (_.isFunction(value))
                        return "Function";
                    return value;
                };
                res = CircularJSON.stringify(x, replacer);
            }
            return res;
        });
        var res = _.join(sargs);
        return res;
    };
    Utils.conthunktor = function (ctor, args) {
        var ret = new (ctor.bind.apply(ctor, [void 0].concat(args)))();
        return ret;
    };
    Utils.clone = function (target, source) {
        var sourceProps = PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(source);
        for (var _i = 0, sourceProps_1 = sourceProps; _i < sourceProps_1.length; _i++) {
            var p = sourceProps_1[_i];
            Object.defineProperty(target, p.name, p.desc);
        }
    };
    return Utils;
}());

var MatchAnyObject = (function () {
    function MatchAnyObject(_ctor) {
        this._ctor = _ctor;
        this.___id = Consts.IMATCH_ID_VALUE;
    }
    MatchAnyObject.prototype.___matches = function (object) {
        var match = false;
        if (object && object.constructor.prototype == this._ctor.prototype)
            match = true;
        return match;
    };
    MatchAnyObject.prototype.toString = function () {
        var res = "It.isAnyObject(" + Utils.functionName(this._ctor) + ")";
        return res;
    };
    return MatchAnyObject;
}());
var MatchAny = (function () {
    function MatchAny() {
        this.___id = Consts.IMATCH_ID_VALUE;
    }
    MatchAny.prototype.___matches = function (object) {
        var match = true;
        return match;
    };
    MatchAny.prototype.toString = function () {
        return "It.isAny()";
    };
    return MatchAny;
}());
var MatchAnyString = (function () {
    function MatchAnyString() {
        this.___id = Consts.IMATCH_ID_VALUE;
    }
    MatchAnyString.prototype.___matches = function (object) {
        var match = false;
        if (_.isString(object))
            match = true;
        return match;
    };
    MatchAnyString.prototype.toString = function () {
        return "It.isAnyString()";
    };
    return MatchAnyString;
}());
var MatchAnyNumber = (function () {
    function MatchAnyNumber() {
        this.___id = Consts.IMATCH_ID_VALUE;
    }
    MatchAnyNumber.prototype.___matches = function (object) {
        var match = false;
        if (_.isNumber(object))
            match = true;
        return match;
    };
    MatchAnyNumber.prototype.toString = function () {
        return "It.isAnyNumber()";
    };
    return MatchAnyNumber;
}());

var MatchPred = (function () {
    function MatchPred(_pred) {
        this._pred = _pred;
        this.___id = Consts.IMATCH_ID_VALUE;
    }
    MatchPred.prototype.___matches = function (object) {
        var match = false;
        if (object && this._pred(object))
            match = true;
        return match;
    };
    MatchPred.prototype.toString = function () {
        var res = "It.is(" + this._pred + ")";
        return res;
    };
    return MatchPred;
}());

var MatchValue = (function () {
    function MatchValue(value) {
        this.___id = Consts.IMATCH_ID_VALUE;
        this._value = _.cloneDeep(value);
    }
    MatchValue.prototype.___matches = function (object) {
        var match = false;
        if (_.isEqual(this._value, object))
            match = true;
        return match;
    };
    MatchValue.prototype.toString = function () {
        var valueName = Utils.argsName([this._value]);
        var res = "It.isValue(" + valueName + ")";
        return res;
    };
    return MatchValue;
}());

var MatchObjectWith = (function () {
    function MatchObjectWith(value) {
        this.___id = Consts.IMATCH_ID_VALUE;
        this._value = _.cloneDeep(value);
    }
    MatchObjectWith.prototype.___matches = function (object) {
        var match = false;
        var partial = _.pick(object, _.keys(this._value));
        if (_.isEqual(this._value, partial))
            match = true;
        return match;
    };
    MatchObjectWith.prototype.toString = function () {
        var valueName = Utils.argsName([this._value]);
        var res = "It.isObjectWith(" + valueName + ")";
        return res;
    };
    return MatchObjectWith;
}());

var CallType;
(function (CallType) {
    CallType[CallType["UNKNOWN"] = 0] = "UNKNOWN";
    CallType[CallType["PROPERTY"] = 1] = "PROPERTY";
    CallType[CallType["FUNCTION"] = 2] = "FUNCTION";
})(CallType || (CallType = {}));
var ProxyType;
(function (ProxyType) {
    ProxyType[ProxyType["STATIC"] = 0] = "STATIC";
    ProxyType[ProxyType["DYNAMIC"] = 1] = "DYNAMIC";
})(ProxyType || (ProxyType = {}));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InvocationType;
(function (InvocationType) {
    InvocationType[InvocationType["NONE"] = 0] = "NONE";
    InvocationType[InvocationType["SETUP"] = 1] = "SETUP";
    InvocationType[InvocationType["EXECUTE"] = 2] = "EXECUTE";
})(InvocationType || (InvocationType = {}));
var BaseInvocation = (function () {
    function BaseInvocation(proxyType, callType) {
        this.proxyType = proxyType;
        this.callType = callType;
        this.invocationType = InvocationType.NONE;
    }
    Object.defineProperty(BaseInvocation.prototype, "isAnUnknownDynamicCallAtExecution", {
        get: function () {
            return this.proxyType == ProxyType.DYNAMIC &&
                this.callType == CallType.UNKNOWN &&
                this.invocationType == InvocationType.EXECUTE;
        },
        enumerable: true,
        configurable: true
    });
    
    return BaseInvocation;
}());
var MethodInvocation = (function (_super) {
    __extends$3(MethodInvocation, _super);
    function MethodInvocation(_that, _property, _args, proxyType, callType) {
        if (proxyType === void 0) { proxyType = ProxyType.STATIC; }
        if (callType === void 0) { callType = CallType.FUNCTION; }
        var _this = _super.call(this, proxyType, callType) || this;
        _this._that = _that;
        _this._property = _property;
        _this._args = _args;
        return _this;
    }
    Object.defineProperty(MethodInvocation.prototype, "args", {
        get: function () { return this._args || { length: 0, callee: null }; },
        set: function (value) { this._args = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodInvocation.prototype, "property", {
        get: function () { return this._property; },
        enumerable: true,
        configurable: true
    });
    MethodInvocation.prototype.invokeBase = function () {
        var thatClone = this._that || this._property.obj;
        this.returnValue = this._property.toFunc.apply(thatClone, this._args);
    };
    MethodInvocation.prototype.toString = function () {
        var res = this.property + "(" + Utils.argsName(this.args) + ")";
        return res;
    };
    return MethodInvocation;
}(BaseInvocation));
var ValueGetterInvocation = (function (_super) {
    __extends$3(ValueGetterInvocation, _super);
    function ValueGetterInvocation(_property, value, proxyType, callType) {
        if (proxyType === void 0) { proxyType = ProxyType.STATIC; }
        if (callType === void 0) { callType = CallType.PROPERTY; }
        var _this = _super.call(this, proxyType, callType) || this;
        _this._property = _property;
        _this.value = value;
        _this.returnValue = value;
        return _this;
    }
    Object.defineProperty(ValueGetterInvocation.prototype, "args", {
        get: function () {
            var args = [];
            Object.defineProperty(args, "callee", { configurable: true, enumerable: true, writable: false, value: null });
            return args;
        },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueGetterInvocation.prototype, "property", {
        get: function () { return this._property; },
        enumerable: true,
        configurable: true
    });
    ValueGetterInvocation.prototype.invokeBase = function () {
        this.returnValue = this._property.obj[this._property.name];
    };
    ValueGetterInvocation.prototype.toString = function () {
        var res = "" + this.property;
        return res;
    };
    return ValueGetterInvocation;
}(BaseInvocation));
var DynamicGetInvocation = (function (_super) {
    __extends$3(DynamicGetInvocation, _super);
    function DynamicGetInvocation(property, value) {
        var _this = _super.call(this, property, value, ProxyType.DYNAMIC, CallType.UNKNOWN) || this;
        _this.returnValue = value;
        return _this;
    }
    return DynamicGetInvocation;
}(ValueGetterInvocation));
var ValueSetterInvocation = (function (_super) {
    __extends$3(ValueSetterInvocation, _super);
    function ValueSetterInvocation(_property, args, proxyType, callType) {
        if (proxyType === void 0) { proxyType = ProxyType.STATIC; }
        if (callType === void 0) { callType = CallType.PROPERTY; }
        var _this = _super.call(this, proxyType, callType) || this;
        _this._property = _property;
        _this._args = args;
        return _this;
    }
    Object.defineProperty(ValueSetterInvocation.prototype, "args", {
        get: function () { return this._args; },
        set: function (value) { this._args = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueSetterInvocation.prototype, "property", {
        get: function () { return this._property; },
        enumerable: true,
        configurable: true
    });
    ValueSetterInvocation.prototype.invokeBase = function () {
        this._property.obj[this._property.name] = this._args[0];
        this.returnValue = this._property.obj[this._property.name];
    };
    ValueSetterInvocation.prototype.toString = function () {
        var res = this.property + " = " + Utils.argsName(this.args[0]);
        return res;
    };
    return ValueSetterInvocation;
}(BaseInvocation));
var MethodGetterInvocation = (function (_super) {
    __extends$3(MethodGetterInvocation, _super);
    function MethodGetterInvocation(_property, _getter, proxyType, callType) {
        if (proxyType === void 0) { proxyType = ProxyType.STATIC; }
        if (callType === void 0) { callType = CallType.FUNCTION; }
        var _this = _super.call(this, proxyType, callType) || this;
        _this._property = _property;
        _this._getter = _getter;
        return _this;
    }
    Object.defineProperty(MethodGetterInvocation.prototype, "args", {
        get: function () {
            var args = [];
            Object.defineProperty(args, "callee", { configurable: true, enumerable: true, writable: false, value: null });
            return args;
        },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodGetterInvocation.prototype, "property", {
        get: function () { return this._property; },
        enumerable: true,
        configurable: true
    });
    MethodGetterInvocation.prototype.invokeBase = function () {
        this.returnValue = this._property.obj[this._property.name];
    };
    MethodGetterInvocation.prototype.toString = function () {
        var res = "" + this.property;
        return res;
    };
    return MethodGetterInvocation;
}(BaseInvocation));
var MethodSetterInvocation = (function (_super) {
    __extends$3(MethodSetterInvocation, _super);
    function MethodSetterInvocation(_property, _setter, args, proxyType, callType) {
        if (proxyType === void 0) { proxyType = ProxyType.STATIC; }
        if (callType === void 0) { callType = CallType.FUNCTION; }
        var _this = _super.call(this, proxyType, callType) || this;
        _this._property = _property;
        _this._setter = _setter;
        _this._args = args;
        return _this;
    }
    Object.defineProperty(MethodSetterInvocation.prototype, "args", {
        get: function () { return this._args; },
        set: function (value) { this._args = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodSetterInvocation.prototype, "property", {
        get: function () { return this._property; },
        enumerable: true,
        configurable: true
    });
    MethodSetterInvocation.prototype.invokeBase = function () {
        this._property.obj[this._property.name] = this._args[0];
        this.returnValue = this._property.obj[this._property.name];
    };
    MethodSetterInvocation.prototype.toString = function () {
        var res = this.property + "(" + Utils.argsName(this.args[0]) + ")";
        return res;
    };
    return MethodSetterInvocation;
}(BaseInvocation));
var MethodInfo = (function () {
    function MethodInfo(obj, name, desc) {
        this.obj = obj;
        this.name = name;
        if (desc)
            this.desc = desc;
    }
    Object.defineProperty(MethodInfo.prototype, "toFunc", {
        get: function () {
            var func = _.isFunction(this.obj) ? this.obj : this.obj[this.name];
            return func;
        },
        enumerable: true,
        configurable: true
    });
    MethodInfo.prototype.toString = function () {
        var objName = Utils.objectName(this.obj);
        var res = _.isFunction(this.obj) ? "" + objName : objName + "." + this.name;
        return res;
    };
    return MethodInfo;
}());
var PropertyInfo = (function () {
    function PropertyInfo(obj, name, desc) {
        this.obj = obj;
        this.name = name;
        if (desc)
            this.desc = desc;
    }
    PropertyInfo.prototype.toString = function () {
        var objName = Utils.objectName(this.obj);
        var res = objName + "." + this.name;
        return res;
    };
    return PropertyInfo;
}());

var ProxyES5 = (function () {
    function ProxyES5(target, interceptor) {
        var _this = this;
        this.___id = Consts.IPROXY_ID_VALUE;
        this.check(target);
        var that = this;
        var props = PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(target);
        _.each(props, function (prop) {
            if (_.isFunction(prop.desc.value)) {
                var propDesc = {
                    configurable: prop.desc.configurable,
                    enumerable: prop.desc.enumerable,
                    writable: prop.desc.writable
                };
                _this.defineMethodProxy(that, interceptor, target, prop.name, propDesc);
            }
            else {
                var propDesc = {
                    configurable: prop.desc.configurable,
                    enumerable: prop.desc.enumerable
                };
                if (prop.desc.value !== undefined)
                    _this.defineValuePropertyProxy(that, interceptor, target, prop.name, prop.desc.value, propDesc);
                else
                    _this.defineGetSetPropertyProxy(that, interceptor, target, prop.name, prop.desc.get, prop.desc.set, propDesc);
            }
        });
    }
    ProxyES5.of = function (target, interceptor) {
        ProxyES5.check(target);
        var result;
        if (_.isFunction(target)) {
            var funcName = Utils.functionName(target);
            result = ProxyES5.methodProxyValue(undefined, interceptor, target, funcName, null);
        }
        else {
            result = new ProxyES5(target, interceptor);
        }
        return result;
    };
    ProxyES5.isProxy = function (obj) {
        if (!_.isNil(obj) &&
            !_.isUndefined(obj[Consts.IPROXY_ID_NAME]) && obj[Consts.IPROXY_ID_NAME] === Consts.IPROXY_ID_VALUE)
            return true;
        else
            return false;
    };
    ProxyES5.check = function (target) {
        ProxyES5.checkNotNullOrUndefined(target);
        var ok = false;
        if (_.isFunction(target) ||
            (_.isObject(target) && !ProxyES5.isPrimitiveObject(target)))
            ok = true;
        if (!ok)
            throw new MockException(MockExceptionReason.InvalidArg, target, "'" + target + "'; proxy argument should be a function or a non primitive object");
    };
    ProxyES5.prototype.check = function (target) {
        ProxyES5.checkNotNullOrUndefined(target);
        var ok = false;
        if (!_.isFunction(target) &&
            (_.isObject(target) && !ProxyES5.isPrimitiveObject(target)))
            ok = true;
        if (!ok)
            throw new MockException(MockExceptionReason.InvalidArg, target, "'" + target + "'; proxy argument should be a non primitive object");
    };
    ProxyES5.checkNotNullOrUndefined = function (instance) {
        if (_.isNil(instance))
            throw new MockException(MockExceptionReason.InvalidArg, instance, "'" + instance + "'; proxy argument is required");
    };
    ProxyES5.isPrimitiveObject = function (obj) {
        var result = false;
        if (_.isFunction(obj) ||
            _.isArray(obj) ||
            _.isDate(obj) ||
            _.isNull(obj))
            result = true;
        return result;
    };
    ProxyES5.prototype.defineMethodProxy = function (that, interceptor, target, propName, propDesc) {
        if (propDesc === void 0) { propDesc = { configurable: true, enumerable: true, writable: false }; }
        propDesc.value = ProxyES5.methodProxyValue(that, interceptor, target, propName, propDesc);
        this.defineProperty(that, propName, propDesc);
    };
    ProxyES5.methodProxyValue = function (that, interceptor, target, propName, propDesc) {
        function proxy() {
            var method = new MethodInfo(target, propName, propDesc);
            var invocation = new MethodInvocation(that, method, arguments);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        return proxy;
    };
    ProxyES5.prototype.defineValuePropertyProxy = function (that, interceptor, target, propName, propValue, propDesc) {
        if (propDesc === void 0) { propDesc = { configurable: true, enumerable: true }; }
        function getProxy() {
            var method = new PropertyInfo(target, propName);
            var invocation = new ValueGetterInvocation(method, propValue);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        propDesc.get = getProxy;
        function setProxy(v) {
            var method = new PropertyInfo(target, propName);
            var invocation = new ValueSetterInvocation(method, arguments);
            interceptor.intercept(invocation);
        }
        propDesc.set = setProxy;
        this.defineProperty(that, propName, propDesc);
    };
    ProxyES5.prototype.defineGetSetPropertyProxy = function (that, interceptor, target, propName, get, set, propDesc) {
        if (propDesc === void 0) { propDesc = { configurable: true, enumerable: true }; }
        function getProxy() {
            var method = new PropertyInfo(target, propName);
            var invocation = new MethodGetterInvocation(method, get);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        propDesc.get = getProxy;
        function setProxy(v) {
            var method = new PropertyInfo(target, propName);
            var invocation = new MethodSetterInvocation(method, set, arguments);
            interceptor.intercept(invocation);
        }
        propDesc.set = setProxy;
        this.defineProperty(that, propName, propDesc);
    };
    ProxyES5.prototype.defineProperty = function (obj, name, desc) {
        try {
            Object.defineProperty(obj, name, desc);
        }
        catch (e) {
            console.log(e.message);
        }
    };
    return ProxyES5;
}());

var ProxyES6 = (function () {
    function ProxyES6(target, handler) {
        this.___id = Consts.IPROXY_ID_VALUE;
        var p = new Proxy(target, handler);
        p[Symbol.toStringTag] = Function.prototype.toString.bind(target);
        return p;
    }
    ProxyES6.of = function (target, handler) {
        ProxyES6.check();
        var result = new ProxyES6(target, handler);
        return result;
    };
    ProxyES6.check = function () {
        if (typeof Proxy === "undefined")
            throw new MockException(MockExceptionReason.InvalidDynamicProxyRuntime, null, "ES6 Proxy object not detected; the dynamic mocking feature requires ES6 Proxy object support");
    };
    return ProxyES6;
}());

var ProxyES6Handler = (function () {
    function ProxyES6Handler(_interceptor) {
        this._interceptor = _interceptor;
    }
    ProxyES6Handler.prototype.apply = function (target, thisArg, argArray) {
        var funcName = Utils.functionName(target);
        var method = new MethodInfo(target, funcName);
        var invocation = new MethodInvocation(target, method, argArray, ProxyType.DYNAMIC);
        this._interceptor.intercept(invocation);
        return invocation.returnValue;
    };
    ProxyES6Handler.prototype.get = function (target, p, receiver) {
        var _this = this;
        if (p !== Symbol.toStringTag &&
            p !== Symbol.toPrimitive &&
            p !== "toJSON") {
            var propValue = target[p];
            var method = new PropertyInfo(target, p);
            var invocation_1 = new DynamicGetInvocation(method, propValue);
            this._interceptor.intercept(invocation_1);
            if (invocation_1.callType == CallType.PROPERTY &&
                invocation_1.property.desc)
                return invocation_1.returnValue;
            else
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this._interceptor.removeInvocation(invocation_1);
                    var method = new MethodInfo(target, p);
                    var methodInvocation = new MethodInvocation(target, method, args, ProxyType.DYNAMIC);
                    _this._interceptor.intercept(methodInvocation);
                    return methodInvocation.returnValue;
                };
        }
        else
            return Reflect.get(target, p, receiver);
    };
    ProxyES6Handler.prototype.set = function (target, p, value, receiver) {
        if (p !== Symbol.toStringTag) {
            var method = new PropertyInfo(target, p);
            var invocation = new ValueSetterInvocation(method, [value], ProxyType.DYNAMIC);
            this._interceptor.intercept(invocation);
        }
        return Reflect.set(target, p, value, receiver);
    };
    ProxyES6Handler.prototype.defineProperty = function (target, p, attributes) {
        attributes.configurable = true;
        return Reflect.defineProperty(target, p, attributes);
    };
    return ProxyES6Handler;
}());

var ProxyFactory = (function () {
    function ProxyFactory() {
    }
    ProxyFactory.createProxy = function (target, interceptor) {
        var proxy = ProxyES5.of(target, interceptor);
        return proxy;
    };
    ProxyFactory.createProxyES6 = function (target, interceptor) {
        var proxyHandler = new ProxyES6Handler(interceptor);
        var proxy = ProxyES6.of(target, proxyHandler);
        return proxy;
    };
    return ProxyFactory;
}());

var MockBase = (function () {
    function MockBase(target, canOverrideTarget, behavior) {
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        this.target = target;
        this.canOverrideTarget = canOverrideTarget;
        this.behavior = behavior;
        this._id = this.generateId();
        this._name = this.getNameOf(this.target);
    }
    Object.defineProperty(MockBase.prototype, "object", {
        get: function () { return this._proxy; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockBase.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockBase.prototype, "callBase", {
        get: function () { return this._callBase; },
        set: function (value) { this._callBase = value; },
        enumerable: true,
        configurable: true
    });
    MockBase.prototype.generateId = function () {
        return "Mock<" + _.uniqueId() + ">";
    };
    MockBase.prototype.getNameOf = function (instance) {
        var result;
        if (_.isFunction(instance)) {
            result = Utils.functionName(instance);
        }
        else if (_.isObject(instance)) {
            var ctor = instance.constructor;
            result = Utils.functionName(ctor);
        }
        if (result)
            result = result.trim();
        return result;
    };
    MockBase.prototype.verifyAll = function () {
        try {
            this._interceptor.verify();
        }
        catch (e) {
            throw e;
        }
    };
    MockBase.prototype.reset = function () {
        this._interceptor.reset();
    };
    return MockBase;
}());

var InterceptionAction;
(function (InterceptionAction) {
    InterceptionAction[InterceptionAction["Continue"] = 0] = "Continue";
    InterceptionAction[InterceptionAction["Stop"] = 1] = "Stop";
})(InterceptionAction || (InterceptionAction = {}));
var InterceptorContext = (function () {
    function InterceptorContext(mock) {
        this.mock = mock;
        this._actualInvocations = [];
        this._expectedCalls = [];
    }
    Object.defineProperty(InterceptorContext.prototype, "behavior", {
        get: function () { return this.mock.behavior; },
        enumerable: true,
        configurable: true
    });
    InterceptorContext.prototype.addInvocation = function (invocation) { this._actualInvocations.push(invocation); };
    InterceptorContext.prototype.removeInvocation = function (invocation) {
        _.remove(this._actualInvocations, function (x) {
            return x === invocation;
        });
    };
    InterceptorContext.prototype.actualInvocations = function () { return this._actualInvocations; };
    InterceptorContext.prototype.clearInvocations = function () { this._actualInvocations.splice(0, this._actualInvocations.length); };
    InterceptorContext.prototype.addExpectedCall = function (call) { this._expectedCalls.push(call); };
    InterceptorContext.prototype.removeExpectedCall = function (call) {
        _.filter(this._expectedCalls, function (x) {
            return x.id !== call.id;
        });
    };
    InterceptorContext.prototype.expectedCalls = function () { return this._expectedCalls; };
    InterceptorContext.prototype.clearExpectedCalls = function () { this._expectedCalls.splice(0, this._expectedCalls.length); };
    InterceptorContext.prototype.reset = function () {
        this.clearInvocations();
        this.clearExpectedCalls();
    };
    return InterceptorContext;
}());

var CurrentInterceptContext = (function () {
    function CurrentInterceptContext() {
    }
    return CurrentInterceptContext;
}());

var AddActualInvocation = (function () {
    function AddActualInvocation() {
    }
    AddActualInvocation.prototype.handleIntercept = function (invocation, ctx, localCtx) {
        ctx.addInvocation(invocation);
        return InterceptionAction.Continue;
    };
    return AddActualInvocation;
}());
var ExtractProxyCall = (function () {
    function ExtractProxyCall() {
    }
    ExtractProxyCall.prototype.handleIntercept = function (invocation, ctx, localCtx) {
        var expectedCalls = ctx.expectedCalls().slice().reverse();
        var findCallPred = function (c) { return c.matches(invocation); };
        var matchingCalls = _.filter(expectedCalls, function (c) {
            return findCallPred(c);
        });
        localCtx.call = matchingCalls[0];
        if (localCtx.call != null) {
            if (invocation.isAnUnknownDynamicCallAtExecution) {
                invocation.callType = localCtx.call.setupCall.callType;
                if (invocation.callType == CallType.FUNCTION)
                    return InterceptionAction.Stop;
            }
            localCtx.call.evaluatedSuccessfully();
        }
        else if (ctx.behavior == exports.MockBehavior.Strict)
            throw new MockException(MockExceptionReason.NoSetup, invocation, "'" + invocation + "'");
        return InterceptionAction.Continue;
    };
    return ExtractProxyCall;
}());
var ExecuteCall = (function () {
    function ExecuteCall() {
    }
    ExecuteCall.prototype.handleIntercept = function (invocation, ctx, localCtx) {
        this._ctx = ctx;
        var currentCall = localCtx.call;
        if (currentCall != null) {
            currentCall.execute(invocation);
            return InterceptionAction.Stop;
        }
        return InterceptionAction.Continue;
    };
    return ExecuteCall;
}());
var InvokeBase = (function () {
    function InvokeBase() {
    }
    InvokeBase.prototype.handleIntercept = function (invocation, ctx, localCtx) {
        if (ctx.mock.callBase) {
            invocation.invokeBase();
            return InterceptionAction.Stop;
        }
        return InterceptionAction.Continue;
    };
    return InvokeBase;
}());
var HandleMockRecursion = (function () {
    function HandleMockRecursion() {
    }
    HandleMockRecursion.prototype.handleIntercept = function (invocation, ctx, localCtx) {
        return InterceptionAction.Continue;
    };
    return HandleMockRecursion;
}());

var InterceptorExecute = (function () {
    function InterceptorExecute(mock) {
        this._interceptorContext = new InterceptorContext(mock);
    }
    Object.defineProperty(InterceptorExecute.prototype, "interceptorContext", {
        get: function () { return this._interceptorContext; },
        enumerable: true,
        configurable: true
    });
    InterceptorExecute.prototype.intercept = function (invocation) {
        var _this = this;
        var localCtx = new CurrentInterceptContext();
        invocation.invocationType = InvocationType.EXECUTE;
        _.some(this.interceptionStrategies(), function (strategy) {
            if (InterceptionAction.Stop === strategy.handleIntercept(invocation, _this.interceptorContext, localCtx)) {
                return true;
            }
        });
    };
    InterceptorExecute.prototype.removeInvocation = function (invocation) {
        this._interceptorContext.removeInvocation(invocation);
    };
    InterceptorExecute.prototype.addExpectedCall = function (call) {
        this._interceptorContext.addExpectedCall(call);
    };
    InterceptorExecute.prototype.verify = function () {
        var expectedCalls = this._interceptorContext.expectedCalls();
        var verifiableCalls = [];
        if (this._interceptorContext.behavior == exports.MockBehavior.Strict) {
            for (var _i = 0, expectedCalls_1 = expectedCalls; _i < expectedCalls_1.length; _i++) {
                var call = expectedCalls_1[_i];
                if (!call.isVerifiable)
                    call.setVerifiable();
                verifiableCalls.push(call);
            }
        }
        else {
            verifiableCalls = _.filter(expectedCalls, function (c) { return c.isVerifiable; });
        }
        for (var _a = 0, verifiableCalls_1 = verifiableCalls; _a < verifiableCalls_1.length; _a++) {
            var v = verifiableCalls_1[_a];
            this.verifyCallCount(v, v.expectedCallCount);
        }
        var orderedCalls = _.filter(expectedCalls, function (c) { return c.isInSequence; });
        this.verifyCallsOrder(orderedCalls);
    };
    InterceptorExecute.prototype.verifyCallCount = function (call, times) {
        var expectedCalls = this._interceptorContext.expectedCalls();
        var actualCalls = this._interceptorContext.actualInvocations();
        var callCount = _.filter(actualCalls, function (c) { return call.matches(c); }).length;
        if (!times.verify(callCount))
            this.throwVerifyCallCountException(call.setupCall, times, expectedCalls, actualCalls);
    };
    InterceptorExecute.prototype.throwVerifyCallCountException = function (setupCall, times, expectedCalls, actualCalls) {
        var failMsg = times.failMessage(setupCall);
        var expectedCallsMsg = expectedCalls.reduce(function (a, x) { return a + " " + x + "\n"; }, "");
        var actualCallsMsg = actualCalls.reduce(function (a, x) { return a + " " + x + "\n"; }, "");
        var msg = failMsg + "\n Configured setups:\n" + expectedCallsMsg + "\n Performed invocations:\n" + actualCallsMsg;
        var e = new MockException(MockExceptionReason.CallCountVerificationFailed, setupCall, msg);
        throw e;
    };
    InterceptorExecute.prototype.verifyCallsOrder = function (expectedCalls) {
        var actualCalls = this._interceptorContext.actualInvocations();
        this.checkCallOrderExpectations(expectedCalls, actualCalls);
    };
    InterceptorExecute.prototype.checkCallOrderExpectations = function (expectedCalls, actualCalls) {
        var checkOrder = function (expectedCallCountList) {
            var expectedCallCount = _.sum(expectedCallCountList);
            var aci = 0;
            for (var eci = 0; eci < expectedCallCountList.length; eci++) {
                var expectedCall = expectedCalls[eci];
                var expectedCallCount_1 = expectedCallCountList[eci];
                for (var count = 1; count <= expectedCallCount_1; count++) {
                    var actualCall = actualCalls[aci++];
                    if (!expectedCall.matches(actualCall))
                        return false;
                }
            }
            return aci === expectedCallCount;
        };
        var eureka = false;
        var execute = function (acc, i) {
            if (!eureka) {
                if (i === expectedCalls.length)
                    eureka = checkOrder(acc);
                else
                    for (var j = expectedCalls[i].expectedCallCount.min; j <= expectedCalls[i].expectedCallCount.max; j++) {
                        acc[i] = j;
                        execute(acc, i + 1);
                    }
            }
        };
        execute([], 0);
        if (!eureka)
            this.throwVerifyCallOrderException();
    };
    InterceptorExecute.prototype.throwVerifyCallOrderException = function () {
        var e = new MockException(MockExceptionReason.CallOrderVerificationFailed, null);
        throw e;
    };
    InterceptorExecute.prototype.reset = function () {
        this._interceptorContext.reset();
    };
    InterceptorExecute.prototype.interceptionStrategies = function () {
        var strategies = [
            new AddActualInvocation(),
            new ExtractProxyCall(),
            new ExecuteCall(),
            new InvokeBase(),
            new HandleMockRecursion()
        ];
        return strategies;
    };
    return InterceptorExecute;
}());

var InterceptorSetup = (function () {
    function InterceptorSetup() {
    }
    Object.defineProperty(InterceptorSetup.prototype, "interceptedCall", {
        get: function () { return this._interceptedCall; },
        enumerable: true,
        configurable: true
    });
    InterceptorSetup.prototype.intercept = function (invocation) {
        invocation.invocationType = InvocationType.SETUP;
        if (invocation.proxyType == ProxyType.DYNAMIC &&
            invocation.callType == CallType.UNKNOWN)
            invocation.callType = CallType.PROPERTY;
        if (this._interceptedCall) {
            throw new MockException(MockExceptionReason.MoreThanOneSetup, invocation, "'" + invocation + "'; setup should contain only one expression");
        }
        this._interceptedCall = invocation;
    };
    InterceptorSetup.prototype.removeInvocation = function (invocation) {
        if (this._interceptedCall &&
            this._interceptedCall === invocation)
            this._interceptedCall = undefined;
    };
    return InterceptorSetup;
}());

var MethodCall = (function () {
    function MethodCall(mock, _setupExpression, interceptor, proxy) {
        this.mock = mock;
        this._setupExpression = _setupExpression;
        this._callCount = 0;
        this._id = this.generateId();
        _setupExpression(proxy);
        if (interceptor.interceptedCall) {
            var ic = interceptor.interceptedCall;
            var newArgs = this.transformToMatchers(ic.args);
            Object.defineProperty(newArgs, "callee", { configurable: true, enumerable: true, writable: false, value: ic.args.callee });
            ic.args = newArgs;
            this._setupCall = ic;
        }
        else {
            throw new MockException(MockExceptionReason.InvalidSetup, this._setupExpression, "'" + this._setupExpression + "'");
        }
    }
    MethodCall.ofStaticMock = function (mock, setupExpression) {
        var interceptor = new InterceptorSetup();
        var proxy = ProxyFactory.createProxy(mock.target, interceptor);
        var result = new MethodCall(mock, setupExpression, interceptor, proxy);
        return result;
    };
    MethodCall.ofDynamicMock = function (mock, setupExpression) {
        var interceptor = new InterceptorSetup();
        var proxy = ProxyFactory.createProxyES6(mock.target, interceptor);
        var result = new MethodCall(mock, setupExpression, interceptor, proxy);
        return result;
    };
    MethodCall.prototype.generateId = function () {
        return "MethodCall<" + _.uniqueId() + ">";
    };
    MethodCall.prototype.transformToMatchers = function (args) {
        var newArgs = [];
        _.each(args, function (a) {
            if (!_.isObject(a)) {
                var newArg = new MatchValue(a);
                newArgs.push(newArg);
            }
            else {
                if (Match.isMatcher(a)) {
                    newArgs.push(a);
                }
                else {
                    var newArg = new MatchPred(function (x) { return _.isEqual(x, a); });
                    newArgs.push(newArg);
                }
            }
        });
        return newArgs;
    };
    Object.defineProperty(MethodCall.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "setupExpression", {
        get: function () { return this._setupExpression; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "setupCall", {
        get: function () { return this._setupCall; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "isVerifiable", {
        get: function () { return this._isVerifiable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "isInSequence", {
        get: function () { return this._expectedCallType === exports.ExpectedCallType.InSequence; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "expectedCallCount", {
        get: function () { return this._expectedCallCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "isInvoked", {
        get: function () { return this._isInvoked; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodCall.prototype, "callCount", {
        get: function () { return this._callCount; },
        enumerable: true,
        configurable: true
    });
    MethodCall.prototype.setVerifiable = function (times, expectedCallType) {
        if (times === void 0) { times = Times.once(); }
        if (expectedCallType === void 0) { expectedCallType = exports.ExpectedCallType.InAnyOrder; }
        this._isVerifiable = true;
        this._expectedCallCount = times;
        this._expectedCallType = expectedCallType;
    };
    MethodCall.prototype.evaluatedSuccessfully = function () {
        this._evaluatedSuccessfully = true;
    };
    MethodCall.prototype.matches = function (call) {
        var match = false;
        if (this._setupCall.property && call && call.property &&
            this._setupCall.property.name === call.property.name) {
            if (this._setupCall.args.length >= call.args.length) {
                match = true;
                if (!call.isAnUnknownDynamicCallAtExecution) {
                    _.each(this._setupCall.args, function (x, index) {
                        var setupArg = x;
                        var callArg = call.args[index];
                        if (match && !setupArg.___matches(callArg))
                            match = false;
                    });
                }
            }
        }
        return match;
    };
    MethodCall.prototype.execute = function (call) {
        this._isInvoked = true;
        if (this._setupCallback != null) {
            this._setupCallback.apply(this, call.args);
        }
        if (this._thrownException != null) {
            throw this._thrownException;
        }
        this._callCount++;
    };
    MethodCall.prototype.verifiable = function (times, expectedCallType) {
        this.setVerifiable(times, expectedCallType);
    };
    MethodCall.prototype.toString = function () {
        var res = "" + this.setupCall;
        if (this.expectedCallCount)
            res = res + ", " + this.expectedCallCount;
        return res;
    };
    return MethodCall;
}());

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MethodCallReturn = (function (_super) {
    __extends$4(MethodCallReturn, _super);
    function MethodCallReturn(mock, setupExpression, interceptor, proxy) {
        var _this = _super.call(this, mock, setupExpression, interceptor, proxy) || this;
        _this._overrideTarget = mock.canOverrideTarget;
        return _this;
    }
    MethodCallReturn.ofStaticMock = function (mock, setupExpression) {
        var interceptor = new InterceptorSetup();
        var proxy = ProxyFactory.createProxy(mock.target, interceptor);
        var result = new MethodCallReturn(mock, setupExpression, interceptor, proxy);
        return result;
    };
    MethodCallReturn.ofDynamicMock = function (mock, setupExpression) {
        var interceptor = new InterceptorSetup();
        var proxy = ProxyFactory.createProxyES6(mock.target, interceptor);
        var result = new MethodCallReturn(mock, setupExpression, interceptor, proxy);
        return result;
    };
    MethodCallReturn.prototype.execute = function (call) {
        _super.prototype.execute.call(this, call);
        if (this._callBase)
            call.invokeBase();
        else if (this.hasReturnValue) {
            call.returnValue = this._returnValueFunc.apply(this, call.args);
            call.property.desc = { value: this.setupCall.property.desc && this.setupCall.property.desc.value };
        }
    };
    MethodCallReturn.prototype.callback = function (action) {
        this._setupCallback = action;
        return this;
    };
    MethodCallReturn.prototype.throws = function (exception) {
        this._thrownException = exception;
        return this;
    };
    MethodCallReturn.prototype.returns = function (valueFunc) {
        this._returnValueFunc = valueFunc;
        this.hasReturnValue = true;
        if (this._overrideTarget) {
            var obj = this.mock.target;
            var name_1 = this.setupCall.property.name;
            var desc = this.setupCall.property.desc;
            if (!desc &&
                this.setupCall.proxyType == ProxyType.DYNAMIC) {
                desc = {};
                desc.configurable = true;
                desc.enumerable = true;
                if (this.setupCall.callType == CallType.FUNCTION)
                    desc.value = this._returnValueFunc;
                else
                    desc.get = this._returnValueFunc;
                Object.defineProperty(obj, name_1, desc);
            }
            else if (desc) {
                desc.configurable = true;
                desc.enumerable = true;
                desc.value = this._returnValueFunc;
                Object.defineProperty(obj, name_1, desc);
            }
        }
        return this;
    };
    MethodCallReturn.prototype.callBase = function () {
        this._callBase = true;
        return this;
    };
    return MethodCallReturn;
}(MethodCall));

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var StaticMock = (function (_super) {
    __extends(StaticMock, _super);
    function StaticMock(target, canOverrideTarget, behavior) {
        var _this = _super.call(this, target, canOverrideTarget, behavior) || this;
        _this._interceptor = new InterceptorExecute(_this);
        _this._proxy = ProxyFactory.createProxy(target, _this._interceptor);
        return _this;
    }
    StaticMock.ofInstance = function (targetInstance, behavior, shouldOverrideTarget) {
        targetInstance = StaticMock.cloneDeep(targetInstance);
        var mock = new StaticMock(targetInstance, shouldOverrideTarget, behavior);
        return mock;
    };
    StaticMock.ofGlobalInstance = function (targetInstance, behavior) {
        var mock = new StaticMock(targetInstance, false, behavior);
        return mock;
    };
    StaticMock.ofType = function (targetConstructor, behavior, shouldOverrideTarget, targetConstructorArgs) {
        var targetInstance = Utils.conthunktor(targetConstructor, targetConstructorArgs);
        var mock = new StaticMock(targetInstance, shouldOverrideTarget, behavior);
        return mock;
    };
    StaticMock.cloneDeep = function (target) {
        var copy = target;
        if (!_.isFunction(target)) {
            var func = function (x) {
                if (ProxyES5.isProxy(x))
                    return x;
            };
            copy = _.cloneDeepWith(target, func);
        }
        return copy;
    };
    StaticMock.prototype.setup = function (expression) {
        var call = MethodCallReturn.ofStaticMock(this, expression);
        this._interceptor.addExpectedCall(call);
        return call;
    };
    StaticMock.prototype.verify = function (expression, times) {
        var call = MethodCall.ofStaticMock(this, expression);
        this._interceptor.addExpectedCall(call);
        try {
            this._interceptor.verifyCallCount(call, times);
        }
        catch (e) {
            throw e;
        }
    };
    return StaticMock;
}(MockBase));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DynamicMock = (function (_super) {
    __extends$5(DynamicMock, _super);
    function DynamicMock(target, name, canOverrideTarget, behavior) {
        var _this = _super.call(this, target, canOverrideTarget, behavior) || this;
        if (name)
            _this._name = name;
        _this._interceptor = new InterceptorExecute(_this);
        _this._proxy = ProxyFactory.createProxyES6(target, _this._interceptor);
        return _this;
    }
    DynamicMock.ofType = function (name, behavior, shouldOverrideTarget) {
        var mock = new DynamicMock((function () { }), name, shouldOverrideTarget, behavior);
        return mock;
    };
    DynamicMock.prototype.setup = function (expression) {
        var call = MethodCallReturn.ofDynamicMock(this, expression);
        this._interceptor.addExpectedCall(call);
        return call;
    };
    DynamicMock.prototype.verify = function (expression, times) {
        var call = MethodCall.ofDynamicMock(this, expression);
        this._interceptor.addExpectedCall(call);
        try {
            this._interceptor.verifyCallCount(call, times);
        }
        catch (e) {
            throw e;
        }
    };
    return DynamicMock;
}(MockBase));

var MockApi = (function () {
    function MockApi() {
    }
    MockApi.ofInstance = function (targetInstance, behavior, shouldOverrideTarget) {
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        if (shouldOverrideTarget === void 0) { shouldOverrideTarget = true; }
        var mock = StaticMock.ofInstance(targetInstance, behavior, shouldOverrideTarget);
        return mock;
    };
    MockApi.ofType = function (targetConstructor, behavior, shouldOverrideTarget) {
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        if (shouldOverrideTarget === void 0) { shouldOverrideTarget = true; }
        var targetConstructorArgs = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            targetConstructorArgs[_i - 3] = arguments[_i];
        }
        var mock;
        if (targetConstructor)
            mock = MockApi.ofType2(targetConstructor, targetConstructorArgs, behavior, shouldOverrideTarget);
        else
            mock = DynamicMock.ofType(undefined, behavior, shouldOverrideTarget);
        return mock;
    };
    MockApi.ofType2 = function (targetConstructor, targetConstructorArgs, behavior, shouldOverrideTarget) {
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        if (shouldOverrideTarget === void 0) { shouldOverrideTarget = true; }
        var mock = StaticMock.ofType(targetConstructor, behavior, shouldOverrideTarget, targetConstructorArgs);
        return mock;
    };
    return MockApi;
}());

var It = (function () {
    function It() {
    }
    It.isValue = function (x) {
        var matcher = new MatchValue(x);
        return matcher;
    };
    It.isObjectWith = function (x) {
        var matcher = new MatchObjectWith(x);
        return matcher;
    };
    It.isAnyObject = function (x) {
        var matcher = new MatchAnyObject(x);
        return matcher;
    };
    It.isAny = function () {
        var matcher = new MatchAny();
        return matcher;
    };
    It.isAnyString = function () {
        var matcher = new MatchAnyString();
        return matcher;
    };
    It.isAnyNumber = function () {
        var matcher = new MatchAnyNumber();
        return matcher;
    };
    It.is = function (predicate) {
        var matcher = new MatchPred(predicate);
        return matcher;
    };
    return It;
}());

var GlobalType;
(function (GlobalType) {
    GlobalType[GlobalType["Class"] = 0] = "Class";
    GlobalType[GlobalType["Function"] = 1] = "Function";
    GlobalType[GlobalType["Value"] = 2] = "Value";
})(GlobalType || (GlobalType = {}));
var GlobalMock = (function () {
    function GlobalMock(mock, _name, _type, container) {
        this.mock = mock;
        this._name = _name;
        this._type = _type;
        this.container = container;
        if (!this._name)
            this._name = mock.name;
    }
    Object.defineProperty(GlobalMock.prototype, "object", {
        get: function () { return this.mock.object; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalMock.prototype, "target", {
        get: function () { return this.mock.target; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalMock.prototype, "name", {
        get: function () { return this._name || this.mock.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalMock.prototype, "behavior", {
        get: function () { return this.mock.behavior; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalMock.prototype, "callBase", {
        get: function () { return this.mock.callBase; },
        set: function (value) { this.mock.callBase = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalMock.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    GlobalMock.prototype.setup = function (expression) {
        return this.mock.setup(expression);
    };
    GlobalMock.prototype.verify = function (expression, times) {
        this.mock.verify(expression, times);
    };
    GlobalMock.prototype.verifyAll = function () {
        this.mock.verifyAll();
    };
    GlobalMock.prototype.reset = function () {
        this.mock.reset();
    };
    return GlobalMock;
}());

var GlobalMockApi = (function () {
    function GlobalMockApi() {
    }
    GlobalMockApi.ofInstance = function (targetInstance, globalName, container, behavior) {
        if (container === void 0) { container = window; }
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        var mock = StaticMock.ofGlobalInstance(targetInstance, behavior);
        var type = _.isFunction(targetInstance) ? GlobalType.Function : GlobalType.Value;
        return new GlobalMock(mock, globalName, type, container);
    };
    GlobalMockApi.ofType = function (targetConstructor, container, behavior) {
        if (container === void 0) { container = window; }
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        var targetInstance = new targetConstructor();
        var mock = StaticMock.ofInstance(targetInstance, behavior, false);
        return new GlobalMock(mock, undefined, GlobalType.Class, container);
    };
    GlobalMockApi.ofType2 = function (globalName, container, behavior) {
        if (container === void 0) { container = window; }
        if (behavior === void 0) { behavior = exports.MockBehavior.Loose; }
        var mock = DynamicMock.ofType(globalName, behavior, false);
        return new GlobalMock(mock, undefined, GlobalType.Class, container);
    };
    return GlobalMockApi;
}());

var GlobalScope = (function () {
    function GlobalScope(_args) {
        this._args = _args;
    }
    GlobalScope.prototype.with = function (action) {
        var initial = {};
        try {
            _.each(this._args, function (a) {
                var containerProps = PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(a.container);
                var prop = _.find(containerProps, function (p) { return p.name === a.name; });
                if (prop) {
                    initial[a.name] = prop.desc;
                    var desc = {};
                    switch (a.type) {
                        case GlobalType.Class:
                            desc.value = function () { return a.mock.object; };
                            break;
                        case GlobalType.Function:
                            desc.value = a.mock.object;
                            break;
                        case GlobalType.Value:
                            desc.get = function () { return a.mock.object; };
                            break;
                        default:
                            throw new MockException(MockExceptionReason.UnknownGlobalType, a, "unknown global type: " + a.type);
                    }
                    try {
                        Object.defineProperty(a.container, a.name, desc);
                    }
                    catch (e) {
                        console.log("1: " + e);
                    }
                }
            });
            action.apply(this, this._args);
        }
        catch (e) {
            console.log("2: " + e);
        }
        finally {
            _.each(this._args, function (a) {
                var desc = initial[a.name];
                if (desc) {
                    switch (a.type) {
                        case GlobalType.Class:
                            break;
                        case GlobalType.Function:
                            break;
                        case GlobalType.Value:
                            desc.configurable = true;
                            break;
                        default:
                    }
                    try {
                        Object.defineProperty(a.container, a.name, desc);
                    }
                    catch (e) {
                        console.log("3: " + e);
                    }
                }
            });
        }
    };
    return GlobalScope;
}());

var GlobalScopeApi = (function () {
    function GlobalScopeApi() {
    }
    GlobalScopeApi.using = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var scope = new GlobalScope(args);
        return scope;
    };
    return GlobalScopeApi;
}());

exports.Mock = MockApi;
exports.It = It;
exports.Times = Times;
exports.GlobalMock = GlobalMockApi;
exports.GlobalScope = GlobalScopeApi;
exports.MockException = MockException;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=typemoq.js.map
