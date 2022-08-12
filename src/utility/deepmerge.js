// Deepmerge library modified for Antimatter Dimensions usage (mainly Decimal integration)
// Source: https://github.com/TehShrike/deepmerge

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
  if (value instanceof Decimal) {
    return new Decimal(value);
  }
  if (value instanceof Set) {
    return new Set(value);
  }
  return (options.clone !== false && options.isMergeableObject(value))
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(element => cloneUnlessOtherwiseSpecified(element, options));
}

function mergeObject(target, source, options) {
  const destination = {};
  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach(key => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  Object.keys(source).forEach(key => {
    if (target[key] && target[key] instanceof Decimal) {
      destination[key] = new Decimal(source[key]);
    } else if (target[key] && target[key] instanceof Set) {
      destination[key] = new Set(source[key]);
    } else if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}

export function deepmerge(target, source, options = {}) {
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;

  if (target instanceof Decimal) {
    return new Decimal(source);
  }

  if (target instanceof Set) {
    return new Set(source);
  }

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  }

  if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  }

  return mergeObject(target, source, options);
}

export function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }

  if (!options) {
    // eslint-disable-next-line no-shadow
    const deepCloneMerge = (destinationArray, sourceArray, options) => sourceArray.map((element, index) => {
      if (destinationArray[index] && destinationArray[index] instanceof Decimal) {
        return new Decimal(element);
      }

      if (destinationArray[index] && destinationArray[index] instanceof Set) {
        return new Set(element);
      }

      if (!options.isMergeableObject(element) || !destinationArray[index]) {
        return cloneUnlessOtherwiseSpecified(element, options);
      }
      return deepmerge(destinationArray[index], element, options);

    });
    // eslint-disable-next-line no-param-reassign
    options = {
      arrayMerge: deepCloneMerge
    };
  }

  return array.reduce((prev, next) => deepmerge(prev, next, options), {});
}

function isMergeableObject(value) {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value) {
  return Boolean(value) && typeof value === "object";
}

function isSpecial(value) {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === "[object RegExp]" || stringValue === "[object Date]";
}
