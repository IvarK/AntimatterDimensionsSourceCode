<script>
export default {
  name: "VUnlockRequirement",
  props: {
    dbEntry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resource: new Decimal(0),
      progress: 0,
    };
  },
  computed: {
    barProgressStyle() {
      const color = this.progress === 1
        ? "var(--color-v--base)"
        : "#6b5f2e";
      return {
        background: color,
        width: `${100 * this.progress}%`
      };
    },
    textStyle() {
      return {
        color: this.progress === 1
          ? "black"
          : "var(--color-text)",
        "border-color": "var(--color-text)",
      };
    },
  },
  methods: {
    update() {
      this.resource.copyFrom(new Decimal(this.dbEntry.resource()));
      this.progress = Math.clampMax(this.dbEntry.progress(), 1);
    }
  }
};
</script>

<template>
  <div
    class="c-v-unlock-bar"
    :style="textStyle"
  >
    <div
      class="c-v-unlock-bar__progress"
      :style="barProgressStyle"
    />
    {{ dbEntry.format(resource) }} / {{ dbEntry.format(dbEntry.requirement) }} {{ dbEntry.name }}
  </div>
</template>