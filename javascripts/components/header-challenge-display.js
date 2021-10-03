"use strict";

Vue.component("header-challenge-display", {
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
    };
  },
  computed: {
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
      function celestialReality(celestial, name) {
        return {
          name: () => `${name} Reality`,
          isActive: token => token,
          activityToken: () => celestial.isRunning
        };
      }
      return [
        celestialReality(Teresa, "Teresa's"),
        celestialReality(Effarig, "Effarig's"),
        celestialReality(Enslaved, "The Enslaved Ones'"),
        celestialReality(V, "V's"),
        celestialReality(Ra, "Ra's"),
        celestialReality(Laitela, "Lai'tela's"),
        {
          name: () => "Time Dilation",
          isActive: token => token,
          activityToken: () => player.dilation.active
        },
        {
          name: token => `${NormalChallenge(token).config.name} Challenge`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
        },
        {
          name: token => `Infinity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.infinity.current
        },
        {
          name: token => `Eternity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.eternity.current
        },
      ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.name(token).includes("Eternity Challenge")) {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC).completions + 1;
          let completionText = "";
          if (Enslaved.isRunning && currEC === 1) {
            completionText = `(${nextCompletion}/???)`;
          } else if (nextCompletion === 6) {
            completionText = `(already completed)`;
          } else {
            completionText = `(${nextCompletion}/${formatInt(5)})`;
          }
          names.push(`${part.name(token)} ${completionText}`);
        } else {
          names.push(part.name(token));
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    isInFailableEC() {
      return this.activeChallengeNames.some(str => str.match(/Eternity Challenge (4|12)/gu));
    },
    challengeDisplay() {
      if (this.activeChallengeNames.length === 0) {
        return "the Antimatter Universe (no active challenges)";
      }
      return this.activeChallengeNames.join(" + ");
    },
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      this.showExit = this.activeChallengeNames.length !== 0;
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
    },
    // Process exit requests from the inside out; exit any Challenges first, then dilation, then Celestial Reality
    exitButtonClicked() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
      } else if (player.dilation.active) {
        startDilatedEternityRequest();
      } else {
        beginProcessReality(getRealityProps(true));
      }
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return "Exit Challenge";
      if (player.dilation.active) return "Exit Dilation";
      if (this.resetCelestial) return "Restart Reality";
      return "Exit Reality";
    },
  },
  template: `
    <div
      v-if="isVisible"
      class="l-game-header__challenge-text"
    >
      <span style="padding: 0.5rem;">
        You are currently in {{ challengeDisplay }}
      </span>
      <failable-ec-text v-if="isInFailableEC" />
      <span style="padding: 0.3rem;" />
      <primary-button
        v-if="showExit"
        @click="exitButtonClicked"
      >
        {{ exitText }}
      </primary-button>
    </div>`
});
