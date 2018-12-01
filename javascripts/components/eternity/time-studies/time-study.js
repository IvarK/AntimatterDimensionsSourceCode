Vue.component("time-study", {
  mixins: [remMixin],
  data: function() {
    return {
      isBought: false,
      isAvailable: false
    };
  },
  props: {
    setup: Object,
    showCost: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    styleObject: function() {
      return {
        top: this.rem(this.setup.top),
        left: this.rem(this.setup.left)
      };
    },
    classObject: function() {
      return {
        "o-time-study": true,
        "o-time-study--unavailable": !this.isAvailable,
        "o-time-study--bought": this.isBought,
        "o-time-study--small": this.setup.isSmall,
        "l-time-study": true
      };
    }
  },
  methods: {
    update() {
      const study = this.setup.study;
      this.isBought = study.isBought;
      this.isAvailable = study.canBeBought && study.isAffordable;
    },
    handleClick() {
      this.$emit("purchase");
    }
  },
  template:
    `<button :class="classObject" :style="styleObject" @click="handleClick">
      <slot />
      <template v-if="showCost">
        <br>
        Cost: {{setup.study.cost}} {{ "Time Theorem" | pluralize(setup.study.cost) }}
      </template>
    </button>`
});

class TimeStudySetup {
  constructor(props) {
    this._getStudy = () => props.study;
    this.row = props.row;
    this.column = props.column;
  }

  // To prevent Vue reactification of study
  get study() {
    return this._getStudy();
  }

  get isSmall() {
    return this.row === 23;
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