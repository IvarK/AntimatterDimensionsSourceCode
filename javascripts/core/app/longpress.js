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
    // Debug
    LongPress._pressCount = 0;
  }

  static addTo(obj, timeout, handlers) {
    if (!Object.prototype.hasOwnProperty.call(handlers, "longPress")) {
      throw "Need to specify a longPress handler";
    }
    const begin = e => LongPress._pressBegin(timeout, handlers.longPress, handlers.cancel, handlers.repeat, e);
    obj.addEventListener("mousedown", begin);
    obj.addEventListener("touchstart", begin);
    obj.addEventListener("mouseout", LongPress._cancelCurrentPress);
    obj.addEventListener("touchcancel", LongPress._cancelCurrentPress);
    obj.addEventListener("touchmove", e => {
      // Suggested in stackoverflow example
      e.preventDefault();
      const t = e.changedTouches[0];
      if (obj !== document.elementFromPoint(t.pageX, t.pageY)) {
        LongPress._cancelCurrentPress();
      }
    });
    if (handlers.click) {
      obj.addEventListener("click", e => LongPress._handleClick(e, handlers.click));
      obj.addEventListener("touchend", e => LongPress._handleTouchEnd(e, handlers.click));
    } else {
      obj.addEventListener("click", LongPress._cancelCurrentPress);
      obj.addEventListener("touchend", LongPress._cancelCurrentPress);
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

  // eslint-disable-next-line max-params
  static _pressBegin(timeout, handler, cancelHandler, repeat, e) {
    // If there's a timer already running, that means that something wasn't cancelled
    // properly (a press shouldn't begin if it hasn't ended). Clear out any existing presses:
    LongPress._cancelCurrentPress(e);
    // Ignore right click
    if (e.type === "click" && e.button !== 0) return;
    ++LongPress._pressCount;
    LongPress._currentCancelHandler = cancelHandler;
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
  }

  static _beginRepeat(timeout, handler, e) {
    LongPress._pressTimer = setTimeout(() => {
      handler(e);
      LongPress._beginRepeat(timeout, handler, e);
    }, timeout);
  }

  static _handleClick(e, handler) {
    const wasLP = LongPress._wasLongPress;
    // If the click was of a right button, just handle it
    if (e.button !== 0) return handler(e);
    // Cancel any existing presses
    LongPress._cancelCurrentPress(e);
    // If we just had a long press event, ignore the click
    return wasLP ? false : handler(e);
  }

  static _handleTouchEnd(e, handler) {
    // On touch devices, I don't think we get a normal click event; so we determine
    // a click based on a touch ending. To be on the safe side, we make sure the touch
    // began in the same place.
    const savedTarget = LongPress._currentTarget;
    const wasLP = LongPress._wasLongPress;
    // Cancel any existing presses
    LongPress._cancelCurrentPress(e);
    // If we just had a long press event, ignore the click; make sure targets match
    return !wasLP && savedTarget === e.target ? handler(e) : false;
  }
}

LongPress.initializeVars();

export function useLongPress(vue) {
  vue.directive("long-press", {
    bind(el, binding, vnode) {
      // This seems to be the only way to get events to our component
      const emit = (name, data) => {
        const handlers = (vnode.data && vnode.data.on);
        if (handlers && handlers[name]) {
          handlers[name].fns(data);
        }
      };
      LongPress.addTo(el, binding.value.delay, {
        longPress: () => emit("longpress"),
        cancel: () => emit("longpresscancel"),
        click: () => emit("longpressclick"),
      });
    }
  });
}

export function useRepeatingClick(vue) {
  vue.directive("repeating-click", {
    bind(el, binding, vnode) {
      // This seems to be the only way to get events to our component
      const emit = (name, data) => {
        const handlers = (vnode.data && vnode.data.on);
        if (handlers && handlers[name]) {
          handlers[name].fns(data);
        }
      };
      LongPress.addTo(el, binding.value.delay, {
        longPress: () => emit("repeatclick"),
        click: () => emit("firstclick"),
        repeat: 250
      });
    }
  });
}
