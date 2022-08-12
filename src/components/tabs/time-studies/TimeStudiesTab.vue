<script>
import { STUDY_TREE_LAYOUT_TYPE, TimeStudyTreeLayout } from "./time-study-tree-layout";

import DilationTimeStudy from "./DilationTimeStudy";
import ECTimeStudy from "./ECTimeStudy";
import NormalTimeStudy from "./NormalTimeStudy";
import PrimaryButton from "@/components/PrimaryButton";
import SecretTimeStudy from "./SecretTimeStudy";
import SecretTimeStudyConnection from "./SecretTimeStudyConnection";
import TimeStudyConnection from "./TimeStudyConnection";
import TriadTimeStudy from "./TriadTimeStudy";

export default {
  name: "TimeStudiesTab",
  components: {
    PrimaryButton,
    NormalTimeStudy,
    ECTimeStudy,
    DilationTimeStudy,
    TriadTimeStudy,
    SecretTimeStudy,
    TimeStudyConnection,
    SecretTimeStudyConnection
  },
  data() {
    return {
      respec: player.respec,
      layoutType: STUDY_TREE_LAYOUT_TYPE.NORMAL,
      vLevel: 0,
      renderedStudyCount: 0,
      renderedConnectionCount: 0,
    };
  },
  computed: {
    layout() {
      return TimeStudyTreeLayout.create(this.layoutType);
    },
    allStudies() {
      return this.layout.studies;
    },
    studies() {
      return this.allStudies.slice(0, this.renderedStudyCount);
    },
    allConnections() {
      return this.layout.connections;
    },
    connections() {
      return this.allConnections.slice(0, this.renderedConnectionCount);
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
    respec(newValue) {
      player.respec = newValue;
    },
    vLevel() {
      // When vLevel changes, we recompute the study tree because of triad studies
      this.$recompute("layout");
    }
  },
  created() {
    const incrementRenderedCount = () => {
      let shouldRequestNextFrame = false;
      if (this.renderedStudyCount < this.allStudies.length) {
        this.renderedStudyCount += 2;
        shouldRequestNextFrame = true;
      }
      if (this.renderedConnectionCount < this.allConnections.length) {
        this.renderedConnectionCount += 2;
        shouldRequestNextFrame = true;
      }
      if (shouldRequestNextFrame) {
        this.renderAnimationId = requestAnimationFrame(incrementRenderedCount);
      }
    };
    incrementRenderedCount();

    // Scroll to top because time studies tab is rendered progressively
    // and we don't want the player to see empty space while it's loading.
    document.body.scrollTop = 0;
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      this.respec = player.respec;
      this.layoutType = STUDY_TREE_LAYOUT_TYPE.current;
      this.vLevel = Ra.pets.v.level;
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
    exportStudyTree() {
      if (player.timestudy.studies.length === 0) {
        GameUI.notify.error("You cannot export an empty Time Study Tree!");
      } else {
        copyToClipboard(GameCache.currentStudyTree.value.exportString);
        GameUI.notify.info("Exported current Time Studies to your clipboard");
      }
    }
  }
};
</script>

<template>
  <div class="l-time-studies-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="exportStudyTree"
      >
        Export tree
      </PrimaryButton>
      <PrimaryButton
        :class="respecClassObject"
        @click="respec = !respec"
      >
        Respec Time Studies on next Eternity
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        onclick="Modal.studyString.show({ id: -1 })"
      >
        Import tree
      </PrimaryButton>
    </div>
    <div
      class="l-time-study-tree l-time-studies-tab__tree"
      :style="treeStyleObject"
    >
      <component
        :is="studyComponent(setup.study)"
        v-for="(setup) in studies"
        :key="setup.study.type.toString() + setup.study.id.toString()"
        :setup="setup"
      />
      <SecretTimeStudy :setup="layout.secretStudy" />
      <svg
        :style="treeStyleObject"
        class="l-time-study-connection"
      >
        <TimeStudyConnection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :setup="setup"
        />
        <SecretTimeStudyConnection :setup="layout.secretStudyConnection" />
      </svg>
    </div>
  </div>
</template>

<style scoped>

</style>
