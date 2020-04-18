"use strict";

Vue.component("teresa-tab", {
  data() {
    return {
      pour: false,
      time: new Date().getTime(),
      rmStore: 0,
      rm: new Decimal(0),
      percentage: "",
      rmMult: 0,
      bestAM: new Decimal(0),
      runReward: 0,
      pp: 0,
      hasReality: false,
      hasEPGen: false,
      hasPerkShop: false,
    };
  },
  computed: {
    unlockInfo: () => Teresa.unlockInfo,
    rmStoreMax: () => Teresa.rmStoreMax,
    upgrades() {
      return [
        PerkShopUpgrade.glyphLevel,
        PerkShopUpgrade.rmMult,
        PerkShopUpgrade.bulkDilation,
        PerkShopUpgrade.autoSpeed,
        PerkShopUpgrade.musicGlyph,
      ];
    }
  },
  methods: {
    update() {
      const now = new Date().getTime();
      if (this.pour) {
        const diff = (now - this.time) / 1000;
        Teresa.pourRM(diff);
      }
      this.time = now;
      this.rmStore = player.celestials.teresa.rmStore;
      this.percentage = Notations.current.name === "Blind" ? "0%" : `${(Teresa.fill * 100).toFixed(2)}%`;
      this.rmMult = Teresa.rmMultiplier;
      this.hasReality = Teresa.has(TERESA_UNLOCKS.RUN);
      this.hasEPGen = Teresa.has(TERESA_UNLOCKS.EPGEN);
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.bestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.runReward = Teresa.runRewardMultiplier;
      this.pp = player.reality.pp;
      this.rm.copyFrom(player.reality.realityMachines);
    },
    startRun() {
      celestialResetModal(() => {
        resetReality(true);
        Teresa.initializeRun();
      });
    },
    unlockDescriptionStyle(unlockInfo) {
      const maxPrice = Teresa.unlockInfo[Teresa.lastUnlock].price;
      const pos = Math.log1p(unlockInfo.price) / Math.log1p(maxPrice);
      return {
         bottom: `${(100 * pos).toFixed(2)}%`,
      };
    },
  },
  template:
    `<div class="l-teresa-celestial-tab">
      <celestial-quote-history celestial="teresa"/>
      <div>You have {{format(rm, 2, 2)}} {{"Reality Machine" | pluralize(rm)}}.</div>
      <div class="l-mechanics-container">
        <div class="l-teresa-unlocks l-teresa-mechanic-container">
          <div class="c-teresa-unlock c-teresa-run-button" v-if="hasReality" @click="startRun()">
            Start Teresa's Reality. Glyph TT generation is disabled and
            you gain less IP and EP (x^{{format(0.55, 2, 2)}}).
            <br><br>
            Highest antimatter in Teresa's Reality: {{ format(bestAM, 2, 0) }}
          </div>
          <div class="c-teresa-unlock" v-if="hasReality">
            Teresa Reality reward: Glyph sacrifice power {{ formatX(runReward, 2, 2) }}
          </div>
          <div class="c-teresa-unlock" v-if="hasEPGen">You gain 1% of your peaked EP/min every second.</div>
          <div class="c-teresa-shop" v-if="hasPerkShop">
            <span class="o-teresa-pp"> You have {{ format(pp, 2, 0) }} {{"Perk Point" | pluralize(pp)}}.</span>
            <perk-shop-upgrade
              v-for="upgrade in upgrades"
              :key="upgrade.id"
              :upgrade="upgrade"
            />
          </div>
        </div>
        <div class="l-rm-container l-teresa-mechanic-container">
          <button class="o-primary-btn c-teresa-pour"
            @mousedown="pour = true"
            @touchstart="pour = true"
            @mouseup="pour = false"
            @touchend="pour = false"
            @mouseleave="pour = false"
          >Pour RM</button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label"> {{ format(rmMult, 2, 2) }}x RM gain
                <br>{{ format(rmStore, 2, 2) }}/{{ format(rmStoreMax, 2, 2) }}
              </div>
            </div>
            <div v-for="unlockInfo in unlockInfo"
              class="c-teresa-unlock-description"
              :style="unlockDescriptionStyle(unlockInfo)"
              :id="unlockInfo.id">
                {{ format(unlockInfo.price, 2, 2) }}: {{ unlockInfo.description }}
            </div>
          </div>
        </div>
        <div class="c-unlock-descriptions l-teresa-mechanic-container"></div>
      </div>
    </div>`
});
