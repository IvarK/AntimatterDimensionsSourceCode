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
    "infinityChallengeAD", "infinityPowerAD", "timeStudyAD", "eternityChallengeAD", "glyphAD", "alchemyAD", "otherAD"];
  if (!tier) return props;
  const newProps = [];
  for (const effect of props) newProps.push(`${effect}_${tier}`);
  if (tier === 8) newProps.splice(3, 0, "sacrifice");
  return newProps;
}

// Used as shorthand for all the effects which boost IDs
function getIDProps(tier) {
  const props = ["buy10ID", "replicantiID", "achievementID", "timeStudyID", "infinityChallengeID",
    "eternityChallengeID", "glyphID", "alchemyID", "otherID"];
  if (!tier) return props;
  const newProps = [];
  for (const effect of props) newProps.push(`${effect}_${tier}`);
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
  infinityPowerAD: [
    append8("infinityPowerAD")
  ],
  timeStudyAD: [
    append8("timeStudyAD")
  ],
  eternityChallengeAD: [
    append8("eternityChallengeAD")
  ],
  glyphAD: [
    append8("glyphAD")
  ],
  alchemyAD: [
    append8("alchemyAD")
  ],
  otherAD: [
    append8("otherAD")
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

  totalID: [
    append8("totalID"),
    getIDProps()
  ],
  buy10ID: [
    append8("buy10ID")
  ],
  replicantiID: [
    append8("replicantiID")
  ],
  achievementID: [
    append8("achievementID")
  ],
  timeStudyID: [
    append8("timeStudyID")
  ],
  infinityChallengeID: [
    append8("infinityChallengeID")
  ],
  eternityChallengeID: [
    append8("eternityChallengeID")
  ],
  glyphID: [
    append8("glyphID")
  ],
  alchemyID: [
    append8("alchemyID")
  ],
  otherID: [
    append8("otherID")
  ],
  totalID_1: [
    getIDProps(1)
  ],
  totalID_2: [
    getIDProps(2)
  ],
  totalID_3: [
    getIDProps(3)
  ],
  totalID_4: [
    getIDProps(4)
  ],
  totalID_5: [
    getIDProps(5)
  ],
  totalID_6: [
    getIDProps(6)
  ],
  totalID_7: [
    getIDProps(7)
  ],
  totalID_8: [
    getIDProps(8)
  ],
};