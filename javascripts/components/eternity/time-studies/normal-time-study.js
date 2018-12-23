Vue.component("normal-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      description: String.empty,
      effectValue: new Decimal(0)
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    hasEffectDisplay() {
      return this.study.hasDynamicEffect;
    },
    effectDisplay() {
      return this.study.formatEffect(this.effectValue);
    },
    classObject() {
      const classObject = {
        "o-time-study--normal": true
      };
      let pathClass;
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
      if (pathClass !== undefined) {
        classObject[pathClass] = true;
      }
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
  created() {
    const study = this.study;
    this.description = study.description;
    if (study.hasDynamicDescription) {
      this.on$(GameEvent.UPDATE, () => this.description = study.description);
    }
    if (this.hasEffectDisplay) {
      this.on$(GameEvent.UPDATE, () => this.effectValue.copyFrom(new Decimal(study.effectValue)));
    }
  },
  methods: {
    purchase() {
      this.study.purchase();
    }
  },
  template:
    `<time-study :setup="setup" :class="classObject" @purchase="purchase">
      <hint-text class="l-hint-text--time-study">{{hintText}}</hint-text>
      {{description}}
      <template v-if="hasEffectDisplay">
        <br>
        <span>Currently: {{effectDisplay}}</span>
      </template>
    </time-study>`
});