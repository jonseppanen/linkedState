"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkedState = exports.linkedState = void 0;

var _react = require("react");

var _isEqual = _interopRequireDefault(require("./isEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (window) var global = window; //Set the global/window object to store state. "But muh glowballs!" you say? Look at that uuid. Aint nothing gonna collide with that.

var lsUUID = "___LINKEDSTATE___ef40968a-d9ba-4eef-a1b2-e020c5845fd1";
if (!global[lsUUID]) global[lsUUID] = {};

var awaitSetter = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key, value) {
    var awaitedResource, resource;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return value;

          case 2:
            awaitedResource = _context.sent;
            _context.next = 5;
            return awaitedResource;

          case 5:
            resource = _context.sent;

            _LS_set(key, resource);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function awaitSetter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var updateAllWatchers = function updateAllWatchers(key, value) {
  //Update all components watching the state
  console.log(global[lsUUID][key].localStateSetters);

  var _iterator = _createForOfIteratorHelper(global[lsUUID][key].localStateSetters),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var localStateSetter = _step.value;
      console.log(value);
      localStateSetter(value);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

var _LS_set = function _LS_set(key, value) {
  //Set a linked state value by its key, and then update all watching components with this value
  if (value && typeof value.then === "function") {
    awaitSetter(key, value);
    return;
  } //Initialize the linked state entry if it doesnt yet exist


  if (!global[lsUUID][key]) global[lsUUID][key] = {
    currentValue: value,
    localStateSetters: []
  }; //Deep check the new value for equlity before setting it to avoid unnecessary dom thrashing

  if ((0, _isEqual["default"])(global[lsUUID][key].currentValue, value)) return;
  global[lsUUID][key].currentValue = value; //Update all watching commponents with the new value.

  updateAllWatchers(key, value);
};

var _LS_watch = function _LS_watch(key, localStateSetter) {
  var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  if (key === undefined) return;

  if (!global[lsUUID][key]) {
    //Initialize and exit if this is the only watching component.
    global[lsUUID][key] = {
      currentValue: initialValue,
      localStateSetters: [localStateSetter]
    };
    console.log(global[lsUUID][key]);
    return;
  } //Add the local state setter if it doesnt exist yet in the registry.


  if (!global[lsUUID][key].localStateSetters.find(function (otherStateSetter) {
    return otherStateSetter === localStateSetter;
  })) {
    //Apply current linkedstate value to the new watcher.
    localStateSetter(function (lastLocalValue) {
      return (0, _isEqual["default"])(lastLocalValue, global[lsUUID][key].currentValue) ? lastLocalValue : global[lsUUID][key].currentValue;
    }); //...then local setter to registry

    global[lsUUID][key].localStateSetters.push(localStateSetter);
  }
};

var _LS_unwatch = function _LS_unwatch(key, localStateSetter) {
  //Component cleanup when dismounted
  if (key === undefined) return;
  if (!global[lsUUID][key].localStateSetters) return;

  if (global[lsUUID][key].localStateSetters.find(function (otherStateSetter) {
    return otherStateSetter === localStateSetter;
  })) {
    global[lsUUID][key].localStateSetters = global[lsUUID][key].localStateSetters.filter(function (otherStateSetter) {
      return otherStateSetter !== localStateSetter;
    });
  }
};

var _LS_get = function _LS_get(key) {
  //Universal get command of current linked state by key, does not require react to perform.
  console.log(global[lsUUID][key]);
  if (key === undefined || !global[lsUUID][key]) return undefined;
  return global[lsUUID][key].currentValue;
}; //Getter and Setter for the global state


var linkedState = {
  get: _LS_get,
  set: _LS_set
}; //Hook for managing the local state

exports.linkedState = linkedState;

var useLinkedState = function useLinkedState(linkedStateKey, initialValue) {
  var _global$lsUUID$linked;

  var _useState = (0, _react.useState)(((_global$lsUUID$linked = global[lsUUID][linkedStateKey]) === null || _global$lsUUID$linked === void 0 ? void 0 : _global$lsUUID$linked.currentValue) || initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      localState = _useState2[0],
      setLocalState = _useState2[1];

  var globalStateUpdater = function globalStateUpdater(newState) {
    if (typeof newState === "function") {
      var lastState = linkedState.get(linkedStateKey);
      newState = newState(lastState);
    }

    linkedState.set(linkedStateKey, newState);
  };

  (0, _react.useEffect)(function () {
    _LS_watch(linkedStateKey, setLocalState, initialValue);

    return function () {
      return _LS_unwatch(linkedStateKey, setLocalState);
    };
  }, []);
  return [localState, globalStateUpdater];
};

exports.useLinkedState = useLinkedState;