<script>
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "TimeStudyButton",
  components: {
    CostDisplay
  },
  props: {
    setup: {
      type: Object,
      required: true
    },
    showCost: {
      type: Boolean,
      required: false,
      default: true
    },
    showStCost: {
      type: Boolean,
      required: false,
      default: false
    },
    specialClick: {
      type: Function,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      isUseless: false,
      isBought: false,
      isAvailableForPurchase: false,
      STCost: 0,
      eternityChallengeRunning: false,
      isCompleteEC: false,
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
        "o-time-study": !this.isUseless,
        "l-time-study": true,
        "c-pelle-useless": this.isUseless,
        "c-pelle-useless--bought": this.isUseless && this.isBought,
        "c-pelle-useless--unavailable": this.isUseless && !this.isAvailableForPurchase && !this.isBought,
        "c-pelle-useless-available": this.isUseless && !this.isAvailableForPurchase && !this.isBought,
        "o-time-study--small": this.setup.isSmall,
        "o-time-study--unavailable": !this.isAvailableForPurchase && !this.isBought && !this.isUseless,
        "o-time-study--available": this.isAvailableForPurchase && !this.isBought,
        "o-time-study--bought": this.isBought && !this.isUseless,
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
      let pathClasses = "";
      if (!this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--unavailable`;
      }
      if (this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--available`;
      }
      if (this.isBought) {
        pathClasses += `${this.pathClass}--bought`;
      }
      if (this.isCompleteEC) {
        pathClasses += ` ${this.pathClass}--complete`;
      }
      return pathClasses;
    },
    eternityChallengeAnim() {
      return this.eternityChallengeRunning ? "o-time-study-eternity-challenge--running" : "";
    },
    config() {
      return { ...this.study.config, formatCost: value => (value >= 1e6 ? format(value) : formatInt(value)) };
    },
    showDefaultCostDisplay() {
      const costCond = (this.showCost && !this.showStCost) || this.STCost === 0;
      return !this.setup.isSmall && !this.doomedRealityStudy && costCond;
    },
    customCostStr() {
      const ttStr = this.setup.isSmall
        ? `${formatInt(this.config.cost)} TT`
        : quantifyInt("Time Theorem", this.config.cost);
      const stStr = this.setup.isSmall
        ? `${formatInt(this.STCost)} ST`
        : quantifyInt("Space Theorem", this.STCost);

      const costs = [];
      if (this.config.cost) costs.push(ttStr);
      if (this.STCost && this.showStCost) costs.push(stStr);
      return costs.join(" + ");
    },
    doomedRealityStudy() {
      return this.study.type === TIME_STUDY_TYPE.DILATION && this.study.id === 6 && Pelle.isDoomed;
    }
  },
  methods: {
    update() {
      const study = this.study;
      this.isUseless = Pelle.uselessTimeStudies.includes(this.study.id) && Pelle.isDoomed;
      this.isBought = study.isBought;
      this.eternityChallengeRunning = study.type === TIME_STUDY_TYPE.ETERNITY_CHALLENGE &&
        EternityChallenge.current?.id === study.id;
      if (!this.isBought) {
        this.isAvailableForPurchase = study.canBeBought && study.isAffordable;
      }
      this.STCost = this.study.STCost;
      this.isCompleteEC = this.study.type === TIME_STUDY_TYPE.ETERNITY_CHALLENGE &&
        EternityChallenge(this.study.id).remainingCompletions === 0;
    },
    handleClick() {
      if (this.specialClick === null || !this.study.isBought) this.study.purchase();
      else this.specialClick();
    },
    shiftClick() {
      if (this.study.purchaseUntil) this.study.purchaseUntil();
    }
  }
};

export class TimeStudySetup {
  constructor(props) {
    this.study = props.study;
    this.row = props.row;
    this.column = props.column;
  }

  setPosition(layout) {
    this.top = layout.itemPosition(this.row);
    const row = layout.rows[this.row];
    this.left = row.itemPosition(this.column, layout);
    this.width = row.layout.itemWidth;
    this.height = row.layout.itemHeight;
  }

  get path() {
    return this.study.path;
  }
}
</script>

<template>
  <button
    :class="[classObject, studyClass, eternityChallengeAnim]"
    :style="styleObject"
    @click.exact="handleClick"
    @click.shift.exact="shiftClick"
  >
    <slot />
    <CostDisplay
      v-if="showDefaultCostDisplay"
      br
      :config="config"
      name="Time Theorem"
    />
    <div v-else-if="!doomedRealityStudy">
      Cost: {{ customCostStr }}
    </div>
  </button>
</template>

<style scoped>

</style>
