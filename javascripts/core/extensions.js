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
        $.notify("Exported to clipboard", "info");
    }
}