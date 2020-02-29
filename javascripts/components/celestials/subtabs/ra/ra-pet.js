"use strict";

Vue.component("ra-pet", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      level: 0,
      exp: 0,
      requiredExp: 0,
      nextLevelEstimate: "",
      memoryChunks: 0,
      memoryChunksPerSecond: 0,
      memoriesPerSecond: 0,
      canGetMemoryChunks: false,
      resource: ""
    };
  },
  computed: {
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    petStyle() {
      return {
        color: this.petConfig.pet.color
      };
    },
    unlocks() {
      return Object.values(RA_UNLOCKS)
        .filter(unlock => unlock.pet === this.petConfig.pet)
        .sort((a, b) => a.level - b.level);
    },
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.level = pet.level;
      this.exp = pet.exp;
      this.requiredExp = pet.requiredExp;
      this.memoryChunks = pet.memoryChunks;
      this.memoryChunksPerSecond = pet.memoryChunksPerSecond;
      this.memoriesPerSecond = pet.memoryChunks * Ra.productionPerMemoryChunk();
      this.canGetMemoryChunks = pet.canGetMemoryChunks;
      this.resource = {
        "Teresa": "EP",
        "Effarig": "relic shards gained",
        "Enslaved": "time shards",
        "V": "infinity power"
      }[pet.name]

      const needed = (this.requiredExp - this.exp) / Ra.productionPerMemoryChunk();
      const a = pet.memoryChunksPerSecond / 2;
      const b = pet.memoryChunks;
      const c = -needed;
      const timeToLevel = a > 0 ? (Math.sqrt(Math.pow(b, 2) - 4 * a * c) - b) / (2 * a) : -c / b;
      if (Number.isFinite(timeToLevel)) {
        this.nextLevelEstimate = TimeSpan.fromSeconds(timeToLevel).toStringShort(false);
      } else {
        this.nextLevelEstimate = "never";
      }
    },
  },
  template: `
    <div class="l-ra-pet-container" v-if="isUnlocked">
      <div class="c-ra-pet-header" :style="petStyle">
        <div class="c-ra-pet-title">{{ name }} Level {{ formatInt(level) }}</div>
        <div v-if="level >= 2">
          {{ scalingUpgradeText }}
        </div>
        <div v-else>
          <br>
        </div>
        <div>
          {{ format(exp, 2) }} / {{ format(requiredExp, 2) }} {{ name }} memories
        </div>
        <div>
          {{ format(memoryChunks, 2, 2) }} memory chunks, {{ format(memoriesPerSecond, 2, 2) }} memories/second
        </div>
        <div>
          (next level in {{ nextLevelEstimate }})
        </div>
        <div v-if="canGetMemoryChunks">
          {{ format(memoryChunksPerSecond, 2, 2) }} memory chunks/second
          <br/>
          (based on {{ resource }})
        </div>
        <ra-pet-level-bar :pet="petConfig.pet" />
        <div style="display: flex; justify-content: center;">
          <ra-upgrade-icon v-for="(unlock, i) in unlocks"
          :key="i"
          :unlock="unlock" />
        </div>
      </div>
    </div>
  `
});
