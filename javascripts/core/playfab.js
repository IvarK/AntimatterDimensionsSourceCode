import { PlayFab } from "@/steam/PlayFabClientApi";

export function playFabLogin() {
  try {
    Steam.getAuthSessionTicket(ticket => {
      const SteamTicket = ticket.ticket.toString("hex");
      PlayFab.settings.titleId = "59813";
      const requestData = {
        TitleId: PlayFab.settings.titleId,
        SteamTicket,
        CreateAccount: true
      };
      try {
        PlayFab.ClientApi.LoginWithSteam(requestData, playFabLoginCallback);
      } catch (e) {
        console.log("Unable to send login request to PlayFab.");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

PlayFab.settings.titleId = "59813";
let playFabId = -1;

function playFabLoginCallback(data, error) {
  if (error) {
    console.log(error.errorMessage);
    GameUI.notify.error("Couldn't log in to PlayFab Cloud.");
    return;
  }
  if (data) {
    playFabId = data.data.PlayFabId;
    PlayFab.PlayFabID = playFabId;
    GameUI.notify.info("Logged in to PlayFab Cloud");
    PlayFab.ClientApi.UpdateUserTitleDisplayName({ "DisplayName": Steam.getSteamId().screenName });

    console.log("Logged in to playFab");
    SteamFunctions.autoLogin();
  }
}
