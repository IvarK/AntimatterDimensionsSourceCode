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
        "o-time-study--unavailable": !this.isAvailableForPurchase && !this.isBought,
        "o-time-study--bought": this.isBought,
        "o-time-study--small": this.setup.isSmall,
        "l-time-study": true
      };
    },
    config() {
      return this.study.config;
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
    },
  },
  template:
    `<button :class="classObject"
             :style="styleObject"
             @click.exact="handleClick"
             @click.shift.exact="shiftClick">
      <slot />
      <cost-display br
        v-if="showCost && !showSTCost"
        :config="config"
        singular="Time Theorem"
        plural="Time Theorems"
      />
      <div v-else-if="showSTCost">
        Cost: {{ shorten(STCost) }} {{ "Space Theorem" | pluralize(STCost, "Space Theorems")}}
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
