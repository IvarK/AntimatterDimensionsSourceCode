<script>
export default {
  name: "RaUpgradeIcon",
  props: {
    unlock: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      description: "",
    };
  },
  computed: {
    petName() {
      return this.unlock.pet.name;
    },
    icon() {
      return this.unlock.displayIcon;
    },
    classObject() {
      return {
        "c-ra-upgrade-icon": true,
        "c-ra-upgrade-icon--inactive": !this.isUnlocked,
        "c-ra-upgrade-icon--teresa": this.petName === "Teresa",
        "c-ra-upgrade-icon--effarig": this.petName === "Effarig",
        "c-ra-upgrade-icon--enslaved": this.petName === "Enslaved",
        "c-ra-upgrade-icon--v": this.petName === "V"
      };
    },
    isUseless() {
      return this.unlock.disabledByPelle;
    }
  },
  methods: {
    update() {
      const unlock = this.unlock;
      this.isUnlocked = unlock.isUnlocked;
      this.level = unlock.level;
      this.description = unlock.reward;
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <div
      v-html="icon"
    />
    <div class="c-ra-pet-upgrade__tooltip">
      <div class="c-ra-pet-upgrade__tooltip__name">
        {{ petName }} Level {{ formatInt(level) }}
      </div>
      <div
        class="c-ra-pet-upgrade__tooltip__description"
        :style="{ textDecoration: isUseless ? 'line-through' : null }"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-ra-upgrade-icon {
  font-weight: bold;
}
</style>
