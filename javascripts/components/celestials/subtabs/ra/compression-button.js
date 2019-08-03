"use strict";

Vue.component("compression-button", {
  data() {
    return {
      timeShards: new Decimal(0),
      shardRequirement: new Decimal("1e3500000"),
      canCompress: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(0),
      entanglementGain: 0
    };
  },
  methods: {
    update() {
      this.timeShards.copyFrom(player.timeShards);
      this.canCompress = this.timeShards.gte(this.shardRequirement);
      this.isRunning = player.celestials.ra.compression.active;
      if (!this.isRunning) return;
      this.hasGain = getEntanglementGain() > 0;
      if (this.hasGain) {
        this.entanglementGain = getEntanglementGain();
      } else {
        this.requiredForGain.copyFrom(minAntimatterForEntanglement());
      }
    }
  },
  template:
    `<button class="o-compression-btn" onclick="toggleCompression()">
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
