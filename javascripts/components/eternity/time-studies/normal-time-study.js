"use strict";

Vue.component("normal-time-study", {
  props: {
    setup: Object
  },
  data: () => ({
    showCost: true,
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
        case TimeStudyPath.NORMAL_DIM: return "o-time-study--normal-dim";
        case TimeStudyPath.INFINITY_DIM: return "o-time-study--infinity-dim";
        case TimeStudyPath.TIME_DIM: return "o-time-study--time-dim";
        case TimeStudyPath.ACTIVE: return "o-time-study--active";
        case TimeStudyPath.PASSIVE: return "o-time-study--passive";
        case TimeStudyPath.IDLE: return "o-time-study--idle";
        case TimeStudyPath.LIGHT: return "o-time-study--light";
        case TimeStudyPath.DARK: return "o-time-study--dark";
        default: return "o-time-study--normal";
      }
    },
    hintText() {
      const id = this.study.id;
      switch (this.setup.path) {
        case TimeStudyPath.NORMAL_DIM: return id + " Normal Dims";
        case TimeStudyPath.INFINITY_DIM: return id + " Infinity Dims";
        case TimeStudyPath.TIME_DIM: return id + " Time Dims";
        case TimeStudyPath.ACTIVE: return id + " Active";
        case TimeStudyPath.PASSIVE: return id + " Passive";
        case TimeStudyPath.IDLE: return id + " Idle";
        case TimeStudyPath.LIGHT: return id + " Light";
        case TimeStudyPath.DARK: return id + " Dark";
      }
      return id;
    }
  },
  methods: {
    update() {
      this.showCost = this.study.id !== 192 || !Enslaved.isRunning;
    },
  },
  template:
    `<time-study :setup="setup" :showCost="showCost" :class="classObject"">
      <hint-text class="l-hint-text--time-study">{{hintText}}</hint-text>
      <description-display :config="study.config" />
      <effect-display br :config="study.config" />
    </time-study>`
});