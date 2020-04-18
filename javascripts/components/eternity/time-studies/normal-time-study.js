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
    classObject() {
      const classObject = {};
      classObject[this.pathClass] = true;
      return classObject;
    },
    pathClass() {
      switch (this.setup.path) {
        case TIME_STUDY_PATH.NORMAL_DIM: return "o-time-study--normal-dim";
        case TIME_STUDY_PATH.INFINITY_DIM: return "o-time-study--infinity-dim";
        case TIME_STUDY_PATH.TIME_DIM: return "o-time-study--time-dim";
        case TIME_STUDY_PATH.ACTIVE: return "o-time-study--active";
        case TIME_STUDY_PATH.PASSIVE: return "o-time-study--passive";
        case TIME_STUDY_PATH.IDLE: return "o-time-study--idle";
        case TIME_STUDY_PATH.LIGHT: return "o-time-study--light";
        case TIME_STUDY_PATH.DARK: return "o-time-study--dark";
        default: return "o-time-study--normal";
      }
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

      this.showSTCost = !canBeBought && Achievement(151).isUnlocked &&
                        this.study.config.requirementV !== undefined &&
                        this.study.config.requirementV() &&
                        this.study.STCost !== undefined;
    },
  },
  template:
    `<time-study :setup="setup" :showCost="showCost" :class="classObject" :showSTCost="showSTCost">
      <hint-text type="studies" class="l-hint-text--time-study">{{hintText}}</hint-text>
      <description-display :config="study.config" />
      <effect-display br :config="study.config" />
    </time-study>`
});
