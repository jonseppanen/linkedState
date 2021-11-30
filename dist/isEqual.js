"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isEqual;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//Fast, generic, early exiting deep object comparitor with no dependencies.
var getSimpleComparitor = function getSimpleComparitor(comparitor) {
  return ["string", "number", "boolean"].includes(_typeof(comparitor));
};

function isEqual(compareFrom, compareTo) {
  if (typeof compareTo === "undefined" && typeof compareFrom !== "undefined") return false;
  if (typeof compareFrom === "undefined" && typeof compareTo !== "undefined") return false;
  if (_typeof(compareFrom) !== _typeof(compareTo)) return false;
  if (typeof compareFrom === "undefined" && typeof compareTo === "undefined") return true;

  if (getSimpleComparitor(compareFrom)) {
    return JSON.stringify(compareFrom) === JSON.stringify(compareTo);
  }

  if (Array.isArray(compareFrom)) {
    if (compareFrom.length !== compareTo.length) return false;
    var arrayReturn = true;

    for (var i = 0; i < compareFrom.length; i++) {
      if (!isEqual(compareFrom[i], compareTo[i])) {
        arrayReturn = false;
        break;
      }
    }

    return arrayReturn;
  }

  if (_typeof(compareFrom) === "object") {
    if (Object.keys(compareFrom).length !== Object.keys(compareTo).length) return false;
    var objectReturn = true;

    for (var _i = 0, _Object$keys = Object.keys(compareFrom); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];

      if (!(key in compareTo)) {
        objectReturn = false;
        break;
      }

      if (!isEqual(compareTo[key], compareFrom[key])) {
        objectReturn = false;
        break;
      }
    }

    return objectReturn;
  }
}