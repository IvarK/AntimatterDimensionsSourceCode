import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

import { MultiplierTabHelper } from "./helper-functions";

// See index.js for documentation
GameDatabase.multiplierTabValues.AM = {
  total: {
    name: () => "Antimatter Production",
    multValue: () => {
      const totalMult = AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => ad.multiplier)
        .reduce((x, y) => x.times(y), DC.D1);
      const totalTickspeed = Tickspeed.perSecond.pow(MultiplierTabHelper.activeDimCount("AD"));
      return totalMult.times(totalTickspeed);
    },
    isActive: () => AntimatterDimension(1).isProducing,
    overlay: ["<i class='fas fa-atom' />"],
  }
};
