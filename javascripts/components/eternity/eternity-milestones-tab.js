Vue.component("eternity-milestones-tab", {
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(data => new EternityMilestoneInfo(data));
    },
    rows() {
      return this.milestones.length / 3;
    }
  },
  methods: {
    milestone(row, column) {
      return this.milestones[(row - 1) * 3 + column - 1];
    }
  },
  template:
    `<div class="l-eternity-milestone-grid">
      <div v-for="row in rows" class="l-eternity-milestone-grid__row">
        <eternity-milestone
          v-for="column in 3"
          :key="row * 3 + column"
          :milestone="milestone(row, column)"
          class="l-eternity-milestone-grid__cell"
        />
      </div>
    </div>`
});

Vue.component("eternity-milestone", {
  props: {
    milestone: Object
  },
  data() {
    return {
      isReached: false
    };
  },
  computed: {
    eternities() {
      return this.milestone.data.eternities;
    },
    descriptionClassObject() {
      return {
        "o-eternity-milestone__description": true,
        "o-eternity-milestone__description--reached": this.isReached,
        "o-eternity-milestone__description--small-font": this.milestone.data.description.length > 80
      };
    }
  },
  methods: {
    update() {
      this.isReached = this.milestone.isReached;
    }
  },
  template:
    `<div class="l-eternity-milestone">
      <span class="o-eternity-milestone__goal">{{eternities}} {{"Eternity" | pluralize(eternities, "Eternities")}}:</span>
      <button :class="descriptionClassObject">{{milestone.data.description}}</button>
    </div>`
});