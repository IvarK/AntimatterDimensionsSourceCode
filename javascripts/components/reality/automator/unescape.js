const unEscape = (function() {
  'use strict';

  var regexCache = {};

  var charSets = {
    default: {
      '&quot;': '"',
      '&#34;': '"',

      '&apos;': '\'',
      '&#39;': '\'',

      '&amp;': '&',
      '&#38;': '&',

      '&gt;': '>',
      '&#62;': '>',

      '&lt;': '<',
      '&#60;': '<'
    },
    extras: {
      '&cent;': '¢',
      '&#162;': '¢',

      '&copy;': '©',
      '&#169;': '©',

      '&euro;': '€',
      '&#8364;': '€',

      '&pound;': '£',
      '&#163;': '£',

      '&reg;': '®',
      '&#174;': '®',

      '&yen;': '¥',
      '&#165;': '¥'
    }
  };

  /**
   * Convert HTML entities to HTML characters.
   *
   * @param  {String} `str` String with HTML entities to un-escape.
   * @return {String}
   */

  function unescape(str, type) {
    if (!isString(str)) return '';
    var chars = charSets[type || 'default'];
    var regex = toRegex(type, chars);
    return str.replace(regex, function(m) {
      return chars[m];
    });
  }

  function toRegex(type, chars) {
    if (regexCache[type]) {
      return regexCache[type];
    }
    var keys = Object.keys(chars).join('|');
    var regex = new RegExp('(?=(' + keys + '))\\1', 'g');
    regexCache[type] = regex;
    return regex;
  }

  /**
   * Returns true if str is a non-empty string
   */

  function isString(str) {
    return str && typeof str === 'string';
  }

  /**
   * Expose charSets
   */

  unescape.chars = charSets.default;
  unescape.extras = charSets.extras;

  return unescape;
}());