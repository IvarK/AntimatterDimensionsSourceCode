import { NodeModule } from "./node-module";

/**
 * @type {NodeModule<Greenworks.NodeModule>}
 */
const module = new NodeModule("greenworks");

export function isModuleLoaded() {
  return module.isLoaded;
}

export function initAPI() {
  return module.safeCall(
    x => x.initAPI(),
    false
  );
}

export function getSteamId() {
  return module.safeCall(
    x => x.getSteamId()
  );
}

/**
 * @returns {Promise<Greenworks.SteamAuthTicket>}
 */
export function getAuthSessionTicket() {
  return module.makePromise(
    (x, resolve, reject) => x.getAuthSessionTicket(resolve, reject)
  );
}

/**
 * @returns {Promise<void>}
 */
export function activateAchievement(id) {
  return module.makePromise(
    (x, resolve, reject) => x.activateAchievement(id, resolve, reject)
  );
}

export function getAchievementNames() {
  return module.safeCall(
    x => x.getAchievementNames(),
    []
  );
}

export function initDiscordAPI(clientId, steamGameId) {
  return module.safeCall(
    x => x.initDiscordAPI(clientId, steamGameId)
  );
}

export function runDiscordCallbacks() {
  return module.safeCall(
    x => x.runDiscordCallbacks()
  );
}

export function on(event, callback) {
  return module.safeCall(
    x => x.on(event, callback)
  );
}

export function setDiscordActivity(state, details) {
  return module.safeCall(
    x => x.setDiscordActivity({
      smallImage: "icon",
      largeImage: "icon",
      state,
      details
    })
  );
}

