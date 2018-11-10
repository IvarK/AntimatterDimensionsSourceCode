function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
  if (value instanceof Decimal) {
    return new Decimal(value);
  }
  return (options.clone !== false && options.isMergeableObject(value)) ?
    deepmerge(emptyTarget(value), value, options) :
    value;
}

function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(function(element) {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}

function mergeObject(target, source, options) {
  const destination = {};
  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach(function(key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  Object.keys(source).forEach(function(key) {
    if (target[key] && target[key] instanceof Decimal) {
      destination[key] = new Decimal(source[key]);
    } else if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}

function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;

  if (target instanceof Decimal) {
    return new Decimal(source);
  }

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}

deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  if (!options) {
    const deepCloneMerge = (destinationArray, sourceArray, options) => {
      return sourceArray.map(function(element, index) {
        if (destinationArray[index] && destinationArray[index] instanceof Decimal) {
          return new Decimal(element);
        } else if (!options.isMergeableObject(element) || !destinationArray[index]) {
          return cloneUnlessOtherwiseSpecified(element, options);
        } else {
          return deepmerge(destinationArray[index], element, options);
        }
      });
    };
    options = {
      arrayMerge: deepCloneMerge
    };
  }

  return array.reduce(function(prev, next) {
    return deepmerge(prev, next, options);
  }, {});
};

function isMergeableObject(value) {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value) {
  return !!value && typeof value === 'object';
}

function isSpecial(value) {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}