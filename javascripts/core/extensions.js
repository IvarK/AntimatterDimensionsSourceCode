Array.prototype.distinct = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

Math.wrap = function(number, min, max) {
    let range = max - min + 1;
    number = ((number - min) % range);
    return number < 0 ? min + 1 + number : min + number;
};

Math.clamp = function(value, min, max) {
    return (value < min) ? min : (value > max ? max : value);
};

Decimal.sumReducer = function(accumulator, previous) {
  return Decimal.add(accumulator, previous);
};

Number.sumReducer = function(accumulator, previous) {
  return accumulator + previous;
};

Decimal.maxReducer = function(a, b) {
  return Decimal.max(a, b);
};

Decimal.prototype.copyFrom = function(decimal) {
  if (!(decimal instanceof Decimal)) {
    throw "Copy value is not Decimal";
  }
  this.mantissa = decimal.mantissa;
  this.exponent = decimal.exponent;
};

function copyToClipboard(str) {
    try {
        let el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        let result = document.execCommand('copy');
        document.body.removeChild(el);
        return result;
    } catch(ex) {
        console.log(ex);
        return false;
    }
}

function copyToClipboardAndNotify(str) {
    if (copyToClipboard(str)) {
        ui.notify.info("Exported to clipboard");
    }
}

function safeCall(fn) {
    if (fn) fn();
}

String.empty = "";

String.prototype.capitalize = function() {
  return this.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};