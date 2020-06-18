"use strict";

Vue.component("time-study", {
  mixins: [remMixin],
  data() {
    return {
      isBought: false,
      isAvailableForPurchase: false,
      STCost: 0
    };
  },
  props: {
    setup: Object,
    showCost: {
      type: Boolean,
      default: true
    },
    showSTCost: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    study() {
      return this.setup.study;
    },
    styleObject() {
      return {
        top: this.rem(this.setup.top),
        left: this.rem(this.setup.left)
      };
    },
    classObject() {
      return {
        "o-time-study": true,
        "l-time-study": true,
        "o-time-study--small": this.setup.isSmall,
        "o-time-study--unavailable": !this.isAvailableForPurchase && !this.isBought,
        "o-time-study--available": this.isAvailableForPurchase && !this.isBought,
        "o-time-study--bought": this.isBought,
      };
    },
    pathClass() {
      switch (this.study.type) {
        case TimeStudyType.NORMAL:
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
          break;
        case TimeStudyType.ETERNITY_CHALLENGE:
          return "o-time-study-eternity-challenge";
        case TimeStudyType.DILATION:
          if (this.study.id === 6) return "o-time-study-reality"
          return "o-time-study-dilation";
        case TimeStudyType.TRIAD:
          return "o-time-study-triad";
      }
    },
    studyClass() {
      let pathClasses = ""
      if (!this.isAvailableForPurchase && !this.isBought){
        pathClasses += `${this.pathClass}--unavailable`;
      }
      if (this.isAvailableForPurchase && !this.isBought){
        pathClasses += `${this.pathClass}--available`;
      }
      if (this.isBought){
        pathClasses += `${this.pathClass}--bought`;
      }
      return pathClasses;
    },
    config() {
      return {...this.study.config, formatCost: formatInt};
    }
  },
  methods: {
    update() {
      const study = this.study;
      this.isBought = study.isBought;
      if (!this.isBought) {
        this.isAvailableForPurchase = study.canBeBought && study.isAffordable;
      }

      this.STCost = this.study.STCost;
    },
    handleClick() {
      this.study.purchase();
    },
    shiftClick() {
      if (this.study.purchaseUntil) this.study.purchaseUntil();
    }
  },
  template:
    `<button :class="[classObject, studyClass]"
             :style="styleObject"
             @click.exact="handleClick"
             @click.shift.exact="shiftClick">
      <slot />
      <cost-display br
        v-if="(showCost && !showSTCost) || STCost === 0"
        :config="config"
        singular="Time Theorem"
        plural="Time Theorems"
      />
      <div v-else-if="showSTCost">
        Cost: {{ formatInt(STCost) }} {{ "Space Theorem" | pluralize(STCost, "Space Theorems")}}
        <span v-if="config.cost">
          and {{formatInt(config.cost)}} TT
        </span>
      </div>
    </button>`
});

class TimeStudySetup {
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
