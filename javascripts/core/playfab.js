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
    $.notify("Couldn't log in to PlayFab Cloud. You need to be logged in to Kongregate.", "error")
    document.getElementById("cloudOptions").style.display = "none"
    document.getElementById("cloud").style.display = "none"
    return;
  }
  if (data) {
    //NOTE: SAVE 'playFabId' to a global variable somewhere, I just declare mine at the start of the playfab stuff. Use this variable to tell if your player is logged in to playfab or not.
    playFabId = data.data.PlayFabId;
    $.notify("Logged in to PlayFab Cloud", "info")

    if (player.options.cloud) playFabLoadCheck()
    console.log("Logged in to playFab")
  }
}

function saveToPlayFab(root) {
  if (!playFabId || typeof PlayFab === 'undefined' || typeof PlayFab.ClientApi === 'undefined') return false;

  // Cut compressed root object into strings of 10,000 bytes for PlayFab
  var chunks = LZString.compressToEncodedURIComponent(JSON.stringify(root)).match(/.{1,10000}/g);
  if (chunks.length > 10) {
    $.notify("Error saving to cloud: size limit exceeded", "error");
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
    $.notify("Game saved to cloud", "info")
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


function playFabLoadCheck() {
  var cloudconflict = document.getElementById("cloudloadconflict");
  loadFromPlayFab(function(cloudRoot) {
    $.notify("Loaded from cloud", "info")

    for (var i = 0; i < 3; i++) {
      let saveId = i;
      var cloudInfinitied = cloudRoot.saves[saveId] ? cloudRoot.saves[saveId].infinitied : 0;
      var cloudEternities = cloudRoot.saves[saveId] ? cloudRoot.saves[saveId].eternities : 0;
      var localInfinitied = saves[saveId] ? saves[saveId].infinitied : 0;
      var localEternities = saves[saveId] ? saves[saveId].eternities : 0;
      if (cloudEternities < localEternities || (cloudEternities == localEternities && cloudInfinitied < localInfinitied)) {
        let el = cloudconflict.cloneNode(true);
        el.style.display = "flex";
        var localEl = el.querySelector("#local");
        var cloudEl = el.querySelector("#cloud");

        localEl.querySelector(".save_id").textContent = saveId + 1;
        localEl.querySelector(".save_infinities").textContent = localInfinitied;
        localEl.querySelector(".save_eternities").textContent = localEternities;
        localEl.querySelector(".storebtn").onclick = function() {
          el.remove();
        };

        cloudEl.querySelector(".save_id").textContent = saveId + 1;
        cloudEl.querySelector(".save_infinities").textContent = cloudInfinitied;
        cloudEl.querySelector(".save_eternities").textContent = cloudEternities;
        cloudEl.querySelector(".storebtn").onclick = function() {
          load_cloud_save(saveId, cloudRoot.saves[saveId]);
          el.remove();
        };

        document.body.appendChild(el);
      } else {
        load_cloud_save(saveId, cloudRoot.saves[saveId]);
      }
    }
  });
}

function playFabSaveCheck() {
  var cloudconflict = document.getElementById("cloudsaveconflict");
  loadFromPlayFab(function(cloudRoot) {
    let popupsWaiting = 0;
    function decreaseWaiting() {
      popupsWaiting--;
      if (popupsWaiting <= 0) {
        saveToPlayFab(cloudRoot);
      }
    }

    for (var i = 0; i < 3; i++) {
      let saveId = i;
      var cloudInfinitied = cloudRoot.saves[saveId] ? cloudRoot.saves[saveId].infinitied : 0;
      var cloudEternities = cloudRoot.saves[saveId] ? cloudRoot.saves[saveId].eternities : 0;
      var localInfinitied = saves[saveId] ? saves[saveId].infinitied : 0;
      var localEternities = saves[saveId] ? saves[saveId].eternities : 0;
      if (cloudEternities > localEternities || (cloudEternities == localEternities && cloudInfinitied > localInfinitied)) {
        popupsWaiting++;
        let el = cloudconflict.cloneNode(true);
        el.style.display = "flex";
        var localEl = el.querySelector("#local");
        var cloudEl = el.querySelector("#cloud");

        localEl.querySelector(".save_id").textContent = saveId + 1;
        localEl.querySelector(".save_infinities").textContent = localInfinitied;
        localEl.querySelector(".save_eternities").textContent = localEternities;

        cloudEl.querySelector(".save_id").textContent = saveId + 1;
        cloudEl.querySelector(".save_infinities").textContent = cloudInfinitied;
        cloudEl.querySelector(".save_eternities").textContent = cloudEternities;

        el.querySelector(".no").onclick = function() {
          decreaseWaiting();
          el.remove();
        };
        el.querySelector(".yes").onclick = function() {
          cloudRoot.saves[saveId] = saves[saveId];
          decreaseWaiting();
          el.remove();
        };

        document.body.appendChild(el);
      } else {
        cloudRoot.saves[saveId] = saves[saveId];
      }
    }

    if (popupsWaiting === 0) decreaseWaiting();
  });
}