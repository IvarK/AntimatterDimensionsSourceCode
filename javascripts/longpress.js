"use strict";

// There's a vue directive, long-press, defined at the bottom, which may be
// what you want to use.
//
// Because it's related, we also define another directive, repeating-click, which
// sends repeated events if the mouse is held down. (It sends firstclick and repeatclick)

// LongPress produces 3 possible events:
// 1) a long press (longPress property in handlers)
// 2) a long press cancellation (early release, cancel property)
// 3) a click (a short click, click property)
// handlers can also have a "repeat" property, which is a number in ms. If defined,
// the long press event will be fired repeatedly if the press continues, at that frequency
//
// Don't add your own click handlers to the object; get your clicks through
// LongPress
//
// The long-press directive (v-long-press="{ delay:1000 }")
// attaches LongPress for you, and emits the following events you can listen for:
// longpress
// longpresscancel
// longpressclick

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
      throw "Need to specify a longPress handler"
    }
    var begin = (e) => {
      return LongPress._pressBegin(timeout, handlers.longPress, handlers.cancel, handlers.repeat, e)
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
      $(obj).on("click", (e) => LongPress._handleClick(e, handlers.click));
      $(obj).on("touchend", (e) => LongPress._handleTouchEnd(e, handlers.click));
    } else {
      $(obj).on("click touchend", LongPress._cancelCurrentPress)
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

  static _pressBegin(timeout, handler, cancel_handler, repeat, e) {
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
      if (repeat) {
        LongPress._beginRepeat(repeat, handler, e);
      } else {
        LongPress._pressTimer = null;
        LongPress._currentCancelHandler = null;
      }
    }, timeout);
    return false;
  }

  static _beginRepeat(timeout, handler, e) {
    LongPress._pressTimer = setTimeout(() => {
      handler(e);
      LongPress._beginRepeat(timeout, handler, e);
    }, timeout);
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

Vue.directive("long-press", {
  bind: function (el, binding, vnode) {
    // This seems to be the only way to get events to our component
    var emit = (name, data) => {
      var handlers = (vnode.data && vnode.data.on);
      if (handlers && handlers[name]) {
        handlers[name].fns(data)
      }
    }
    LongPress.addTo(el, binding.value.delay, {
      longPress: () => emit("longpress"),
      cancel: () => emit("longpresscancel"),
      click: () => emit("longpressclick"),
    });
  }
});

Vue.directive("repeating-click", {
  bind: function (el, binding, vnode) {
    // This seems to be the only way to get events to our component
    var emit = (name, data) => {
      var handlers = (vnode.data && vnode.data.on);
      if (handlers && handlers[name]) {
        handlers[name].fns(data)
      }
    }
    LongPress.addTo(el, binding.value.delay, {
      longPress: () => emit("repeatclick"),
      click: () => emit("firstclick"),
      repeat: 250
    });
  }
});
