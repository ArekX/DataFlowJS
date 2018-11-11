export default {
      isObject: isObject,
      isString: isString,
      isUndefined: isUndefined,
      isFunction: isFunction
};

function isObject(val) {
    return typeof val === "object";
}

function isFunction(val) {
    return typeof val === "function";
}

function isString(val) {
    return typeof val === "string";
}

function isUndefined(val) {
    return typeof val === "undefined";
}
