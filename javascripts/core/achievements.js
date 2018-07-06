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
  r94 : "Minute of infinity",
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
  s36 : "Dip the antimatter",
  s37 : "You followed the instructions",
  s38 : "Professional bodybuilder",
  s41 : "That dimension doesn’t exist",
  s42 : "s42",
  s43 : "s43",
  s44 : "s44",
  s45 : "s45",
  s46 : "s46",
  s47 : "s47",
  s48 : "s48",
};
const secretAchievementTooltips = {
    s11 : "Click on this achievement.",
    s12 : "Save 100 times without refreshing.",
    s13 : "Pay respects.",
    s14 : "Say something naughty.",
    s15 : "Do a barrel roll.",
    s16 : "Use standard, cancer, or bracket notation for 10 minutes with more than 1 eternity without refreshing.",
    s17 : "Input the konami code.",
    s18 : "You have a 1/100,000 chance of getting this achievement every second.",
    s21 : "Purchase the secret time study.",
    s22 : "Buy one million Galaxies in total while using cancer notation.",
    s23 : "Open the console.",
    s24 : "Click on the news ticker that tells you to click on it.",
    s25 : "Discover a secret theme.",
    s26 : "Fail eternity challenges 10 times without refreshing. What are you doing with your life...",
    s27 : "Get Infinite matter.",
    s28 : "Don't act like you don't know what you did.",
    s31 : "Set your update rate to 200ms.",
    s32 : "Get a fastest infinity or eternity time of less than or equal to 0.001 seconds.",
    s33 : "Click on the donate link.",
    s34 : "Respec with an empty study tree.",
    s35 : "Buy single tickspeed 1,000,000 times.",
    s36 : "Dip the antimatter.",
    s37 : "Follow instructions.",
    s38 : "Get all your dimension bulk buyers to 1e100.",
    s41 : "Try to purchase the 9th dimension.",
    s42 : "s42",
    s43 : "s43",
    s44 : "s44",
    s45 : "s45",
    s46 : "s46",
    s47 : "s47",
    s48 : "s48",
  };
const allAchievementNums = Object.invert(allAchievements)
// to retrieve by value: Object.keys(allAchievements).find(key => allAchievements[key] === "L4D: Left 4 Dimensions");

function clearOldAchieves(){
    var toRemove = [];
    var achieveKey;
    var values = Object.keys(allAchievements).map(function(e) { return allAchievements[e] });
    for (var i = 0; i < player.achievements.length; i++) {
      if (values.indexOf(player.achievements[i]) !== -1 ) {  // does index[i] exist in allAchievements as a value?
        toRemove.push(i); // mark it for removal
        achieveKey = Object.keys(allAchievements).find(function(key){ return allAchievements[key] === player.achievements[i];});
        if (!player.achievements.includes(achieveKey)) { // check if new key already exists as well
            player.achievements.push(achieveKey); // if not... add it
        }
      } else if (allAchievements[player.achievements[i]] === undefined){
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
    document.getElementById(name).className = "achievementunlocked"
    try {
        kongregate.stats.submit('Achievements', player.achievements.length);
    } catch (err) {console.log("Couldn't load Kongregate API")}
    if (name == "All your IP are belong to us" || name == "MAXIMUM OVERDRIVE") {
        player.infMult = player.infMult.times(4);
        player.autoIP = player.autoIP.times(4);
        if (player.autoCrunchMode == "amount" && player.autobuyers[11].priority != undefined) player.autobuyers[11].priority = player.autobuyers[11].priority.times(4);
    }
    updateAchievements();
}

function updateAchievements() {
  var amount = 0
  for (var i=1; i<document.getElementById("achievementtable").children[0].children.length+1; i++) {
      var n = 0
      var achNum = i * 10
      for (var l=0; l<8; l++) {
          achNum += 1;
          var name = allAchievements["r"+achNum]
          if (isAchEnabled("r"+achNum)) {
                n++
                document.getElementById(name).className = "achievementunlocked"
          } else if (player.achievements.includes("r"+achNum)) {
                document.getElementById(name).className = "achievementdisabled"
          } else {
                document.getElementById(name).className = "achievementlocked"
          }
      }
      if (n == 8) {
          amount++
          document.getElementById("achRow"+i).className = "completedrow"
      } else {
          document.getElementById("achRow"+i).className = ""
      }
  }
  for (var i=1; i<document.getElementById("secretachievementtable").children[0].children.length+1; i++) {
      var n = 0
      var achNum = i * 10
      for (var l=0; l<8; l++) {
          achNum += 1;
          var name = allAchievements["s"+achNum]
          if (player.achievements.includes("s"+achNum)) {
              n++
              document.getElementById(name).setAttribute('ach-tooltip', secretAchievementTooltips["s"+achNum])
              document.getElementById(name).className = "achievementunlocked"
          } else {
              document.getElementById(name).className = "achievementhidden"
              document.getElementById(name).setAttribute('ach-tooltip', (name[name.length-1] !== "?" && name[name.length-1] !== "!" && name[name.length-1] !== ".") ? name+"." : name)
          }
      }
      if (n == 8) {
          document.getElementById("secretAchRow"+i).className = "completedrow"
      } else {
          document.getElementById("secretAchRow"+i).className = ""
      }
  }

  player.achPow = Decimal.pow(1.5, amount)

  document.getElementById("achmultlabel").textContent = "Current achievement multiplier on each Dimension: " + player.achPow.toFixed(1) + "x"

}

function getSecretAchAmount() {
    var n = 0
    for (var i=1; i<document.getElementById("secretachievementtable").children[0].children.length+1; i++) {
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

const DAYS_FOR_ALL_ACHS = 4
function isAchEnabled(name) {
    if (!player.achievements.includes(name)) return false
    if (player.realities == 0 && player.achievements.includes(name)) return true
    var time = player.thisReality / 10
    var achnum = parseInt(name.split("r")[1])
    var row = Math.floor(achnum / 10)
    var col = achnum % 10
    var basePerAch = 60 * 24 * DAYS_FOR_ALL_ACHS * 60 / 104 * Math.pow(0.9, Math.max(player.realities-1, 0))
    var diffBetweenRows = DAYS_FOR_ALL_ACHS * 90 * Math.pow(0.9, Math.max(player.realities-1, 0))
    var diffFromMiddle = (row - 7) * diffBetweenRows
    var timeReq = 0
    for ( var i = 1; i < row; i++) {
        timeReq += (basePerAch + ((i - 7) * diffBetweenRows)) * 8
    }

    for ( var i = 1; i < col; i++) {
        timeReq += basePerAch + diffFromMiddle
    }

    timeReq += basePerAch + diffFromMiddle

    if (timeReq > time) return false
    else return true
}

function nextAchIn() {
    
    var time = player.thisReality / 10
    if ( time > 60 * 24 * DAYS_FOR_ALL_ACHS * 60 * Math.pow(0.9, Math.max(player.realities-1, 0)) ) return 0
    var basePerAch = 60 * 24 * DAYS_FOR_ALL_ACHS * 60 / 104 * Math.pow(0.9, Math.max(player.realities-1, 0))
    var diffBetweenRows = DAYS_FOR_ALL_ACHS * 90 * Math.pow(0.9, Math.max(player.realities-1, 0))
    var timeReq = 0
    var row = 1
    while (time > timeReq) {
        timeReq += (basePerAch + ((row - 7) * diffBetweenRows)) * 8
        row++
    }
    row--
    timeReq -= (basePerAch + ((row - 7) * diffBetweenRows)) * 8

    var col = 1
    while (time > timeReq) {
        timeReq += (basePerAch + ((row - 7) * diffBetweenRows))
        col++
    }

    return ( timeReq - time) * 10
}