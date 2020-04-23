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
            names.push(part.name(token));
          }
          return names;
        },
        isVisible() {
          return this.infinityUnlocked || this.activeChallengeNames.length > 0;
        },
        isInFailableEC() {
          return this.activeChallengeNames.includes("Eternity Challenge 4") ||
            this.activeChallengeNames.includes("Eternity Challenge 12");
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
        <div v-if="isVisible">
          You are currently in {{challengeDisplay}} <failable-ec-text v-if="isInFailableEC"/>
        </div>
      `
    }
  },
  data() {
    return {
      isInMatterChallenge: false,
      matter: new Decimal(0),
      isInEffarig: false,
      isInRaEffarig: false,
      effarigMultNerfText: "",
      effarigTickNerfText: "",
      isInLaitela: false,
      laitelaTimer: 0,
      laitelaEntropy: "",
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
      this.isInEffarig = Effarig.isRunning;
      if (this.isInEffarig) {
        this.effarigMultNerfText = `${formatPow(0.25 + 0.25 * Effarig.nerfFactor(player.infinityPower), 0, 5)}`;
        this.effarigTickNerfText = `${formatPow(0.7 + 0.1 * Effarig.nerfFactor(player.timeShards), 0, 5)}`;
      }
      this.isInRaEffarig = Ra.effarigRealityActive;
      if (this.isInRaEffarig) {
        this.effarigMultNerfText = `${formatPow(0.25 + 0.25 * Effarig.nerfFactor(player.antimatter), 0, 5)}`;
      }
      this.isInLaitela = Laitela.isRunning;
      if (this.isInLaitela) {
        if (player.celestials.laitela.entropy > 0) { 
          this.laitelaEntropy = `${formatPercents(player.celestials.laitela.entropy, 2, 2)}`;
          this.laitelaTimer = Time.thisRealityRealTime.toStringShort();
        } else {
          this.laitelaEntropy = `${formatPercents(1, 2, 2)}`;
          this.laitelaTimer = TimeSpan.fromSeconds(player.celestials.laitela.thisCompletion).toStringShort();
        }
      }
      this.antimatter.copyFrom(player.antimatter);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
    }
  },
  template:
    `<div>
      <challenge-display />
      <div v-if="isInEffarig">
        Gamespeed and multipliers dilated {{effarigMultNerfText}}
        <br>
        Tickspeed dilated {{effarigTickNerfText}}
      </div>
      <div v-else-if="isInRaEffarig">
        Multipliers dilated {{effarigMultNerfText}}
      </div>
      <div v-if="isInLaitela">
        Entropy: {{ laitelaEntropy }} ({{ laitelaTimer }})
      </div>
      <div v-if="isInMatterChallenge">There is {{format(matter, 2, 1)}} matter.</div>
      <game-header-amounts-line />
      <div>
        <p>You have <span class="c-game-header__antimatter">{{format(antimatter, 2, 1)}}</span> antimatter.</p>
      </div>
      <div class="l-game-header__buttons-line">
        <game-header-big-crunch-button />
        <game-header-new-dim-button />
        <game-header-eternity-button />
      </div>
      <div>You are getting {{format(antimatterPerSec, 2, 0)}} antimatter per second.</div>
      <game-header-tickspeed-row />
      <black-hole-header-row />
    </div>`
});
