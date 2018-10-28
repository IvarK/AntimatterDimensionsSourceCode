const allAchievements = {
  r11 : "You gotta start somewhere",
  r12 : "100 antimatter is a lot",
  r13 : "Half life 3 confirmed",
  r14 : "L4D: Left 4 Dimensions",
  r15 : "5 Dimension Antimatter Punch",
  r16 : "We couldn't afford 9",
  r17 : "Not a luck related achievement",
  r18 : "90 degrees to infinity",
  r21 : "To infinity!",
  r22 : "Fake News",
  r23 : "The 9th Dimension is a lie",
  r24 : "Antimatter Apocalypse",
  r25 : "Boosting to the max",
  r26 : "You got past The Big Wall",
  r27 : "Double Galaxy",
  r28 : "There's no point in doing that",
  r31 : "I forgot to nerf that",
  r32 : "The Gods are pleased",
  r33 : "That's a lot of infinites",
  r34 : "You didn't need it anyway",
  r35 : "Don't you dare to sleep",
  r36 : "Claustrophobic",
  r37 : "That's fast!",
  r38 : "I don't believe in Gods",
  r41 : "Spreading Cancer",
  r42 : "Supersanic",
  r43 : "Zero Deaths",
  r44 : "Over in 30 seconds",
  r45 : "Faster than a potato",
  r46 : "Multidimensional",
  r47 : "Daredevil",
  r48 : "AntiChallenged",
  r51 : "Limit Break",
  r52 : "Age of Automation",
  r53 : "Definitely not worth it",
  r54 : "That's faster!",
  r55 : "Forever isn't that long",
  r56 : "Many Deaths",
  r57 : "Gift from the Gods",
  r58 : "Is this hell?",
  r61 : "Bulked up",
  r62 : "Oh hey, you're still here",
  r63 : "A new beginning.",
  r64 : "1 million is a lot",
  r65 : "Not-so-challenging",
  r66 : "Faster than a squared potato",
  r67 : "Infinitely Challenging",
  r68 : "You did this again just for the achievement right?",
  r71 : "ERROR 909: Dimension not found",
  r72 : "Can't hold all these infinities",
  r73 : "This achievement doesn't exist",
  r74 : "End me",
  r75 : "NEW DIMENSIONS???",
  r76 : "One for each dimension",
  r77 : "How the antitables have turned",
  r78 : "Blink of an eye",
  r81 : "Hevipelle did nothing wrong",
  r82 : "Anti-antichallenged",
  r83 : "YOU CAN GET 50 GALAXIES!??",
  r84 : "I got a few to spare",
  r85 : "All your IP are belong to us",
  r86 : "Do you even bend time bro?",
  r87 : "2 Million Infinities",
  r88 : "Yet another infinity reference",
  r91 : "Ludicrous Speed",
  r92 : "I brake for nobody",
  r93 : "MAXIMUM OVERDRIVE",
  r94 : "4.3333 minutes of Infinity",
  r95 : "Is this safe?",
  r96 : "Time is relative",
  r97 : "Yes. This is hell.",
  r98 : "0 degrees from infinity",
  r101 : "Costco sells dimboosts now",
  r102 : "This mile took an Eternity",
  r103 : "This achievement doesn't exist II",
  r104 : "That wasn't an eternity",
  r105 : "Infinite time",
  r106 : "The swarm",
  r107 : "Do you really need a guide for this?",
  r108 : "We could afford 9",
  r111 : "Yo dawg, I heard you liked infinities...",
  r112 : "Never again",
  r113 : "Long lasting relationship",
  r114 : "You're a mistake",
  r115 : "I wish I had gotten 7 eternities",
  r116 : "Do I really need to infinity",
  r117 : "8 nobody got time for that",
  r118 : "IT'S OVER 9000",
  r121 : "Can you get infinite IP?",
  r122 : "You're already dead.",
  r123 : "5 more eternities until the update",
  r124 : "Eternities are the new infinity",
  r125 : "Like feasting on a behind",
  r126 : "Popular music",
  r127 : "But I wanted another prestige layer...",
  r128 : "What do I have to do to get rid of you",
  r131 : "No ethical consumption",
  r132 : "Unique snowflakes",
  r133 : "I never liked this infinity stuff anyway",
  r134 : "When will it be enough?",
  r135 : "Faster than a potato^286078",
  r136 : "I told you already, time is relative",
  r137 : "Now you're thinking with dilation!",
  r138 : "This is what I have to do to get rid of you.",
  r141 : "Snap back to reality",
  r142 : "How does this work?",
  r143 : "Yo dawg, I heard you liked reskins...",
  r144 : "r144",
  r145 : "r145",
  r146 : "r146",
  r147 : "r147",
  r148 : "r148",
  s11 : "The first one's always free",
  s12 : "Just in case",
  s13 : "It pays to have respect",
  s14 : "So do I",
  s15 : "Do a barrel roll!",
  s16 : "Do you enjoy pain?",
  s17 : "30 Lives",
  s18 : "Do you feel lucky? Well do ya punk?",
  s21 : "Go study in real life instead",
  s22 : "Cancer = Spread",
  s23 : "Stop right there criminal scum!",
  s24 : "Real news",
  s25 : "Shhh... It's a secret",
  s26 : "You're a failure",
  s27 : "It's not called matter dimensions is it?",
  s28 : "Nice.",
  s31 : "You should download some more RAM",
  s32 : "Less than or equal to 0.001",
  s33 : "A sound financial decision",
  s34 : "You do know how these work, right?",
  s35 : "Should we tell them about buy max...",
  s36 : "While you were away... Nothing happened.",
  s37 : "You followed the instructions",
  s38 : "Professional bodybuilder",
  s41 : "That dimension doesn’t exist",
  s42 : "Was it even broken?",
  s43 : "Time fixes everything",
  s44 : "Are you statisfied now?",
  s45 : "This dragging is dragging on",
  s46 : "s46",
  s47 : "s47",
  s48 : "s48",
};
const allAchievementNums = Object.invert(allAchievements)
// to retrieve by value: Object.keys(allAchievements).find(key => allAchievements[key] === "L4D: Left 4 Dimensions");

function updateAchievementPower() {
  let completedRows = 0
  for (let i = 1; i <= TOTAL_ACH_ROWS; i++) {
    let achUnlocked = 0;
    for (let j = 1; j <= ACH_PER_ROW; j++ ) {
      const achId = `r${i}${j}`;
      if (isAchEnabled(achId)) {
        achUnlocked++;
      }
    }
    if (achUnlocked === ACH_PER_ROW) {
      completedRows++;
    }
  }
  player.achPow = Decimal.pow(1.5, completedRows);
}

function clearOldAchieves() {
  var toRemove = [];
  var achieveKey;
  var values = Object.keys(allAchievements).map(function(e) {
    return allAchievements[e]
  });
  for (var i = 0; i < player.achievements.length; i++) {
    if (values.indexOf(player.achievements[i]) !== -1) {  // does index[i] exist in allAchievements as a value?
      toRemove.push(i); // mark it for removal
      achieveKey = Object.keys(allAchievements).find(function(key) {
        return allAchievements[key] === player.achievements[i];
      });
      if (!player.achievements.includes(achieveKey)) { // check if new key already exists as well
        player.achievements.push(achieveKey); // if not... add it
      }
    } else if (allAchievements[player.achievements[i]] === undefined) {
      toRemove.push(i);
    }
  }


  toRemove.reverse();
  for (var i = 0; i < toRemove.length; i++) {
    player.achievements.splice(toRemove[i], 1);
  }
}

function giveAchievement(name) {

    if (player.achievements.includes(name)){ clearOldAchieves(); }

    if (player.achievements.includes(allAchievementNums[name])) return false

    $.notify(name, "success");
    player.achievements.push(allAchievementNums[name]);
    kong.submitStats('Achievements', player.achievements.length);
    if (name == "All your IP are belong to us" || name == "MAXIMUM OVERDRIVE") {
        if (player.autoCrunchMode == "amount" && player.autobuyers[11].priority != undefined) player.autobuyers[11].priority = player.autobuyers[11].priority.times(4);
    }
    updateAchievementPower();
    ui.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
}

function getSecretAchAmount() {
    var n = 0
    for (var i=1; i<4; i++) {
        var achNum = i * 10
        for (var l=0; l<8; l++) {
            achNum += 1;
            if (player.achievements.includes("s"+achNum)) {
                n++
            }
        }
    }
    return n
}

function isAchEnabled(name) {
  if (!player.achievements.includes(name)) return false;
  if (player.realities === 0) return true;
  const achId = parseInt(name.split("r")[1]);
  if (achId > 140) return true;
  const row = Math.floor(achId / 10);
  if (row <= Perks.achSkipCount) return true;
  const currentSeconds = player.thisReality / 1000;
  return timeRequiredForAchievement(achId) <= currentSeconds;
}

function timeForAllAchievements() {
  if (Perks.achSkipCount === TOTAL_PRE_REALITY_ACH_ROWS) {
    return 0;
  }
  return totalAchRowTime(TOTAL_PRE_REALITY_ACH_ROWS - Perks.achSkipCount);
}

function nextAchIn() {
  updateRealityAchievementModifiers();
  let currentSeconds = player.thisReality / 1000;
  if (currentSeconds > timeForAllAchievements()) return 0;
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;
  let timeReq = 0;

  let row = 1;
  function achTime() {
    return baseAchTime + ((row - 7) * rowModifier);
  }
  function rowTime() {
    return achTime() * ACH_PER_ROW;
  }

  while (currentSeconds > timeReq + rowTime()) {
    timeReq += rowTime();
    row++;
  }

  while (currentSeconds > timeReq) {
    timeReq += achTime();
  }
  return (timeReq - currentSeconds) * 1000
}

function timeUntilAch(name) {
  if (!player.achievements.includes(name)) {
    return NaN;
  }
  const achId = parseInt(name.split("r")[1]);
  if (achId > 140 || isNaN(achId)) {
    return NaN;
  }
  const row = Math.floor(achId / 10);
  if (row <= Perks.achSkipCount) {
    return NaN;
  }
  const currentSeconds = player.thisReality / 1000;
  return timeRequiredForAchievement(achId) - currentSeconds;
}

function timeRequiredForAchievement(achId) {
  updateRealityAchievementModifiers();
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;

  const row = Math.floor(achId / 10);
  const perkAdjustedRow = Math.clamp(row - Perks.achSkipCount, 1, row);
  const previousRowCount = perkAdjustedRow - 1;
  const previousRowsTime = totalAchRowTime(previousRowCount);
  const currentRowAchTime = baseAchTime + (perkAdjustedRow - 7) * rowModifier;
  const column = achId % 10;
  const currentRowTime = currentRowAchTime * column;
  return previousRowsTime + currentRowTime;
}

// Total time required for a row count if we go from the first perk-adjusted row
function totalAchRowTime(rowCount) {
  updateRealityAchievementModifiers();
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;
  const achCount = rowCount * ACH_PER_ROW;
  // Unoptimized version
  // const achTime = row => baseAchTime + (row - 7) * rowModifier;
  // totalTime = 0;
  // for (let i = 1; i < row; i++) {
  //   totalTime += achTime(i) * 8
  // }
  return achCount * (baseAchTime + (rowCount - 13) * rowModifier / 2);
}

let realityAchievementModifiers = {
  realities: -1,
  baseAchTime: -1,
  rowModifier: -1,
  secondsForAllAchs: -1
};

const SECONDS_IN_DAY = TimeSpan.fromDays(1).totalSeconds;
const DAYS_FOR_ALL_ACHS = 2;
const DEFAULT_SECONDS_FOR_ALL_ACHS = SECONDS_IN_DAY * DAYS_FOR_ALL_ACHS;
const ACH_PER_ROW = 8;
const TOTAL_ACH_ROWS = 14;
const TOTAL_PRE_REALITY_ACH_ROWS = 13;
const TOTAL_PRE_REALITY_ACHS = TOTAL_PRE_REALITY_ACH_ROWS * ACH_PER_ROW;

// TODO: further optimization:
// pre-generate ach times on reality
function updateRealityAchievementModifiers() {
  if (realityAchievementModifiers.realities === player.realities) {
    return;
  }
  const requiredTimeModifier = Math.pow(0.9, Math.max(player.realities - 1, 0));
  const secondsForAllAchs = DEFAULT_SECONDS_FOR_ALL_ACHS * requiredTimeModifier;
  realityAchievementModifiers = {
    realities: player.realities,
    // how much it takes for row 7 achievement to get
    baseAchTime: secondsForAllAchs / TOTAL_PRE_REALITY_ACHS,
    rowModifier: 100 * DAYS_FOR_ALL_ACHS * requiredTimeModifier,
    secondsForAllAchs: secondsForAllAchs
  };
}