<script>
export default {
  name: "BigCrunchButton",
  data() {
    return {
      isModern: false,
      smallCrunch: false,
      shouldDisplay: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = !player.break && Player.canCrunch;
      if (!this.shouldDisplay) return;
      this.isModern = player.options.newUI;
      this.smallCrunch = Time.bestInfinityRealTime.totalMinutes <= 1;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) bigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  }
};
</script>

<template>
  <span v-if="shouldDisplay">
    <div v-if="isModern">
      <h3
        v-if="!smallCrunch"
        class="l-spacing"
      >
        The world has collapsed due to excess antimatter.
      </h3>
      <button
        :class="{
          'btn-big-crunch': true,
          'btn-big-crunch--small': smallCrunch
        }"
        @click="handleClick"
      >
        Big Crunch
      </button>
    </div>
    <div v-else>
      <button
        :class="{
          'o-tab-btn': true,
          'o-big-crunch-btn': true,
          'l-old-ui__big-crunch-btn': true,
          'l-old-ui__big-crunch-btn--overlay': smallCrunch
        }"
        @click="handleClick"
      >
        Big Crunch
      </button>
      <div
        v-if="!smallCrunch"
        class="o-emptiness"
      >
        The world has collapsed due to excess of antimatter.
      </div>
    </div>
  </span>
</template>

<style scoped>
.l-spacing {
  margin-top: 1rem;
}
</style>
