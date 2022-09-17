/* eslint-disable camelcase */
import { GameDatabase } from "../game-database";

// Used for individual dimension breakdowns of effects (eg. full achievement mult into its values on individual ADs)
// Results in an array of ["key_1", "key_2", ... , "key_8"]
function append8(key) {
  const props = [];
  for (let dim = 1; dim <= 8; dim++) props.push(`${key}_${dim}`);
  return props;
}

// Used as shorthand for all the effects which boost ADs
function getADProps(tier) {
  const props = ["buy10AD", "dimboostAD", "achievementAD", "infinityUpgradeAD", "breakInfinityUpgradeAD",
    "infinityChallengeAD", "timeStudyAD", "eternityChallengeAD"];
  if (!tier) return props;
  const newProps = [];
  for (const effect of props) newProps.push(`${effect}_${tier}`);
  if (tier === 8) newProps.splice(3, 0, "sacrifice");
  return newProps;
}

// These are all associated with values in GameDatabase.multiplierTabValues
GameDatabase.multiplierTabTree = {
  totalAD: [
    append8("totalAD"),
    getADProps()
  ],
  buy10AD: [
    append8("buy10AD")
  ],
  dimboostAD: [
    append8("dimboostAD")
  ],
  achievementAD: [
    append8("achievementAD")
  ],
  infinityUpgradeAD: [
    append8("infinityUpgradeAD")
  ],
  breakInfinityUpgradeAD: [
    append8("breakInfinityUpgradeAD")
  ],
  infinityChallengeAD: [
    append8("infinityChallengeAD")
  ],
  timeStudyAD: [
    append8("timeStudyAD")
  ],
  eternityChallengeAD: [
    append8("eternityChallengeAD")
  ],
  totalAD_1: [
    getADProps(1)
  ],
  totalAD_2: [
    getADProps(2)
  ],
  totalAD_3: [
    getADProps(3)
  ],
  totalAD_4: [
    getADProps(4)
  ],
  totalAD_5: [
    getADProps(5)
  ],
  totalAD_6: [
    getADProps(6)
  ],
  totalAD_7: [
    getADProps(7)
  ],
  totalAD_8: [
    getADProps(8)
  ],
};