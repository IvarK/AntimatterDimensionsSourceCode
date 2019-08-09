"use strict";

Vue.component("compression-button", {
  data() {
    return {
      timeShards: new Decimal(0),
      isRunning: false,
      requiredForGain: new Decimal(0),
      entanglementGain: 0
    };
  },
  computed: {
    shardRequirement: () => TimeCompression.timeShardRequirement,
    canCompress() {
      return this.timeShards.gte(this.shardRequirement);
    }
  },
  methods: {
    update() {
      this.timeShards.copyFrom(player.timeShards);
      this.isRunning = player.celestials.ra.compression.active;
      if (!this.isRunning) return;
      this.entanglementGain = this.gainedEntanglement();
      if (this.entanglementGain <= 0) {
        this.requiredForGain.copyFrom(this.minAntimatterForEntanglement());
      }
    },
    minAntimatterForEntanglement() {
      if (TimeCompression.totalEntanglement === 308) {
        return Decimal.pow10(9e15);
      }
      const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
      return Decimal.pow10(2e5 * Math.pow(1 + TimeCompression.totalEntanglement / (30.8 * entanglementMult), 2.5));
    },
    gainedEntanglement() {
      return Math.max(0, TimeCompression.entanglementThisRun - TimeCompression.totalEntanglement);
    },
  },
  template:
    `<button class="o-compression-btn" onclick="TimeCompression.toggle()">
      <span v-if="!canCompress && !isRunning">
        Time compression requires {{ shorten(shardRequirement) }} time shards to activate.
        <br>
        Currently: {{ shorten(timeShards) }} time shards
      </span>
      <span v-else-if="!isRunning">Compress time.</span>
      <span v-else-if="entanglementGain > 0">
        Disable compression.
        <br>
        Gain {{shorten(entanglementGain, 0, 2)}} Entanglement.
      </span>
      <span v-else>
        Disable compression.
        <br>
        Reach {{shorten(requiredForGain, 2, 2)}} antimatter to gain more Entanglement.
      </span>
    </button>`
});
