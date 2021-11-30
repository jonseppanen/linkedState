"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkedState = exports.linkedState = void 0;

var _react = require("react");

var _isEqual = _interopRequireDefault(require("./isEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (window) var global = window; //Set the global/window object to store state. "But muh glowballs!" you say? Look at that uuid. Aint nothing gonna collide with that.

var lsUUID = "___LINKEDSTATE___ef40968a-d9ba-4eef-a1b2-e020c5845fd1";
if (!global[lsUUID]) global[lsUUID] = {};

var awaitSetter = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (key, value) {
    //If setting a thenable, wait for it to finish before firing.
    var awaitedResource = yield value;
    var resource = yield awaitedResource;

    _LS_set(key, resource);
  });

  return function awaitSetter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var updateAllWatchers = (key, value) => {
  //Update all components watching the state
  for (var localStateSetter of global[lsUUID][key].localStateSetters) {
    localStateSetter(value);
  }
};

var _LS_set = (key, value) => {
  //Set a linked state value by its key, and then update all watching components with this value
  if (value && typeof value.then === "function") {
    awaitSetter(key, value);
    return;
  } //Initialize the linked state entry if it doesnt yet exist


  if (!global[lsUUID][key]) global[lsUUID][key] = {
    currentValue: value,
    localStateSetters: []
  }; //Deep check the new value for equlity before setting it to avoid unnecessary dom thrashing

  if ((0, _isEqual.default)(global[lsUUID][key].currentValue, value)) return;
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
    return;
  } //Add the local state setter if it doesnt exist yet in the registry.


  if (!global[lsUUID][key].localStateSetters.find(otherStateSetter => otherStateSetter === localStateSetter)) {
    //Apply current linkedstate value to the new watcher.
    localStateSetter(lastLocalValue => (0, _isEqual.default)(lastLocalValue, global[lsUUID][key].currentValue) ? lastLocalValue : global[lsUUID][key].currentValue); //...then local setter to registry

    global[lsUUID][key].localStateSetters.push(localStateSetter);
  }
};

var _LS_unwatch = (key, localStateSetter) => {
  //Component cleanup when dismounted
  if (key === undefined) return;
  if (!global[lsUUID][key].localStateSetters) return;

  if (global[lsUUID][key].localStateSetters.find(otherStateSetter => otherStateSetter === localStateSetter)) {
    global[lsUUID][key].localStateSetters = global[lsUUID][key].localStateSetters.filter(otherStateSetter => otherStateSetter !== localStateSetter);
  }
};

var _LS_get = key => {
  //Universal get command of current linked state by key, does not require react to perform.
  if (key === undefined || !global[lsUUID][key]) return undefined;
  return global[lsUUID][key].currentValue;
}; //Getter and Setter for the global state


var linkedState = {
  get: _LS_get,
  set: _LS_set
}; //Hook for managing the local state

exports.linkedState = linkedState;

var useLinkedState = (linkedStateKey, initialValue) => {
  var _global$lsUUID$linked;

  var [localState, setLocalState] = (0, _react.useState)(((_global$lsUUID$linked = global[lsUUID][linkedStateKey]) === null || _global$lsUUID$linked === void 0 ? void 0 : _global$lsUUID$linked.currentValue) || initialValue);

  var globalStateUpdater = newState => {
    if (typeof newState === "function") {
      var lastState = linkedState.get(linkedStateKey);
      newState = newState(lastState);
    }

    linkedState.set(linkedStateKey, newState);
  };

  (0, _react.useEffect)(() => {
    _LS_watch(linkedStateKey, setLocalState, initialValue);

    return () => _LS_unwatch(linkedStateKey, setLocalState);
  }, []);
  return [localState, globalStateUpdater];
};

exports.useLinkedState = useLinkedState;