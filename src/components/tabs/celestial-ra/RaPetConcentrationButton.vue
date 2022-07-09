<script>
export default {
  name: "RaPetRemembranceButton",
  props: {
    petConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      name: "",
      hasRemembrance: false,
    };
  },
  computed: {
    petStyle() {
      return {
        backgroundColor: this.hasRemembrance ? this.petConfig.pet.color : "#555",
        cursor: this.hasRemembrance ? "" : "pointer",
        "pointer-events": this.hasRemembrance ? "none" : "",
        "box-shadow": this.hasRemembrance ? "0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.7)" : "",
        "border-color": this.hasRemembrance ? "black" : ""
      };
    }
  },
  methods: {
    update() {
      const pet = this.petConfig.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = pet.name;
      this.hasRemembrance = pet.hasRemembrance;
    },
    turnOnRemembrance() {
      Ra.petWithRemembrance = this.petConfig.pet.name;
    }
  },
};
</script>

<template>
  <button
    v-if="isUnlocked"
    class="c-ra-pet-remembrance-button"
    :style="petStyle"
    @click="turnOnRemembrance"
  >
    <span v-if="hasRemembrance">
      Remembrance given to {{ name }}
    </span>
    <span v-else>
      Concentrate on {{ name }}
    </span>
  </button>
</template>