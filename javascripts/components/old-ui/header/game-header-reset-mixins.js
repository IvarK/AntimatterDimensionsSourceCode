"use strict";

const textColorMixin = {
  methods: {
    amountStyle(currentValue, gainedValue) {
      if (currentValue.lt(1e50)) return undefined;
      const ratio = gainedValue.log10() / currentValue.log10();
      const rgb = [
        Math.round(255 - (ratio - 1) * 10 * 255),
        Math.round(255 - (1 - ratio) * 10 * 255),
        ratio > 1 ? Math.round(255 - (ratio - 1) * 10 * 255)
        : Math.round(255 - (1 - ratio) * 10 * 255)
      ];
      return { color: `rgb(${rgb.join(",")})` };
    }
  }
};