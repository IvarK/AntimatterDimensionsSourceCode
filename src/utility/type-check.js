export function isNumber(value) {
  return typeof value === "number";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isDecimal(value) {
  return value instanceof Decimal;
}
