Vue.component("ra-upgrade-icon", {
  props: {
    unlock: Object,
  },
  data() {
    return {
      isUseless: false,
      isUnlocked: false,
      level: 0,
      icon: "",
      description: "",
      petName: ""
    };
  },
  computed: {
    update() {
      this.isUseless = Pelle.uselessRaMilestones.includes(this.unlock.id) && Pelle.isDoomed;
      this.isUnlocked = Ra.has(this.unlock);
      this.level = this.unlock.level;
      this.icon = this.unlock.displayIcon;
      const rewardText = typeof this.unlock.reward === "function"
        ? this.unlock.reward()
        : this.unlock.reward;
      this.description = rewardText;
      this.petName = this.unlock.pet.name;
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
    }
  },
  template: `
    <div :class="classObject">
      <div v-html="icon" style="font-weight: bold;"></div>
      <div class="c-ra-pet-upgrade__tooltip">
        <div class="c-ra-pet-upgrade__tooltip__name">
          {{ petName }} Level {{ formatInt(level) }}
        </div>
        <div class="c-ra-pet-upgrade__tooltip__description">
          <span v-if="isUseless">
            This has no effect while in Doomed
          </span>
          <span v-else>
            {{ description }}
          </span>
        </div>
      </div>
    </div>`
});
