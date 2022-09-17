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
  // Sacrifice is only directly referenced by name in AD 8; all other effects based on sacrifice either directly
  // change sacrifice value or apply within their own category (eg. time studies)
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

// Everything is multiplierTabTree is associated with values in GameDatabase.multiplierTabValues. The only explicitly
// initialized props here are the "root" props which are viewable on the tab with full breakdowns. After the initial
// specification, all children props are dynamically added based on the arrays in the helper functions above
GameDatabase.multiplierTabTree = {
  totalAD: [
    append8("totalAD"),
    getADProps()
  ],
  totalID: [
    append8("totalID"),
    getIDProps()
  ],
};

for (const prop of getADProps()) GameDatabase.multiplierTabTree[prop] = [append8(prop)];
for (const prop of getIDProps()) GameDatabase.multiplierTabTree[prop] = [append8(prop)];

for (let dim = 1; dim <= 8; dim++) {
  GameDatabase.multiplierTabTree[`totalAD_${dim}`] = [getADProps(dim)];
  GameDatabase.multiplierTabTree[`totalID_${dim}`] = [getIDProps(dim)];
}
