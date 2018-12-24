Vue.component("eternity-milestone", {
  props: {
    getMilestone: Function
  },
  data() {
    return {
      isReached: false
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    eternities() {
      return this.config.eternities;
    },
    description() {
      return this.config.description;
    },
    descriptionClassObject() {
      return {
        "o-eternity-milestone__description": true,
        "o-eternity-milestone__description--reached": this.isReached,
        "o-eternity-milestone__description--small-font": this.description.length > 80
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
      <button :class="descriptionClassObject">{{description}}</button>
    </div>`
});