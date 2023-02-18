import { discordRichPresence } from "./secret-formula/discord-rich-presence";

export const RichPresenceInfo = {
  get gameStage() {
    const stageDB = discordRichPresence.stages;
    for (let stage = stageDB.length - 1; stage >= 0; stage--) {
      if (stageDB[stage].hasReached()) return stageDB[stage];
    }
    throw Error("No valid progress stage found");
  },
  get challengeState() {
    const challDB = discordRichPresence.challenges;
    for (let index = 0; index < challDB.length; index++) {
      const chall = challDB[index];
      if (chall.activityToken()) return chall;
    }
    return null;
  },

  // First line of info for DRP
  get details() {
    const chall = this.challengeState;
    const stageName = typeof this.gameStage.name === "function" ? this.gameStage.name() : this.gameStage.name;
    if (!chall) return `At ${stageName} (${this.gameStage.mainResource()})`;
    const challResStr = chall.resource()
      ? `, ${chall.resource()}`
      : "";
    return `At ${stageName} (In ${chall.name(chall.activityToken())}${challResStr})`;
  },
  // Second line of info for DRP
  get state() {
    const mainRes = this.challengeState ? [this.gameStage.mainResource()] : [];
    return mainRes.concat((this.gameStage.resourceList ?? []).map(res => res())).join(" | ");
  }
};
