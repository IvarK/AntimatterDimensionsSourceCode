let subtabTimeoutId;

export const S12Windows = {
  isMinimised: false,
  tabs: {
    hoveringTab: undefined,
    setHoveringTab(tab) {
      this.hoveringTab = tab.id;
      clearTimeout(subtabTimeoutId);
    },
    unsetHoveringTab() {
      subtabTimeoutId = setTimeout(() => this.hoveringTab = undefined, 1000);
    },
    tabButtonPositions: [],
  }
};

// eslint-disable-next-line capitalized-comments, multiline-comment-style
/*
let windowId = 0;

export const S12Windows = {
  windows: [],
  add(tabId) {
    if (this.length > 50) return;
    this.windows.push({
      windowId,
      tabId,
      subtab: 0,
      fullscreen: true,
      minimised: false,
      x: Math.random() * 200,
      y: Math.random() * 200,
      w: 700,
      h: 500,
    });
    windowId++;
  },
  remove(winId) {
    const idx = this.windows.findIndex(x => x.windowId === winId);
    if (idx === -1) return;
    this.windows.splice(idx, 1);
  }
};
*/