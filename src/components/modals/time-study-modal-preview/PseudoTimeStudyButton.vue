<script>
import { ForceBoughtState } from "./StudyStringPreview";

export default {
  name: "PseudoTimeStudyButton",
  props: {
    setup: {
      type: Object,
      required: true
    },
    forceIsBought: {
      type: Number,
      default: 1
    },
    isNewFromImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isUseless: false,
      doomedRealityStudy: false,
      isBought: false,
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    styleObject() {
      return {
        top: `${this.setup.top}rem`,
        left: `${this.setup.left}rem`
      };
    },
    classObject() {
      return {
        "o-pseudo-time-study": true,
        "l-time-study": true,
        "c-pelle-useless": this.isUseless,
        "c-pelle-useless--bought": this.isUseless && this.isBought,
        "c-pelle-useless--unavailable": this.isUseless && !this.isBought,
        "o-pseudo-time-study--small": this.setup.isSmall,
        "o-time-study--unavailable": !this.isBought && !this.isUseless,
        "o-time-study--bought": this.isBought && !this.isUseless,
        "o-time-study--new-import": this.isNewFromImport && !this.isBought
      };
    },
    pathClass() {
      switch (this.study.type) {
        case TIME_STUDY_TYPE.NORMAL:
          switch (this.setup.path) {
            case TIME_STUDY_PATH.ANTIMATTER_DIM: return "o-time-study-antimatter-dim";
            case TIME_STUDY_PATH.INFINITY_DIM: return "o-time-study-infinity-dim";
            case TIME_STUDY_PATH.TIME_DIM: return "o-time-study-time-dim";
            case TIME_STUDY_PATH.ACTIVE: return "o-time-study-active";
            case TIME_STUDY_PATH.PASSIVE: return "o-time-study-passive";
            case TIME_STUDY_PATH.IDLE: return "o-time-study-idle";
            case TIME_STUDY_PATH.LIGHT: return "o-time-study-light";
            case TIME_STUDY_PATH.DARK: return "o-time-study-dark";
            default: return "o-time-study-normal";
          }
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE:
          return "o-time-study-eternity-challenge";
        case TIME_STUDY_TYPE.DILATION:
          if (this.study.id === 6) return "o-time-study-reality";
          return "o-time-study-dilation";
        case TIME_STUDY_TYPE.TRIAD:
          return "o-time-study-triad";
      }
      return "";
    },
    studyClass() {
      if (this.isUseless) return "";
      return `${this.pathClass}--${this.isBought ? "bought" : "unavailable"}`;
    },
    studyString() {
      switch (this.study.type) {
        case TIME_STUDY_TYPE.NORMAL: case TIME_STUDY_TYPE.TRIAD: return `${this.study.id}`;
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE: return `EC${this.study.id}`;
      }
      return "";
    }
  },
  methods: {
    update() {
      const study = this.study;
      this.isUseless = Pelle.uselessTimeStudies.includes(this.study.id) && Pelle.isDoomed;
      this.isBought = ForceBoughtState.getState(this.forceIsBought, study.isBought);
      this.doomedRealityStudy = study.type === TIME_STUDY_TYPE.DILATION && study.id === 6 && Pelle.isDoomed;
    },
  }
};
</script>

<template>
  <button
    :class="[classObject, studyClass]"
    :style="styleObject"
  >
    {{ studyString }}
  </button>
</template>

<style scoped>
.o-pseudo-time-study {
  width: 2.7rem;
  height: 1.5rem;
  font-family: Typewriter, serif;
  font-size: 0.85rem;
  color: black;
  border: 0.15rem solid;
  border-radius: var(--var-border-radius, 0.2rem);
  padding: 0;
  transition-duration: 0.2s;
  pointer-events: none;
}

.o-pseudo-time-study--small {
  width: 1.8rem;
}

.o-time-study-dark--bought {
  color: white;
}


.o-time-study--new-import::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 214, 11, 0.8);
  border-radius: var(--var-border-radius, inherit);
  animation: a-new-import 3s infinite;
}

@keyframes a-new-import {
  0% { opacity: 0; }
  50% { opacity: 0.7; }
  100% { opacity: 0; }
}
</style>
