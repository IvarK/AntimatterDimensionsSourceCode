function playFabLogin() {
  try {
    var authTicket = kongregate.services.getGameAuthToken();
    var requestData = {
        TitleId: titleId,
        KongregateId: kongregate.services.getUserId(),
        AuthTicket: authTicket,
        CreateAccount: true
    }
    try {
      PlayFab.ClientApi.LoginWithKongregate(requestData, playFabLoginCallback);
    } catch (e) {
      console.log("Unable to send login request to PlayFab.");
    }

    /*
    // Dev playfab login
    titleId = "144";
    var requestData = {
        TitleId: titleId,
        CustomId: "GettingStartedGuide",
        CreateAccount: true
    }
    try {
      PlayFab.ClientApi.LoginWithCustomID(requestData, playFabLoginCallback);
    } catch (e) {
      console.log("Unable to send login request to PlayFab.");
    }
    */
  } catch (e) {
    console.log(e)
  }
}

var titleId = "5695";
var playFabId = -1

function playFabLoginCallback(data, error) {
  if (error) {
    console.log(error.errorMessage);
    GameUI.notify.error("Couldn't log in to PlayFab Cloud. You need to be logged in to Kongregate.");
    document.getElementById("cloudOptions").style.display = "none"
    document.getElementById("cloud").style.display = "none"
    return;
  }
  if (data) {
    //NOTE: SAVE 'playFabId' to a global variable somewhere, I just declare mine at the start of the playfab stuff. Use this variable to tell if your player is logged in to playfab or not.
    playFabId = data.data.PlayFabId;
    GameUI.notify.info("Logged in to PlayFab Cloud");

    if (player.options.cloud) playFabLoadCheck()
    console.log("Logged in to playFab")
  }
}

function saveToPlayFab(root) {
  if (!playFabId || typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined') return false;

  // Cut compressed root object into strings of 10,000 bytes for PlayFab
  var chunks = LZString.compressToEncodedURIComponent(JSON.stringify(root)).match(/.{1,10000}/g);
  if (chunks.length > 10) {
    GameUI.notify.error("Error saving to cloud: size limit exceeded");
  }

  var requestData = {
    TitleId: titleId,
    PlayFabId: playFabId,
    // convert array into object with numbers as keys
    Data: $.extend({}, chunks)
  }
  try {
    PlayFab.ClientApi.UpdateUserData(requestData, saveToPlayFabCallback);
  } catch (e) {
    console.log(e);
  }
}

function saveToPlayFabCallback(data, error) {
  if (error) {
    console.log(error);
    return false;

  }
  if (data) {
    console.log("Game Saved!");
    GameUI.notify.info("Game saved to cloud");
    save_game()
    return true;
  }
}

function loadFromPlayFab(callback) {
  if (!playFabId || typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined') {
    console.log(playFabId, PlayFab);
    return false;
  }
  var requestData = {
    Keys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "save"],
    PlayFabId: playFabId
  }
  try {
    console.log('attempting to send load request');
    PlayFab.ClientApi.GetUserData(requestData, loadFromPlayFabCallback.bind(this, callback));
    console.log('sent load request');
  } catch (e) {
    console.log(e);
  }
}

function loadFromPlayFabCallback(callback, data, error) {
  console.log('loading callback fired');
  console.log(data, error);
  if (error) {
    console.log(error);
    return;
  }

  if (data) {
    // Start: Migration
    if (data.data.Data.save) {
      var oldSave = JSON.parse(LZString.decompressFromEncodedURIComponent(data.data.Data.save.Value));
      var requestData = {
        TitleId: titleId,
        PlayFabId: playFabId,
        // convert array into object with numbers as keys
        Data: {
          save: null,
          infinitied: null,
          eternities: null
        }
      }
      try {
        PlayFab.ClientApi.UpdateUserData(requestData, function(_, error) {
          if (error) alert("Error migrating cloud saves, please report this.");

          var newRoot = {
            current: 0,
            saves: {
              0: oldSave,
              1: null,
              2: null
            }
          };

          saveToPlayFab(newRoot);
          callback(newRoot);
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      var root = getRootFromChunks(data.data.Data);
      callback(root || {saves: []});
    }
    // End: Migration

  }
}

function getRootFromChunks(chunks) {
  // merge chunks back together
  return JSON.parse(LZString.decompressFromEncodedURIComponent(
    Object.values(chunks)
    .map(function(val) {
      return val.Value;
    })
    .join("")
  ));
}

// if both of them are the same, undefined will be returned
function newestSave(first, second) {
    function getSaveInfo(save) {
        return {
            infinities: save ? save.infinitied : 0,
            eternities: save ? save.eternities : 0
        }
    }
    let firstInfo = getSaveInfo(first);
    let secondInfo = getSaveInfo(second);
    if (firstInfo.eternities === secondInfo.eternities && firstInfo.infinities === secondInfo.infinities) {
        return undefined;
    }
    if (firstInfo.eternities > secondInfo.eternities) {
        return first;
    }
    if (firstInfo.infinities > secondInfo.infinities) {
        return first;
    }
    return second;
}

function playFabLoadCheck() {
  loadFromPlayFab(function(cloudRoot) {
    GameUI.notify.info("Loaded from cloud");

    for (var i = 0; i < 3; i++) {
      let saveId = i;
      let cloudSave = cloudRoot.saves[saveId];
      let localSave = saves[saveId];
      let newestSave = newestSave(cloudSave, localSave);
      function overwriteLocalSave() {
          load_cloud_save(saveId, cloudSave);
      }
      if (newestSave === localSave) {
          Modal.addCloudConflict(saveId, cloudSave, localSave, overwriteLocalSave);
          Modal.cloudLoadConflict.show();
      } else {
          overwriteLocalSave();
      }
    }
  });
}

function playFabSaveCheck() {
  loadFromPlayFab(function(cloudRoot) {
    for (var i = 0; i < 3; i++) {
      let saveId = i;
      let cloudSave = cloudRoot.saves[saveId];
      let localSave = saves[saveId];
      let newestSave = newestSave(cloudSave, localSave);
      let isConflicted = false;
      function overwriteCloudSave() {
          cloudRoot.saves[saveId] = saves[saveId];
      }
      function sendCloudSave() {
          saveToPlayFab(cloudRoot);
      }
      if (newestSave === cloudSave) {
          isConflicted = true;
          Modal.addCloudConflict(saveId, cloudSave, localSave, overwriteCloudSave, sendCloudSave);
          Modal.cloudSaveConflict.show();
      } else {
          overwriteCloudSave();
      }
      if (!isConflicted){
          sendCloudSave();
      }
    }
  });
}