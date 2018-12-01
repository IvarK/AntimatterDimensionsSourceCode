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

const TimeStudyPath = {
  NONE: 0,
  NORMAL_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
};

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
    const study = this.study;
    if (!(study instanceof NormalTimeStudyInfo)) return TimeStudyPath.NONE;
    const path = TimeStudySetup.paths.find(p => p.studies.includes(study.id));
    return path !== undefined ? path.path : TimeStudyPath.NONE;
  }
}

TimeStudySetup.paths = [
  { path: TimeStudyPath.NORMAL_DIM, studies: [71, 81, 91, 101] },
  { path: TimeStudyPath.INFINITY_DIM, studies: [72, 82, 92, 102] },
  { path: TimeStudyPath.TIME_DIM, studies: [73, 83, 93, 103] },
  { path: TimeStudyPath.ACTIVE, studies: [121, 131, 141] },
  { path: TimeStudyPath.PASSIVE, studies: [122, 132, 142] },
  { path: TimeStudyPath.IDLE, studies: [123, 133, 143] },
  { path: TimeStudyPath.LIGHT, studies: [221, 223, 225, 227, 231, 233] },
  { path: TimeStudyPath.DARK, studies: [222, 224, 226, 228, 232, 234] }
];