const domIterator = (function() {
  function xor(a, b) {
    return (a || b) && !(a && b);
  }

  var globals = /\b(this|Array|Date|Object|Math|JSON)\b/g;

  /**
   * Return immediate identifiers parsed from `str`.
   *
   * @param {String} str
   * @param {String|Function} map function or prefix
   * @return {Array}
   * @api public
   */

  function props(str, fn){
    var p = unique(propsImpl(str));
    if (fn && 'string' == typeof fn) fn = prefixed(fn);
    if (fn) return map(str, p, fn);
    return p;
  }

  /**
   * Return immediate identifiers in `str`.
   *
   * @param {String} str
   * @return {Array}
   * @api private
   */

  function propsImpl(str) {
    return str
        .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
        .replace(globals, '')
        .match(/[$a-zA-Z_]\w*/g)
      || [];
  }

  /**
   * Return `str` with `props` mapped with `fn`.
   *
   * @param {String} str
   * @param {Array} props
   * @param {Function} fn
   * @return {String}
   * @api private
   */

  function map(str, props, fn) {
    var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
    return str.replace(re, function(_){
      if ('(' == _[_.length - 1]) return fn(_);
      if (!~props.indexOf(_)) return _;
      return fn(_);
    });
  }

  /**
   * Return unique array.
   *
   * @param {Array} arr
   * @return {Array}
   * @api private
   */

  function unique(arr) {
    var ret = [];

    for (var i = 0; i < arr.length; i++) {
      if (~ret.indexOf(arr[i])) continue;
      ret.push(arr[i]);
    }

    return ret;
  }

  /**
   * Map with prefix `str`.
   */

  function prefixed(str) {
    return function(_){
      return str + _;
    };
  }

  /**
   * Initialize `Iterator`
   *
   * @param {Node} node
   * @param {Node} root
   * @return {Iterator} self
   * @api public
   */

  function Iterator(node, root) {
    if (!(this instanceof Iterator)) return new Iterator(node, root);
    this.node = this.start = this.peeked = node;
    this.root = root;
    this.closingTag = false;
    this._revisit = true;
    this._selects = [];
    this._rejects = [];

    if (node && this.higher(node)) {
      throw new Error('root must be a parent or ancestor to node');
    }
  }

  /**
   * Reset the Iterator
   *
   * @param {Node} node (optional)
   * @return {Iterator} self
   * @api public
   */

  Iterator.prototype.reset = function(node) {
    this.node = node || this.start;
    return this;
  };

  /**
   * Revisit element nodes. Defaults to `true`
   */

  Iterator.prototype.revisit = function(revisit) {
    this._revisit = undefined == revisit ? true : revisit;
    return this;
  };

  /**
   * Jump to the opening tag
   */

  Iterator.prototype.opening = function() {
    if (1 == this.node.nodeType) this.closingTag = false;
    return this;
  };

  /**
   * Jump to the closing tag
   */

  Iterator.prototype.atOpening = function() {
    return !this.closingTag;
  };


  /**
   * Jump to the closing tag
   */

  Iterator.prototype.closing = function() {
    if (1 == this.node.nodeType) this.closingTag = true;
    return this;
  };

  /**
   * Jump to the closing tag
   */

  Iterator.prototype.atClosing = function() {
    return this.closingTag;
  };

  /**
   * Next node
   *
   * @param {Number} type
   * @return {Node|null}
   * @api public
   */

  Iterator.prototype.next = traverse('nextSibling', 'firstChild');

  /**
   * Previous node
   *
   * @param {Number} type
   * @return {Node|null}
   * @api public
   */

  Iterator.prototype.previous =
    Iterator.prototype.prev = traverse('previousSibling', 'lastChild');

  /**
   * Make traverse function
   *
   * @param {String} dir
   * @param {String} child
   * @return {Function}
   * @api private
   */

  function traverse(dir, child) {
    var next = dir == 'nextSibling';
    return function walk(expr, n, peek) {
      expr = this.compile(expr);
      n = n && n > 0 ? n : 1;
      var node = this.node;
      var closing = this.closingTag;
      var revisit = this._revisit;

      while (node) {
        if (xor(next, closing) && node[child]) {
          // element with children: <em>...</em>
          node = node[child];
          closing = !next;
        } else if (1 == node.nodeType && !node[child] && xor(next, closing)) {
          // empty element tag: <em></em>
          closing = next;
          if (!revisit) continue;
        } else if (node[dir]) {
          // element has a neighbor: ...<em></em>...
          node = node[dir];
          closing = !next;
        } else {
          // done with current layer, move up.
          node = node.parentNode;
          closing = next;
          if (!revisit) continue;
        }

        if (!node || this.higher(node, this.root)) break;

        if (expr(node) && this.selects(node, peek) && this.rejects(node, peek)) {
          if (--n) continue;
          if (!peek) this.node = node;
          this.closingTag = closing;
          return node;
        }
      }

      return null;
    };
  }

  /**
   * Select nodes that cause `expr(node)`
   * to be truthy
   *
   * @param {Number|String|Function} expr
   * @return {Iterator} self
   * @api public
   */

  Iterator.prototype.select = function(expr) {
    expr = this.compile(expr);
    this._selects.push(expr);
    return this;
  };

  /**
   * Run through the selects ORing each
   *
   * @param {Node} node
   * @param {Boolean} peek
   * @return {Boolean}
   * @api private
   */

  Iterator.prototype.selects = function(node, peek) {
    var exprs = this._selects;
    var len = exprs.length;
    if (!len) return true;

    for (var i = 0; i < len; i++) {
      if (exprs[i].call(this, node, peek)) return true;
    };

    return false;
  };

  /**
   * Select nodes that cause `expr(node)`
   * to be falsy
   *
   * @param {Number|String|Function} expr
   * @return {Iterator} self
   * @api public
   */

  Iterator.prototype.reject = function(expr) {
    expr = this.compile(expr);
    this._rejects.push(expr);
    return this;
  };

  /**
   * Run through the reject expressions ANDing each
   *
   * @param {Node} node
   * @param {Boolean} peek
   * @return {Boolean}
   * @api private
   */

  Iterator.prototype.rejects = function(node, peek) {
    var exprs = this._rejects;
    var len = exprs.length;
    if (!len) return true;

    for (var i = 0; i < len; i++) {
      if (exprs[i].call(this, node, peek)) return false;
    };

    return true;
  };

  /**
   * Check if node is higher
   * than root.
   *
   * @param {Node} node
   * @param {Node} root
   * @return {Boolean}
   * @api private
   */

  Iterator.prototype.higher = function(node) {
    var root = this.root;
    if (!root) return false;
    node = node.parentNode;
    while (node && node != root) node = node.parentNode;
    return node != root;
  };

  /**
   * Compile an expression
   *
   * @param {String|Function|Number} expr
   * @return {Function}
   */

  Iterator.prototype.compile = function(expr) {
    switch (typeof expr) {
      case 'number':
        return function(node) { return expr == node.nodeType; };
      case 'string':
        return new Function('node', 'return ' + props(expr, 'node.'));
      case 'function':
        return expr;
      default:
        return function() { return true; };
    }
  };

  /**
   * Peek in either direction
   * `n` nodes. Peek backwards
   * using negative numbers.
   *
   * @param {Number} n (optional)
   * @return {Node|null}
   * @api public
   */

  Iterator.prototype.peak =
    Iterator.prototype.peek = function(expr, n) {
      if (arguments.length == 1) n = expr, expr = true;
      n = undefined == n ? 1 : n;
      if (!n) return this.node;
      else if (n > 0) return this.next(expr, n, true);
      else return this.prev(expr, Math.abs(n), true);
    };

  /**
   * Add a plugin
   *
   * @param {Function} fn
   * @return {Iterator}
   * @api public
   */

  Iterator.prototype.use = function(fn) {
    fn(this);
    return this;
  };

  return Iterator;
}());