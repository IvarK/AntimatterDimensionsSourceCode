"use strict";

Vue.component("normal-time-study", {
  props: {
    setup: Object
  },
  data: () => ({
    showCost: true,
    showSTCost: false
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    hintText() {
      const id = this.study.id;
      switch (this.setup.path) {
        case TIME_STUDY_PATH.NORMAL_DIM: return `${id} Normal Dims`;
        case TIME_STUDY_PATH.INFINITY_DIM: return `${id} Infinity Dims`;
        case TIME_STUDY_PATH.TIME_DIM: return `${id} Time Dims`;
        case TIME_STUDY_PATH.ACTIVE: return `${id} Active`;
        case TIME_STUDY_PATH.PASSIVE: return `${id} Passive`;
        case TIME_STUDY_PATH.IDLE: return `${id} Idle`;
        case TIME_STUDY_PATH.LIGHT: return `${id} Light`;
        case TIME_STUDY_PATH.DARK: return `${id} Dark`;
      }
      return id;
    }
  },
  methods: {
    update() {
      this.showCost = this.study.id !== 192 || !Enslaved.isRunning;
      const canBeBought = typeof this.study.config.requirement === "function"
                          ? this.study.config.requirement()
                          : TimeStudy(this.study.config.requirement).isBought;

      this.showSTCost = !canBeBought &&
                        this.study.config.requirementV !== undefined &&
                        this.study.config.requirementV() &&
                        this.study.STCost !== undefined;
    },
  },
  template:
    `<time-study :setup="setup" :showCost="showCost" :showSTCost="showSTCost">
      <hint-text type="studies" class="l-hint-text--time-study">{{hintText}}</hint-text>
      <description-display :config="study.config" />
      <effect-display br :config="study.config" />
    </time-study>`
});
