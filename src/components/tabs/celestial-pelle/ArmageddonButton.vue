<script>
export default {
  name: "ArmageddonButton",
  data() {
    return {
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    remnants() {
      if (this.remnantsGain <= 1) return format(this.remnantsGain, 2, 2);
      return format(this.remnantsGain, 2, 0);
    }
  },
  methods: {
    update() {
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    manualArmageddon() {
      if (!this.canArmageddon) return;

      if (player.options.confirmations.armageddon) Modal.armageddon.show();
      else Pelle.armageddon(true);
    }
  }
};
</script>

<template>
  <button
    class="c-armageddon-button"
    :class="{ 'c-armageddon-button--unavailable': !canArmageddon }"
    @click="manualArmageddon"
  >
    <span class="c-remnant-gain-display">
      Armageddon for
      <span class="c-remnant-gain">{{ remnants }}</span>
      Remnants
    </span>
    <br>
    Reality Shards
    <span class="c-reality-shard-gain">{{ format(realityShardGain, 2, 2) }}</span>/s ➜
    <span class="c-reality-shard-gain">{{ format(nextRealityShardGain, 2, 2) }}</span>/s
  </button>
</template>

<style scoped>
  .c-armageddon-button {
    padding: 1.5rem;
    display: block;
    font-family: Typewriter;
    background: var(--color-prestige--accent);
    border: 1px solid var(--color-pelle--base);
    color: var(--color-text);
    border-radius: 5px;
  }

  .c-armageddon-button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 5px var(--color-pelle--base);
    transition-duration: 0.12s;
  }

  .c-armageddon-button--unavailable {
    cursor: default;
    opacity: 0.5;
  }

  .c-remnant-gain {
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-pelle--base);
  }

  .c-remnant-gain-display {
    vertical-align: middle;
  }

  .c-reality-shard-gain {
    font-weight: bold;
    color: var(--color-pelle--base);
  }
</style>
