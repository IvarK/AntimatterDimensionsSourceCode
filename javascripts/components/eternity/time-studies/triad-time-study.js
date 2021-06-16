"use strict";

Vue.component("triad-time-study", {
  props: {
    setup: Object
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
  },
  methods: {
  },
  template: `
    <time-study :setup="setup" class="o-time-study--triad" :showSTCost="true">
      <hint-text type="studies" class="l-hint-text--time-study">T{{ id }}</hint-text>
      <description-display :config="study.config" />
      <effect-display br :config="study.config" />
    </time-study>`
});
