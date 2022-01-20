import "./perk-shop-upgrade.js";
import "../../celestial-quote-history.js";
import { DC } from "../../../../core/constants.js";
import GlyphSetPreview from "@/components/GlyphSetPreview";

Vue.component("teresa-tab", {
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      pour: false,
      time: new Date().getTime(),
      pouredAmount: 0,
      rm: new Decimal(0),
      percentage: "",
      possibleFillPercentage: "",
      rmMult: 0,
      bestAM: new Decimal(0),
      bestAMSet: [],
      lastMachines: new Decimal(0),
      runReward: 0,
      perkPoints: 0,
      hasReality: false,
      hasEPGen: false,
      hasPerkShop: false,
      raisedPerkShop: false,
      isRunning: false,
      canUnlockNextPour: false,
    };
  },
  computed: {
    unlockInfo: () => Teresa.unlockInfo,
    pouredAmountCap: () => Teresa.pouredAmountCap,
    upgrades() {
      const upgrades = [
        PerkShopUpgrade.glyphLevel,
        PerkShopUpgrade.rmMult,
        PerkShopUpgrade.bulkDilation,
        PerkShopUpgrade.autoSpeed,
        PerkShopUpgrade.musicGlyph,
      ];
      if (this.raisedPerkShop) upgrades.push(PerkShopUpgrade.fillMusicGlyph);
      return upgrades;
    },
    runButtonClassObject() {
      return {
        "c-teresa-run-button__icon": true,
        "c-teresa-run-button__icon--running": this.isRunning,
      };
    },
    pourButtonClassObject() {
      return {
        "o-teresa-shop-button": true,
        "o-teresa-shop-button--available": true,
        "c-teresa-pour": true,
        "c-teresa-pour--unlock-available": this.canUnlockNextPour
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[0].description();
    },
    lastMachinesString() {
      return this.lastMachines.lt(DC.E10000)
        ? `${quantify("Reality Machine", this.lastMachines, 2)}`
        : `${quantify("Imaginary Machine", this.lastMachines.dividedBy(DC.E10000), 2)}`;
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
      this.pouredAmount = player.celestials.teresa.pouredAmount;
      this.percentage = `${(Teresa.fill * 100).toFixed(2)}%`;
      this.possibleFillPercentage = `${(Teresa.possibleFill * 100).toFixed(2)}%`;
      this.rmMult = Teresa.rmMultiplier;
      this.hasReality = Teresa.has(TERESA_UNLOCKS.RUN);
      this.hasEPGen = Teresa.has(TERESA_UNLOCKS.EPGEN);
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.raisedPerkShop = Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE);
      this.bestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.bestAMSet = Glyphs.copyForRecords(player.celestials.teresa.bestAMSet);
      this.lastMachines.copyFrom(player.celestials.teresa.lastRepeatedMachines);
      this.runReward = Teresa.runRewardMultiplier;
      this.perkPoints = Currency.perkPoints.value;
      this.rm.copyFrom(Currency.realityMachines);
      this.isRunning = Teresa.isRunning;
      this.canUnlockNextPour = Object.values(TERESA_UNLOCKS)
        .filter(unlock => this.rm.plus(this.pouredAmount).gte(unlock.price) && !Teresa.has(unlock)).length > 0;
    },
    startRun() {
      Modal.celestials.show({ name: "Teresa's", number: 0 });
    },
    unlockDescriptionStyle(unlockInfo) {
      const maxPrice = Teresa.unlockInfo[Teresa.lastUnlock].price;
      const pos = Math.log1p(unlockInfo.price) / Math.log1p(maxPrice);
      return {
        bottom: `${(100 * pos).toFixed(2)}%`,
      };
    },
  },
  template: `
    <div class="l-teresa-celestial-tab">
      <celestial-quote-history celestial="teresa" />
      <div>
        You have {{ quantify("Reality Machine", rm, 2, 2) }}.
      </div>
      <div class="l-mechanics-container">
        <div class="l-teresa-mechanic-container" v-if="hasReality">
          <div class="c-teresa-unlock c-teresa-run-button">
            <div :class="runButtonClassObject" @click="startRun()">Ϟ</div>
            Start Teresa's Reality.
            {{ runDescription }}
            <br><br>
            <div v-if="bestAM.gt(0)">
              This Reality can be repeated for a stronger reward if you can get more antimatter within it.
              <br><br>
              You last did Teresa's Reality at {{ lastMachinesString }}, reaching a record of {{ format(bestAM, 2) }}
              antimatter.
              <br><br>
              Glyph Set used:
              <GlyphSetPreview
                text="Teresa's Best Glyph Set"
                :textHidden="true"
                :forceNameColor=false
                :glyphs="bestAMSet"
              />
            </div>
            <div v-else>
              You have not completed Teresa's Reality yet.
            </div>
          </div>
          <div class="c-teresa-unlock">
            Teresa Reality reward: Glyph Sacrifice power {{ formatX(runReward, 2, 2) }}
          </div>
          <div class="c-teresa-unlock" v-if="hasEPGen">
            Every second, you gain {{ formatPercents(0.01) }} of your peaked Eternity Points per minute this Reality.
          </div>
        </div>
        <div class="l-rm-container l-teresa-mechanic-container">
          <button :class="pourButtonClassObject"
            @mousedown="pour = true"
            @touchstart="pour = true"
            @mouseup="pour = false"
            @touchend="pour = false"
            @mouseleave="pour = false"
          >
            Pour RM
          </button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner c-rm-store-inner--light" :style="{ height: possibleFillPercentage}"></div>
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label">
                {{ formatX(rmMult, 2, 2) }} RM gain
                <br>
                {{ format(pouredAmount, 2, 2) }}/{{ format(pouredAmountCap, 2, 2) }}
              </div>
            </div>
            <div v-for="unlockInfo in unlockInfo"
              class="c-teresa-unlock-description"
              :style="unlockDescriptionStyle(unlockInfo)"
              :id="unlockInfo.id"
            >
              {{ format(unlockInfo.price, 2, 2) }}: {{ unlockInfo.description }}
            </div>
          </div>
        </div>
        <div class="l-rm-container-labels l-teresa-mechanic-container" />
        <div class="c-teresa-shop" v-if="hasPerkShop">
          <span class="o-teresa-pp">
            You have {{ quantify("Perk Point", perkPoints, 2, 0) }}.
          </span>
          <perk-shop-upgrade
            v-for="upgrade in upgrades"
            :key="upgrade.id"
            :upgrade="upgrade"
          />
        </div>
      </div>
    </div>`
});
