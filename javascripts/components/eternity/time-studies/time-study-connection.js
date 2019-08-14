Vue.component("time-study-connection", {
  data: function() {
    return {
      isOverridden: false,
      isBought: false
    };
  },
  props: {
    setup: Object
  },
  computed: {
    classObject: function() {
      const classObject = {
        "o-time-study-connection": true,
        "o-time-study-connection--bought": this.isBought,
      };
      let pathClass;
      const connection = this.setup.connection;
      const from = connection.from;
      const to = connection.to;
      switch (to.type) {
        case TimeStudyType.NORMAL:
          function setPath(study) {
            switch (study.path) {
              case TimeStudyPath.NORMAL_DIM: pathClass = "o-time-study-connection--normal-dim"; break;
              case TimeStudyPath.INFINITY_DIM: pathClass = "o-time-study-connection--infinity-dim"; break;
              case TimeStudyPath.TIME_DIM: pathClass = "o-time-study-connection--time-dim"; break;
              case TimeStudyPath.ACTIVE: pathClass = "o-time-study-connection--active"; break;
              case TimeStudyPath.PASSIVE: pathClass = "o-time-study-connection--passive"; break;
              case TimeStudyPath.IDLE: pathClass = "o-time-study-connection--idle"; break;
            }
          }
          setPath(from);
          setPath(to);
          break;
        case TimeStudyType.ETERNITY_CHALLENGE:
          pathClass = "o-time-study-connection--eternity-challenge";
          break;
        case TimeStudyType.DILATION:
          pathClass = "o-time-study-connection--dilation";
          break;
      }

      if (pathClass !== undefined) {
        classObject[pathClass] = true;
      }
      return classObject;
    }
  },
  methods: {
    update() {
      this.isOverridden = this.setup.connection.isOverridden;
      this.isBought = this.setup.isBought;
    },
    percents(value) {
      return value * 100 + "%";
    }
  },
  template:
    `<line
      v-if="!isOverridden"
      :x1="percents(setup.x1)"
      :y1="percents(setup.y1)"
      :x2="percents(setup.x2)"
      :y2="percents(setup.y2)"
      :class="classObject"
    />`
});

class TimeStudyConnectionSetup {
  constructor(connection) {
    this.connection = connection;
  }

  get from() {
    return this.connection.from;
  }

  get to() {
    return this.connection.to;
  }

  /**
   * @param {TimeStudySetup[]} studies
   */
  setPosition(studies, width, height) {
    const from = studies.find(study => study.study === this.from);
    const to = studies.find(study => study.study === this.to);
    this.x1 = (from.left + from.width / 2) / width;
    this.y1 = (from.top + from.height / 2) / height;
    this.x2 = (to.left + to.width / 2) / width;
    this.y2 = (to.top + to.height / 2) / height;
  }

  get isBought() {
    return this.from.isBought && this.to.isBought;
  }
}