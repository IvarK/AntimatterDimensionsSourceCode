export function isNumber(value) {
  return typeof value === "number";
}

export function isString(value) {
  return typeof value === "string";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isDecimal(value) {
  return value instanceof Decimal;
}
