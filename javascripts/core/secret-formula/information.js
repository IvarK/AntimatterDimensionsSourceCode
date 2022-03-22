import { GameDatabase } from "./game-database.js";

GameDatabase.information = {
  tabs: [
    {
      name: "Basic information",
      info: () => `
      Antimatter Dimensions is an Idle Incremental game with multiple layers of unlocks, prestige, and achievements.
      <br>
      <br>
      The basic goal is to reach Infinity and receive an Infinity Point, which can be spent on various upgrades to
      increase your overall production.
      `,
      id: 0
    },
    {
      name: "Discord",
      info: () => `
      Antimatter Dimensions has a Discord server, which can be joined 
      <u><a href="https://discord.gg/ST9NaXa">here</a></u>.
      `,
      id: 1
    },
    {
      name: "Donate",
      info: () => `
      You can donate to Hevipelle <u><a href="about.html">here</a></u>, through his Patreon or PayPal.
      `,
      id: 2
    },
    {
      name: "Changelog",
      info: () => `
      Visit the changelog page <u><a href="changelog.html">here</a></u>.
      `,
      id: 3
    },
    {
      name: "Subreddit",
      info: () => `
      Antimatter Dimensions has a subreddit, which you can visit 
      <u><a href="https://www.reddit.com/r/antimatterdimensions">here</a></u>.
      `,
      id: 4
    },
    {
      name: "Android version",
      info: () => `
      Antimatter Dimensions has an Android version; <u><a
      href="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions">
      click here to check it out!<a></u>
      `,
      id: 5
    }
  ]
};