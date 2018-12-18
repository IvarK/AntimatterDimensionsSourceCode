'use strict';
class LongPressC {
  constructor() {
    // Click events still fire after long holds; they are gated out by the state of this
    // variable
    this._wasLongPress = false;
    this._pressTimer = null;
    this._currentCancelHandler = null;
    this._currentTarget = null;
    this._pressCount = 0; // debug
    if (LongPressC._instance) { throw 'LongPress already created'; }
    LongPressC._instance = this;
  }

  static getInstance() {
    return LongPressC._instance;
  };

  addTo(obj, timeout, handlers) {
    var _this = this;
    if (!handlers.hasOwnProperty("longPress")) {
      throw 'Need to specify a longPress handler'
    }
    if (!handlers.hasOwnProperty("cancel")) {
      handlers.cancel = null;
    }
    if (!handlers.hasOwnProperty("click")) {
      handlers.click = null;
    }
    var cancel = this._cancelCurrentPress.bind(this)
    var begin = function (e) {
      return _this._pressBegin(timeout, handlers.longPress, handlers.cancel, e)
    }
    $(obj).on("mousedown touchstart", begin)
    $(obj).on("mouseout touchcancel", cancel)
    $(obj).on("touchmove", function(e) {
      e.preventDefault();  // suggested in stackoverflow example
      var t = e.changedTouches[0];
      if (obj !== document.elementFromPoint(t.pageX,t.pageY)) {
        cancel();
      }
    });
    if (handlers.click !== null) {
      obj.onclick = function (e) {
        return _this._handleClick(e, handlers.click)
      };
      $(obj).on("touchend", function(e) { return _this._handleTouchEnd(e, handlers.click); })
    } else {
      $(obj).on("touchend", cancel)
    }
  }

  _cancelCurrentPress(e) {
    if (this._currentCancelHandler !== null) {
      this._currentCancelHandler(e);
      this._currentCancelHandler = null;
    }
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }
    this._wasLongPress = false;
    this._currentTarget = null;
  }
  _pressBegin(timeout, handler, cancel_handler, e) {
    // If there's a timer already running, that means that something wasn't cancelled
    // properly (a press shouldn't begin if it hasn't ended). Clear out any existing presses:
    var _this = this;
    this._cancelCurrentPress(e);
    // Ignore right click
    if (e.type == "click" && e.button != 0) { return; }
    var savedPressCount = this._pressCount;
    ++this._pressCount;
    this._currentCancelHandler = cancel_handler;
    this._wasLongPress = false;
    this._currentTarget = e.target;
    e.target.focus();
    this._pressTimer = setTimeout(function () {
      _this._wasLongPress = true;
      handler(e);
      _this._pressTimer = null;
      _this._currentCancelHandler = null;
    }, timeout);
    return false;
  }
  _handleClick(e, handler) {
    var wasLP = this._wasLongPress;
    // If the click was of a right button, just handle it
    if (e.button != 0) { return handler(e); }
    // Cancel any existing presses
    this._cancelCurrentPress(e)
    // If we just had a long press event, ignore the click
    if (wasLP) {
      return false;
    }
    return handler(e);
  }
  _handleTouchEnd(e, handler) {
    // On touch devices, I don't think we get a normal click event; so we determine
    // a click based on a touch ending. To be on the safe side, we make sure the touch
    // began in the same place.
    var savedTarget = this._currentTarget;
    var wasLP = this._wasLongPress;
    // Cancel any existing presses
    this._cancelCurrentPress(e)
    // If we just had a long press event, ignore the click
    if (wasLP) {
      return false;
    }
    return savedTarget === e.target ? handler(e) : false;
  }
}

const LongPress = new LongPressC();
