<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PreferredTreeModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      dimensionPath: null,
      pacePath: null
    };
  },
  computed: {
    dimensionOptions() {
      return {
        "Antimatter": TIME_STUDY_PATH.ANTIMATTER_DIM,
        "Infinity": TIME_STUDY_PATH.INFINITY_DIM,
        "Time": TIME_STUDY_PATH.TIME_DIM,
      };
    },
    paceOptions() {
      return {
        "Active": TIME_STUDY_PATH.ACTIVE,
        "Passive": TIME_STUDY_PATH.PASSIVE,
        "Idle": TIME_STUDY_PATH.IDLE
      };
    },
    usePriority() {
      return TimeStudy.preferredPaths.dimension.usePriority;
    }
  },
  created() {
    this.dimensionPath = [...TimeStudy.preferredPaths.dimension.path];
    this.pacePath = TimeStudy.preferredPaths.pace.path;
  },
  methods: {
    isPreferred(name) {
      return this.paceOptions[name] === this.pacePath || this.dimensionPath.indexOf(this.dimensionOptions[name]) + 1;
    },
    select(name) {
      if (this.dimensionOptions[name]) {
        if (!this.usePriority || this.dimensionPath.length > 1) this.dimensionPath.shift();
        if (!this.dimensionPath.includes(this.dimensionOptions[name]))
          this.dimensionPath.push(this.dimensionOptions[name]);
      }
      if (this.paceOptions[name]) this.pacePath = this.paceOptions[name];
    },
    confirmPrefs() {
      TimeStudy.preferredPaths.dimension.path = this.dimensionPath;
      TimeStudy.preferredPaths.pace.path = this.pacePath;
    },
    classList(name) {
      const pref = this.isPreferred(name);
      const types = {
        "Antimatter": "antimatter-dim",
        "Infinity": "infinity-dim",
        "Time": "time-dim",
        "Active": "active",
        "Passive": "passive",
        "Idle": "idle"
      };
      return [
        "o-time-study-selection-btn",
        `o-time-study-${types[name]}--${pref ? "bought" : "available"}`,
        `o-time-study--${pref ? "bought" : "available"}`
      ];
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirmPrefs">
    <h2>Dimension Split Preference</h2>
    <div class="l-modal-split-preferences">
      <button
        v-for="(id, name) in dimensionOptions"
        :key="name"
        :class="classList(name)"
        @click="select(name)"
      >
        <div
          v-if="isPreferred(name)"
          class="l-dim-path-priority o-dim-path-priority"
        >
          {{ isPreferred(name) }}
        </div>
        <div>
          {{ name }}
        </div>
      </button>
    </div>
    <br>
    <h2>Pace Split Preference</h2>
    <div class="l-modal-split-preferences">
      <button
        v-for="(id, name) in paceOptions"
        :key="name"
        :class="classList(name)"
        @click="select(name)"
      >
        <div>
          {{ name }}
        </div>
      </button>
    </div>
  </ModalWrapperChoice>
</template>
