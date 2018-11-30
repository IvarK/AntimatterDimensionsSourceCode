Vue.component("time-study-connection", {
  mixins: [remMixin],
  data: function() {
    return {
      isOverridden: false,
    };
  },
  props: {
    setup: Object
  },
  methods: {
    update() {
      this.isOverridden = this.setup.connection.isOverridden;
    }
  },
  template:
    `<line
      v-if="!isOverridden"
      :x1="rem(setup.x1)"
      :y1="rem(setup.y1)"
      :x2="rem(setup.x2)"
      :y2="rem(setup.y2)"
      class="o-time-study-connection"
    />`
});

class TimeStudyConnectionSetup {
  constructor(connection) {
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  get from() {
    return this._connection.from;
  }

  get to() {
    return this._connection.to;
  }

  /**
   * @param {TimeStudySetup[]} studies
   */
  setPosition(studies) {
    const from = studies.find(study => study.study === this.from);
    const to = studies.find(study => study.study === this.to);
    this.x1 = from.left + from.width / 2;
    this.y1 = from.top + from.height / 2;
    this.x2 = to.left + to.width / 2;
    this.y2 = to.top + to.height / 2;
  }
}