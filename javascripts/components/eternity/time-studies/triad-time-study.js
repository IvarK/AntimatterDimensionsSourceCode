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
    formattedEffect() {
      return this.config.formatEffect(this.study.effectValue);
    }
  },
  methods: {

  },
  template:
    `<time-study :setup="setup" class="o-time-study--eternity-challenge">
      <template>
        <span>
        {{ config.description }}<br>
        Currently: {{ formattedEffect }}
        </span>
      </template>
    </time-study>`
});
