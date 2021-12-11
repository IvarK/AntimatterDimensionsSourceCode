import PrimaryButton from "@/components/PrimaryButton";

Vue.component("replicanti-galaxy-button", {
  components: {
    PrimaryButton
  },
  data() {
    return {
      isAvailable: false,
      isAutoUnlocked: false,
      isAutoActive: false,
      isAutoEnabled: false,
      isDivideUnlocked: false,
      boughtGalaxies: 0,
      extraGalaxies: 0
    };
  },
  computed: {
    resetActionDisplay() {
      return this.isDivideUnlocked
        ? `Divide Replicanti by ${format(Number.MAX_VALUE, 1, 1)}`
        : "Reset Replicanti amount";
    },
    galaxyCountDisplay() {
      const bought = this.boughtGalaxies;
      const extra = this.extraGalaxies;
      const galaxyCount = extra > 0 ? `${formatInt(bought)}+${formatInt(extra)}` : formatInt(bought);
      return `Currently: ${galaxyCount}`;
    },
    autobuyer() {
      return Autobuyer.replicantiGalaxy;
    },
    autobuyerTextDisplay() {
      const auto = this.isAutoActive;
      const disabled = !this.isAutoEnabled;
      return `Auto Galaxy ${auto ? "ON" : "OFF"}${disabled ? " (disabled)" : ""}`;
    },
  },
  methods: {
    update() {
      const rg = Replicanti.galaxies;
      this.isAvailable = rg.canBuyMore;
      this.boughtGalaxies = rg.bought;
      this.extraGalaxies = rg.extra;
      this.isDivideUnlocked = Achievement(126).isUnlocked;
      const auto = Autobuyer.replicantiGalaxy;
      this.isAutoUnlocked = auto.isUnlocked;
      this.isAutoActive = auto.isActive;
      this.isAutoEnabled = auto.isEnabled;
    },
    handleAutoToggle(value) {
      Autobuyer.replicantiGalaxy.isActive = value;
      this.update();
    },
    handleClick() {
      if (!this.isAvailable) return;
      if (player.options.confirmations.replicantiGalaxy) Modal.replicantiGalaxy.show();
      else replicantiGalaxy();
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <PrimaryButton
        :enabled="isAvailable"
        class="o-primary-btn--replicanti-galaxy"
        @click="handleClick"
      >
        {{ resetActionDisplay }} for a Replicanti Galaxy
        <br>
        {{ galaxyCountDisplay }}
      </PrimaryButton>
      <primary-button-on-off-custom
        v-if="isAutoUnlocked"
        :value="isAutoActive"
        :on="autobuyerTextDisplay"
        :off="autobuyerTextDisplay"
        class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-galaxy-toggle"
        @input="handleAutoToggle"
      />
    </div>`
});
