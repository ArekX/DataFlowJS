export default {
      isObject: isObject,
      isString: isString,
      isUndefined: isUndefined
};

function isObject(val) {
    return typeof val === "object";
}

function isString(val) {
    return typeof val === "string";
}

function isUndefined(val) {
    return typeof val === "undefined";
}
