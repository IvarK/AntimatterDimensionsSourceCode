let subtabTimeoutId;

export const S12Windows = {
  isMinimised: false,
  tabs: {
    hoveringTab: undefined,
    setHoveringTab(tab) {
      this.hoveringTab = tab.id;
      clearTimeout(subtabTimeoutId);
    },
    unsetHoveringTab(instant = false) {
      if (instant) {
        this.hoveringTab = undefined;
        return;
      }
      subtabTimeoutId = setTimeout(() => this.hoveringTab = undefined, 1000);
    },
    tabButtonPositions: [],
  }
};
