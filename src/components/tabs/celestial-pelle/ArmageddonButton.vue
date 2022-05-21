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
      return format(this.remnantsGain, 2, this.remnantsGain > 1 ? 0 : 2);
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
  display: block;
  width: 100%;
  font-family: Typewriter;
  color: var(--color-text);
  background: var(--color-text-inverted);
  border: 0.1rem solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 1.5rem;
}

.c-armageddon-button:hover {
  box-shadow: 0.1rem 0.1rem 0.5rem var(--color-pelle--base);
  transition-duration: 0.12s;
  cursor: pointer;
}

.c-armageddon-button--unavailable {
  opacity: 0.5;
  cursor: default;
}

.c-remnant-gain {
  font-size: 1.5rem;
  font-weight: bold;
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
