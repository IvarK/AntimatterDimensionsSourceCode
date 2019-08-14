Vue.component("normal-time-study", {
  props: {
    setup: Object
  },
  computed: {
    study() {
      return this.setup.study;
    },
    classObject() {
      const classObject = {};
      let pathClass = "o-time-study--normal";
      switch (this.setup.path) {
        case TimeStudyPath.NORMAL_DIM: pathClass = "o-time-study--normal-dim"; break;
        case TimeStudyPath.INFINITY_DIM: pathClass = "o-time-study--infinity-dim"; break;
        case TimeStudyPath.TIME_DIM: pathClass = "o-time-study--time-dim"; break;
        case TimeStudyPath.ACTIVE: pathClass = "o-time-study--active"; break;
        case TimeStudyPath.PASSIVE: pathClass = "o-time-study--passive"; break;
        case TimeStudyPath.IDLE: pathClass = "o-time-study--idle"; break;
        case TimeStudyPath.LIGHT: pathClass = "o-time-study--light"; break;
        case TimeStudyPath.DARK: pathClass = "o-time-study--dark"; break;
      }
      classObject[pathClass] = true;
      return classObject;
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
  template:
    `<time-study :setup="setup" :class="classObject"">
      <hint-text class="l-hint-text--time-study">{{hintText}}</hint-text>
      <description-display :config="study.config" />
      <effect-display br :config="study.config" />
    </time-study>`
});