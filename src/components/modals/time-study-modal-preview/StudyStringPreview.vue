<script>
import PseudoTimeStudyButton from "./PseudoTimeStudyButton";
import PseudoTimeStudyConnection from "./PseudoTimeStudyConnection";

import { STUDY_TREE_LAYOUT_TYPE, TimeStudyTreeLayout } from "@/components/tabs/time-studies/time-study-tree-layout";

export default {
  name: "TimeStudiesTab",
  components: {
    PseudoTimeStudyButton,
    PseudoTimeStudyConnection,
  },
  props: {
    treeStatus: {
      type: [Object, Boolean],
      required: true
    },
    showPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      layoutType: STUDY_TREE_LAYOUT_TYPE.NORMAL,
      vLevel: 0,
      renderedStudyCount: 0,
      isEnslaved: false,
      delayTimer: 0,
    };
  },
  computed: {
    layout() {
      return TimeStudyTreeLayout.create(this.layoutType, 0.15);
    },
    allStudies() {
      return this.layout.studies;
    },
    studies() {
      return this.allStudies;
    },
    connections() {
      return this.layout.connections;
    },
    treeStyleObject() {
      return {
        width: `${this.layout.width}rem`,
        height: `${this.layout.height}rem`
      };
    },
    respecClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--respec-active": this.respec
      };
    }
  },
  watch: {
    vLevel() {
      // When vLevel changes, we recompute the study tree because of triad studies
      this.$recompute("layout");
    }
  },
  methods: {
    update() {
      this.layoutType = STUDY_TREE_LAYOUT_TYPE.current;
      this.vLevel = Ra.pets.v.level;
      this.isEnslaved = Enslaved.isRunning || Date.now() - this.delayTimer < 1000;
    },
    studyComponent(study) {
      switch (study.type) {
        case TIME_STUDY_TYPE.NORMAL: return NormalTimeStudy;
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE: return ECTimeStudy;
        case TIME_STUDY_TYPE.DILATION: return DilationTimeStudy;
        case TIME_STUDY_TYPE.TRIAD: return TriadTimeStudy;
      }
      throw "Unknown Time Study type";
    },
    studyString(study) {
      switch (study.type) {
        case TIME_STUDY_TYPE.NORMAL: case TIME_STUDY_TYPE.TRIAD: return `${study.id}`;
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE: return `EC${study.id}`;
      }
      return "Dilation Study";
    }
  }
};
</script>

<template>
  <div class="l-study-string-preview__tree--wrapper">
    <div
      v-if="showPreview"
      class="l-time-study-tree l-study-string-preview__tree"
      :style="treeStyleObject"
    >
      <PseudoTimeStudyButton
        v-for="(setup) in studies"
        :key="setup.study.type.toString() + setup.study.id.toString()"
        :setup="setup"
        :is-new-from-import="treeStatus.newStudies.includes(studyString(setup.study))"
      />
      <svg
        :style="treeStyleObject"
        class="l-time-study-connection"
      >
        <PseudoTimeStudyConnection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :setup="setup"
        />
      </svg>
    </div>
    <span
      v-else
      class="c-unavailable-warning"
    >
      Preview Unavailable
    </span>
  </div>
</template>

<style scoped>
.l-study-string-preview__tree--wrapper {
  display: flex;
  overflow-y: auto;
  width: 30rem;
  height: 15rem;
  position: relative;
  justify-content: center;
  border: var(--color-text) solid var(--var-border-width, 0.3rem);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: auto;
}

.c-unavailable-warning {
  align-self: center;
}
</style>
