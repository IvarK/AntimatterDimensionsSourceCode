"use strict";

Vue.component("game-header", {
  components: {
    "challenge-display": {
      data() {
        return {
          activityTokens: [],
          infinityUnlocked: false
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
              name: () => "Time Compression",
              isActive: token => token,
              activityToken: () => TimeCompression.isActive
            },
            {
              name: token => `${NormalChallenge(token).config.reward} Challenge`,
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
            names.push(part.name(token));
          }
          return names;
        },
        isVisible() {
          return this.infinityUnlocked || this.activeChallengeNames.length > 0;
        },
        challengeDisplay() {
          if (this.activeChallengeNames.length === 0) {
            return "the Antimatter Universe (no active challenges)";
          }
          return this.activeChallengeNames.join(" + ");
        }
      },
      methods: {
        update() {
          this.infinityUnlocked = PlayerProgress.infinityUnlocked();
          this.activityTokens = this.parts.map(part => part.activityToken());
        }
      },
      template: `
        <div v-if="isVisible">You are currently in {{challengeDisplay}}</div>
      `
    }
  },
  data() {
    return {
      isInMatterChallenge: false,
      matter: new Decimal(0),
      inEffarig: false,
      effarigMultNerfText: 0,
      effarigTickNerfText: 0,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.inEffarig = Effarig.isRunning;
      if (this.inEffarig) {
        this.effarigMultNerfText = `^${shorten(0.25 + 0.25 * Effarig.nerfFactor(player.infinityPower), 0, 5)}`;
        this.effarigTickNerfText = `^${shorten(0.7 + 0.1 * Effarig.nerfFactor(player.timeShards), 0, 5)}`;
      }
      this.antimatter.copyFrom(player.antimatter);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
    }
  },
  template:
    `<div>
      <challenge-display />
      <div v-if="inEffarig">
        Gamespeed and multipliers dilated {{effarigMultNerfText}}<br>
        Tickspeed dilated {{effarigTickNerfText}}
      </div>
      <div v-if="isInMatterChallenge">There is {{shortenMoney(matter)}} matter.</div>
      <game-header-amounts-line />
      <div>
        <p>You have <span class="c-game-header__antimatter">{{shortenMoney(antimatter)}}</span> antimatter.</p>
      </div>
      <div class="l-game-header__buttons-line">
        <game-header-big-crunch-button />
        <game-header-new-dim-button />
        <game-header-eternity-button />
      </div>
      <div>You are getting {{format(antimatterPerSec, 2, 0)}} antimatter per second.</div>
      <game-header-tickspeed-row />
    </div>`
});
