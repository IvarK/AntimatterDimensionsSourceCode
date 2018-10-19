function getGalaxyCostScalingStart() {
  var n = 100 + ECTimesCompleted("eterc5")*5;
  if (player.timestudy.studies.includes(223)) n += 7;
  if (player.timestudy.studies.includes(224)) n += Math.floor(player.resets/2000);
  return n
}

function getGalaxyRequirement() {
  let amount = 80 + ((player.galaxies) * 60);
  if (player.timestudy.studies.includes(42)) amount = 80 + ((player.galaxies) * 52);
  if (player.currentChallenge === "challenge4") amount = 99 + ((player.galaxies) * 90);

  let galaxyType = GalaxyType.current();

  if (galaxyType === GalaxyType.distant) {
    amount = Math.floor(amount * Math.pow(1.002, (player.galaxies-(799 + getGlyphSacEffect("power")))));
  }
  if (galaxyType === GalaxyType.remote && player.currentEternityChall === "eterc5") {
    amount += Math.pow(player.galaxies, 2) + player.galaxies;
  }
  else if (galaxyType === GalaxyType.remote) {
    const galaxyCostScalingStart = getGalaxyCostScalingStart();
    amount += Math.pow((player.galaxies)-(galaxyCostScalingStart-1),2)+(player.galaxies)-(galaxyCostScalingStart-1);
  }

  if (player.infinityUpgrades.includes("resetBoost")) amount -= 9;
  if (player.challenges.includes("postc5")) amount -= 1;

  return amount;
}

const GalaxyType = {
  normal: "Antimatter Galaxies",
  distant: "Distant Antimatter Galaxies",
  remote: "Remote Antimatter Galaxies",
  current: function() {
    if (player.galaxies >= 800 + getGlyphSacEffect("power")) {
      return GalaxyType.distant;
    }
    if (player.currentEternityChall === "eterc5" || player.galaxies >= getGalaxyCostScalingStart()) {
      return GalaxyType.remote;
    }
    return GalaxyType.normal;
  }
};

function secondSoftResetBtnClick() {
  if (player.currentEternityChall === "eterc6") return;
  var bool = player.currentChallenge !== "challenge11" && player.currentChallenge !== "postc1" && player.currentChallenge !== "postc7" && (player.break || player.money.lte(Number.MAX_VALUE));
  if (player.currentChallenge === "challenge4" ? player.sixthAmount >= getGalaxyRequirement() && bool : player.eightAmount >= getGalaxyRequirement() && bool) {
      if (player.eternities >= 7 && !shiftDown) maxBuyGalaxies(true);
      else galaxyReset();
  }
};

document.getElementById("secondSoftReset").onclick = secondSoftResetBtnClick;

function galaxyReset() {
    if (autoS) auto = false;
    autoS = true;
    if (player.sacrificed === 0) giveAchievement("I don't believe in Gods");
    player.galaxies++;
    player.tickDecrease -= 0.03;
    player.resets = 0;
    softReset(0);
    if (Notation.current().isCancer()) player.spreadingCancer += 1;
    checkGalaxyAchievements();
}

function checkGalaxyAchievements() {
    if (player.spreadingCancer >= 10) giveAchievement("Spreading Cancer");
    if (player.spreadingCancer >= 100000) giveAchievement("Cancer = Spread");
    if (player.galaxies >= 50) giveAchievement("YOU CAN GET 50 GALAXIES!??");
    if (player.galaxies >= 2) giveAchievement("Double Galaxy");
    if (player.galaxies >= 1) giveAchievement("You got past The Big Wall");
    if (player.galaxies >= 630 && player.replicanti.galaxies === 0) giveAchievement("Unique snowflakes");
}