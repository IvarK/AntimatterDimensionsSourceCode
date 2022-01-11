<script>
export default {
  name: "SpeedrunMilestoneSingle",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    time: {
      type: Number,
      required: false
    },
    gap: {
      type: Number,
      required: false
    }
  },
  computed: {
    description() {
      return typeof this.milestone.description === "function"
        ? this.milestone.description()
        : this.milestone.description;
    },
    timeDisplay() {
      return this.time
        ? `Completed in ${TimeSpan.fromMilliseconds(this.time).toStringShort(true)}`
        : "Not reached yet";
    },
    gapDisplay() {
      return this.gap && this.gap !== this.time
        ? `(${TimeSpan.fromMilliseconds(this.gap).toStringShort(true)} after previous)`
        : "";
    },
    classObject() {
      return {
        "l-speedrun-milestone-entry": true,
        "l-speedrun-milestone-entry--completed": this.time
      };
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <b>{{ milestone.name }}</b>
    <br>
    <i>{{ description }}</i>
    <br>
    {{ timeDisplay }} {{ gapDisplay }}
  </div>
</template>
