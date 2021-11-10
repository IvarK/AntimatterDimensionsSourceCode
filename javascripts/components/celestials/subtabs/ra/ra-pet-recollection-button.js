Vue.component("ra-pet-recollection-button", {
  props: {
    petConfig: Object,
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      hasRecollection: false,
    };
  },
  computed: {
    petStyle() {
      return {
        backgroundColor: this.hasRecollection ? this.petConfig.pet.color : "#555",
        cursor: this.hasRecollection ? "" : "pointer",
        "pointer-events": this.hasRecollection ? "none" : "",
        "box-shadow": this.hasRecollection ? "0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.7)" : "",
        "border-color": this.hasRecollection ? "black" : ""
      };
    }
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.hasRecollection = pet.hasRecollection;
    },
    turnOnRecollection() {
      Ra.petWithRecollection = this.petConfig.pet.name;
    }
  },
  template: `
    <button
      class="c-ra-pet-recollection-button"
      v-if="isUnlocked"
      :style="petStyle"
      @click="turnOnRecollection"
    >
      <span v-if="hasRecollection">
        Recollection given to {{ name }}
      </span>
      <span v-else>
        Give Recollection to {{ name }}
      </span>
    </button>
  `
});
