export declare module Greenworks {
  export interface NodeModule {
    initAPI(): boolean;
    getSteamId(): SteamId;
    getAuthSessionTicket(resolve: (ticket: SteamAuthTicket) => void, reject: (error: any) => void): void;
    activateAchievement(id: string, resolve: () => void, reject: (error: any) => void): void;
    getAchievementNames(): string[];
    initDiscordAPI(clientId: string, steamGameId: number): void;
    runDiscordCallbacks(): void;
    setDiscordActivity(info: DiscordActivityInfo): void;
    on(event: string, callback: Function): void;
  }

  export interface SteamId {
    screenName: string;
    accountId: string;
    staticAccountId: string;
  }

  export interface SteamAuthTicket {
    ticket: Buffer;
  }

  export interface DiscordActivityInfo {
    largeImage: string;
    smallImage: string;
    details: string;
    state: string;
  }
}

