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
  methods: {
    update() {
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    armageddon() {
      Pelle.armageddon(true);
    }
  }
};
</script>

<template>
  <button
    class="c-armageddon-button"
    :class="{ 'c-armageddon-button--unavailable': !canArmageddon }"
    @click="armageddon"
  >
    Armageddon for
    <span class="c-remnant-gain">{{ format(remnantsGain, 2, remnantsGain < 1 ? 2 : 0) }}</span>
    remnants<br>
    Reality shard gain
    <span class="c-reality-shard-gain">{{ format(realityShardGain, 2, 2) }}</span>/s ->
    <span class="c-reality-shard-gain">{{ format(nextRealityShardGain, 2, 2) }}</span>/s
  </button>
</template>

<style scoped>
  .c-armageddon-button {
    padding: 2rem;
    display: block;
    margin: 2rem auto;
    font-family: Typewriter;
    background: black;
    border: 1px solid var(--color-pelle--base);
    color: white;
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

  .c-reality-shard-gain {
    font-weight: bold;
    color: var(--color-pelle--base);
  }
</style>
