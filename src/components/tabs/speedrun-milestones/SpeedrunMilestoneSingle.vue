<script>
export default {
  name: "SpeedrunMilestoneSingle",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    display: {
      type: Boolean,
      required: false,
      default: false,
    },
    time: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  computed: {
    displayName() {
      return this.display ? this.milestone.name : "???";
    },
    description() {
      if (!this.display) return "";
      return typeof this.milestone.description === "function"
        ? this.milestone.description()
        : this.milestone.description;
    },
    timeDisplay() {
      return this.time
        ? `Completed in ${TimeSpan.fromMilliseconds(this.time).toStringShort(true, true)}`
        : "Not reached yet";
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
    <b>{{ displayName }}</b>
    <i>{{ description }}</i>
    {{ timeDisplay }}
  </div>
</template>
