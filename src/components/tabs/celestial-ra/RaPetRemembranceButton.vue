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
      hasRemembrance: false,
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    name() {
      return this.pet.name;
    },
    petStyle() {
      return {
        backgroundColor: this.hasRemembrance ? this.pet.color : "#555",
        "box-shadow": this.hasRemembrance ? "0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.7)" : "",
        "border-color": this.hasRemembrance ? "black" : ""
      };
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.hasRemembrance = pet.hasRemembrance;
    },
    toggleRemembrance() {
      Ra.petWithRemembrance = Ra.petWithRemembrance === this.pet.name ? "" : this.pet.name;
    }
  },
};
</script>

<template>
  <button
    v-if="isUnlocked"
    class="c-ra-pet-remembrance-button"
    :style="petStyle"
    @click="toggleRemembrance"
  >
    <span v-if="hasRemembrance">
      Remembrance given to {{ name }}
    </span>
    <span v-else>
      Give Remembrance to {{ name }}
    </span>
  </button>
</template>
