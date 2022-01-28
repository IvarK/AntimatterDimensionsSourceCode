<script>
export default {
  props: {
    rift: Object,
    compact: Boolean
  },
  data() {
    return {
      active: false,
      percentage: 0,
      effect: new Decimal()
    };
  },
  methods: {
    update() {
      this.active = this.rift.isActive;
      this.percentage = this.rift.percentage;
      this.effect.copyFrom(this.rift.effectValue);
    },
    hasMilestone(idx) {
      return this.rift.hasMilestone(idx);
    }
  }
};
</script>

<template>
  <div class="c-pelle-rift">
    <h2>{{ rift.name }}</h2>
    <div
      class="c-pelle-rift-bar"
      :class="{'c-pelle-rift-bar--compact': compact }"
    >
      <div class="o-pelle-rift-bar-percentage">
        {{ formatPercents(percentage, 3) }}
      </div>
      <div
        class="o-pelle-rift-bar-fill"
        :style="{
          height: !compact ? `${percentage * 100}%` : '100%',
          width: compact ? `${percentage * 100}%` : '100%'
        }"
      />
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-line-' + idx"
        class="o-pelle-rift-bar-milestone-line"
        :class="{'o-pelle-rift-bar-milestone-line--compact': compact }"
        :style="{
          bottom: !compact ? `${milestone.requirement * 100}%` : 0,
          left: compact ? `${milestone.requirement * 100}%` : 0,
          display: milestone.requirement === 1 ? 'none' : 'block'
        }"
      />
    </div>
    <button
      class="o-pelle-rift-toggle"
      :class="{ 'o-pelle-rift-toggle--active': active }"
      @click="rift.toggle()"
    >
      {{ active ? "Filling" : "Idle" }}
    </button>
    <div
      class="c-pelle-rift-description"
      :class="{ 'c-pelle-rift-description--compact': compact }"
    >
      <span v-if="!compact">{{ rift.description }}<br><br></span>
      <span class="highlight">{{ rift.effectDescription }}</span>
    </div>
    <div v-if="!compact">
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-' + idx"
        class="o-pelle-rift-milestone"
        :class="{ 'o-pelle-rift-milestone--unlocked': hasMilestone(idx) }"
      >
        {{ formatPercents(milestone.requirement) }}: {{ milestone.description }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .c-pelle-rift {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .c-pelle-rift-bar {
    height: 20rem;
    border: 2px solid var(--color-pelle-secondary);
    width: 15rem;
    border-radius: 5px;
    position: relative;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1e1e1e;
  }

  .c-pelle-rift-bar--compact {
    height: 5rem;
  }

  .o-pelle-rift-bar-percentage {
    font-size: 1.5rem;
    color: white;
    text-shadow: 1px 1px 2px var(--color-pelle--base);
    z-index: 3;
  }

  .o-pelle-rift-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--color-pelle-secondary);
    z-index: 2;
  }

  .o-pelle-rift-bar-milestone-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: var(--color-pelle--base);
    z-index: 1;
  }

  .o-pelle-rift-bar-milestone-line--compact {
    width: 2px;
    height: 100%;
  }

  .o-pelle-rift-toggle {
    padding: .5rem;
    background: black;
    border: 1px solid var(--color-pelle-secondary);
    font-family: Typewriter;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    width: 8rem;
    margin-bottom: 1rem;
  }

  .c-pelle-rift-description {
    margin-bottom: 2rem;
    width: 25rem;
  }

  .o-pelle-rift-toggle:hover {
    box-shadow: 1px 1px 3px var(--color-pelle-secondary);
    transition-duration: 0.12s;
  }

  .o-pelle-rift-toggle--active {
    background: var(--color-pelle-secondary);
    color: black;
  }

  .o-pelle-rift-milestone {
    padding: 1rem;
    background: black;
    width: 20rem;
    margin-bottom: 1rem;
    color: white;
    border: 1px solid var(--color-pelle-secondary);
    border-radius: 5px;
  }

  .o-pelle-rift-milestone--unlocked {
    padding: 1rem;
    background: var(--color-pelle-secondary);
    color: black;
  }

  h2, .highlight {
    color: var(--color-pelle--base);
    text-shadow: 1px 1px 2px black;
  }
</style>