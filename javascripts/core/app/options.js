ui.actions.options = {};

ui.actions.options.changeTheme = function() {
    let themes = Themes.available();
    let current = themes.indexOf(Theme.current());
    let next = Math.wrap(current + 1, 0, themes.length - 1);
    let theme = themes[next];
    theme.set();
};

ui.actions.options.changeNotation = function() {
    let notations = [
        "Scientific",
        "Engineering",
        "Letters",
        "Standard",
        "Cancer",
        "Mixed scientific",
        "Mixed engineering",
        "Logarithm",
        "Brackets",
        "Infinity"
    ];
    let currentIndex = notations.indexOf(player.options.notation);
    let nextIndex = Math.wrap(currentIndex + 1, 0, notations.length - 1);
    Notation.set(notations[nextIndex]);
};

ui.actions.options.toggleNews = function() {
    if (!player.options.newsHidden) {
        document.getElementById("game").style.display = "none";
        player.options.newsHidden = true
    } else {
        document.getElementById("game").style.display = "block";
        player.options.newsHidden = false;
        scrollNextMessage()
    }
};

ui.actions.options.export = function() {
    let save = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));

    if (player.options.pastebinkey) {
        $.ajax({
            type: "POST",
            url: "http://pastebin.com/api/api_post.php",
            data: {
                api_option: "paste",
                api_dev_key: player.options.pastebinkey,
                api_paste_name: Date.now(),
                api_paste_code: encodeURIComponent(save)
            },
            success: function(response) {
                window.open(response)
            },
            fail: function(response) {
                console.log(response)
            }
        })
    }

    copyToClipboardAndNotify(save);
};

ui.actions.options.import = function() {
  let save_data = prompt("Input your save. (if you import a valid save, your current save file will be overwritten!)");
  if (save_data.constructor !== String) {
    return;
  }
  importSave(save_data);
};

function parseSaveData(save) {
  let parsedSave;
  try {
    parsedSave = JSON.parse(atob(save), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
  }
  catch (e) {
    parsedSave = undefined;
  }
  if (!parsedSave || !verify_save(parsedSave)) {
    return undefined;
  }
  return parsedSave;
}

let secretImports = [
  "80b7fdc794f5dfc944da6a445a3f21a2d0f7c974d044f2ea25713037e96af9e3",
  "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274"
];

function secretImportIndex(data) {
  const sha = sha512_256(data.replace(/\s/g, '').toUpperCase());
  return secretImports.indexOf(sha);
}

function isSecretImport(data) {
  return secretImportIndex(data) !== -1;
}

function tryImportSecret(data) {
  let index = secretImportIndex(data);
  if (index === 0) {
    document.getElementById("body").style.animation = "barrelRoll 5s 1";
    giveAchievement("Do a barrel roll!");
    setTimeout(() => document.getElementById("body").style.animation = "", 5000);
    return true;
  }
  if (index === 1) {
    giveAchievement("So do I");
    return true;
  }
  return false;
}

function importSave(save_data) {
    if (tryImportSecret(save_data) || Theme.tryUnlock(save_data)) {
      return;
    }
    let parsedSave = parseSaveData(save_data);
    if (parsedSave === undefined) {
      alert('could not load the save..');
      load_custom_game();
      return;
    }
    hardReset();
    saved = 0;
    totalMult = 1;
    currentMult = 1;
    infinitiedMult = 1;
    achievementMult = 1;
    challengeMult = 1;
    unspentBonus = 1;
    infDimPow = 1;
    postc8Mult = new Decimal(0);
    mult18 = new Decimal(1);
    ec10bonus = new Decimal(1);
    player = parsedSave;
    console.log(player);
    save_game(false, true);
    console.log(player);
    load_game();
    console.log(player);
    updateChallenges();
    transformSaveToDecimal();
}

function verify_save(obj) {
  return typeof obj === 'object';
}

ui.actions.options.save = function() {
    saved++;
    if (saved > 99) giveAchievement("Just in case");
    save_game();
};

ui.actions.options.cloudSave = function() {
    playFabSaveCheck();
};

ui.actions.options.cloudLoad = function() {
    playFabLoadCheck();
};

ui.actions.options.hardReset = function () {
    if (confirm("Do you really want to erase all your progress?")) {
        hardReset();
    }
};

function hardReset() {
  if (window.location.href.split("//")[1].length > 20) set_save('dimensionTestSave', currentSave, defaultStart);
  else set_save('dimensionSave', currentSave, defaultStart);
  player = defaultStart;
  infDimPow = 1;
  save_game();
  load_game();
  updateCosts();

  document.getElementById("secondRow").style.display = "none";
  document.getElementById("thirdRow").style.display = "none";
  document.getElementById("tickSpeed").style.visibility = "hidden";
  document.getElementById("tickSpeedMax").style.visibility = "hidden";
  document.getElementById("tickLabel").style.visibility = "hidden";
  document.getElementById("tickSpeedAmount").style.visibility = "hidden";
  document.getElementById("fourthRow").style.display = "none";
  document.getElementById("fifthRow").style.display = "none";
  document.getElementById("sixthRow").style.display = "none";
  document.getElementById("seventhRow").style.display = "none";
  document.getElementById("eightRow").style.display = "none";
  Tab.dimensions.normal.show();
  updateTickSpeed();
  updateDimensions();
  updateChallenges();
  updateAutobuyers();
}

ui.actions.options.refreshUpdateRate = function() {
    if (player.options.updateRate === 200) giveAchievement("You should download some more RAM");
    clearInterval(gameLoopIntervalId);
    gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
};