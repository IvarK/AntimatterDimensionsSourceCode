"use strict";

Vue.component("compression-button", {
  data() {
    return {
      timeShards: new Decimal(0),
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0),
      entanglementGain: 0
    };
  },
  computed: {
    shardRequirement() {
      return TimeCompression.timeShardRequirement;
    },
    canCompress() {
      return this.timeShards.gte(this.shardRequirement);
    }
  },
  methods: {
    update() {
      this.timeShards.copyFrom(player.timeShards);
      this.isRunning = player.celestials.ra.compression.active;
      if (!this.isRunning) return;
      this.hasGain = TimeCompression.entanglementGain > 0;
      if (this.hasGain) {
        this.entanglementGain = TimeCompression.entanglementGain;
      } else {
        this.requiredForGain.copyFrom(TimeCompression.minAntimatterForEntanglement);
      }
    }
  },
  template:
    `<button class="o-compression-btn" onclick="TimeCompression.toggle()">
      <span v-if="!canCompress && !isRunning">
        Time compression requires {{ shorten(shardRequirement) }} time shards to activate.
        <br>
        Currently: {{ shorten(timeShards) }} time shards
      </span>
      <span v-else-if="!isRunning">Compress time.</span>
      <span v-else-if="hasGain">
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
