<script>
export default {
  props: {
    petId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      pet: Ra.pets.all[this.petId],
      isUnlocked: Boolean,
      chunkGain: String,
    };
  },
  computed: {
    name() {
      return this.pet.name;
    },
    color() {
      return `color: ${this.pet.color}`;
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      this.chunkGain = pet.chunkGain;
    }
  },
};
</script>

<template>
  <span
    v-if="isUnlocked"
    :style="color"
  >
    {{ name }} gains Memory Chunks based on {{ chunkGain }}.
    <br>
  </span>
</template>
