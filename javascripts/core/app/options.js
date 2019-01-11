class GameOptions {
  static changeTheme() {
    const themes = Themes.available();
    const current = Theme.current();
    const next = shiftDown ? themes.previousSibling(current) : themes.nextSibling(current);
    next.set();
  }

  static changeNotation() {
    const notations = [
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
    const current = player.options.notation;
    const next = shiftDown ? notations.previousSibling(current) : notations.nextSibling(current);
    Notation.set(next);
  }

  static toggleNews() {
    if (!player.options.newsHidden) {
      document.getElementById("game").style.display = "none";
      player.options.newsHidden = true;
    } else {
      document.getElementById("game").style.display = "block";
      player.options.newsHidden = false;
      scrollNextMessage();
    }
  }

  static export() {
    const save = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));

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
          window.open(response);
        },
        fail: function(response) {
          console.log(response);
        }
      });
    }

    copyToClipboardAndNotify(save);
  }

  static save() {
    saved++;
    if (saved > 99) giveAchievement("Just in case");
    player.reality.automatorOn = automatorOn;
    player.reality.automatorCurrentRow = automatorIdx;
    save_game();
  }

  static cloudSave() {
    playFabSaveCheck();
  }

  static cloudLoad() {
    playFabLoadCheck();
  }

  static refreshUpdateRate() {
    if (player.options.updateRate === 200) {
      giveAchievement("You should download some more RAM");
    }
    clearInterval(gameLoopIntervalId);
    gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
    Enslaved.infinityTracking = []
    Enslaved.totalInfinities = 0
  }
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
    postc8Mult = new Decimal(0);
    mult18 = new Decimal(1);
    ec10bonus = new Decimal(1);
    player = parsedSave;
    console.log(player);
    save_game(false, true);
    console.log(player);
    load_game();
    console.log(player);
    transformSaveToDecimal();
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
    document.body.style.animation = "barrelRoll 5s 1";
    giveAchievement("Do a barrel roll!");
    setTimeout(() => document.body.style.animation = "", 5000);
    return true;
  }
  if (index === 1) {
    giveAchievement("So do I");
    return true;
  }
  return false;
}

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

function verify_save(obj) {
  return typeof obj === 'object';
}

function hardReset() {
  if (isDevEnvironment()) set_save('dimensionTestSave', currentSave, defaultStart);
  else set_save('dimensionSave', currentSave, defaultStart);
  player = defaultStart;
  save_game();
  load_game();
  Tab.dimensions.normal.show();
}
