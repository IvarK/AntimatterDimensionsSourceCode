"use strict";

Vue.component("triad-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      hasRequirement: false,
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    config() {
      return this.study.config;
    },
    showEffect() {
      return typeof this.config.effect === "function";
    },
    formattedEffect() {
      if (!this.showEffect) return "";
      return this.config.formatEffect(this.study.effectValue);
    }
  },
  methods: {

  },
  template:
    `<time-study :setup="setup" class="o-time-study--triad" :showSTCost="true">
      <template>
        <span>
          {{ config.description }}
          <br>
          <span v-if="showEffect">Currently: {{ formattedEffect }}</span>
        </span>
      </template>
    </time-study>`
});
