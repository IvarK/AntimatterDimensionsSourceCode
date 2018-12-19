'use strict';
class LongPress {
  static initializeVars() {
    LongPress._wasLongPress = false;    
    LongPress._pressTimer = null;
    LongPress._currentCancelHandler = null;
    LongPress._currentTarget = null;
    LongPress._pressCount = 0; // debug
  }

  static addTo(obj, timeout, handlers) {
    if (!handlers.hasOwnProperty("longPress")) {
      throw 'Need to specify a longPress handler'
    }
    var begin = (e) => {
      return LongPress._pressBegin(timeout, handlers.longPress, handlers.cancel, e)
    }
    $(obj).on("mousedown touchstart", begin)
    $(obj).on("mouseout touchcancel", LongPress._cancelCurrentPress)
    $(obj).on("touchmove", (e) => {
      e.preventDefault();  // suggested in stackoverflow example
      var t = e.changedTouches[0];
      if (obj !== document.elementFromPoint(t.pageX,t.pageY)) {
        LongPress._cancelCurrentPress();
      }
    });
    if (handlers.click) {
      $(obj).on("click touchend", (e) => {
        return LongPress._handleClick(e, handlers.click)
      });
    } else {
      $(obj).on("touchend", LongPress._cancelCurrentPress)
    }
  }

  static _cancelCurrentPress(e) {
    if (LongPress._currentCancelHandler) {
      LongPress._currentCancelHandler(e);
      LongPress._currentCancelHandler = null;
    }
    if (LongPress._pressTimer !== null) {
      clearTimeout(LongPress._pressTimer);
      LongPress._pressTimer = null;
    }
    LongPress._wasLongPress = false;
    LongPress._currentTarget = null;
  }

  static _pressBegin(timeout, handler, cancel_handler, e) {
    // If there's a timer already running, that means that something wasn't cancelled
    // properly (a press shouldn't begin if it hasn't ended). Clear out any existing presses:
    LongPress._cancelCurrentPress(e);
    // Ignore right click
    if (e.type == "click" && e.button != 0) return;
    var savedPressCount = LongPress._pressCount;
    ++LongPress._pressCount;
    LongPress._currentCancelHandler = cancel_handler;
    LongPress._wasLongPress = false;
    LongPress._currentTarget = e.target;
    e.target.focus();
    LongPress._pressTimer = setTimeout(() => {
      LongPress._wasLongPress = true;
      handler(e);
      LongPress._pressTimer = null;
      LongPress._currentCancelHandler = null;
    }, timeout);
    return false;
  }

  static _handleClick(e, handler) {
    var wasLP = LongPress._wasLongPress;
    // If the click was of a right button, just handle it
    if (e.button != 0) return handler(e);
    // Cancel any existing presses
    LongPress._cancelCurrentPress(e)
    // If we just had a long press event, ignore the click
    return !wasLP ? handler(e) : false;
  }

  static _handleTouchEnd(e, handler) {
    // On touch devices, I don't think we get a normal click event; so we determine
    // a click based on a touch ending. To be on the safe side, we make sure the touch
    // began in the same place.
    var savedTarget = LongPress._currentTarget;
    var wasLP = LongPress._wasLongPress;
    // Cancel any existing presses
    LongPress._cancelCurrentPress(e)
    // If we just had a long press event, ignore the click; make sure targets match
    return !wasLP && savedTarget === e.target ? handler(e) : false;
  }
}

LongPress.initializeVars();
