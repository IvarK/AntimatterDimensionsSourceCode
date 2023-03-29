<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "PerkPointLabel",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      pp: 0,
      treeLayout: 0,
      physicsEnabled: false,
    };
  },
  computed: {
    layoutText() {
      return PerkLayouts[this.treeLayout].buttonText;
    }
  },
  watch: {
    physicsEnabled(newValue) {
      player.options.perkPhysicsEnabled = newValue;
      PerkNetwork.setPhysics(newValue);
    },
  },
  created() {
    this.treeLayout = player.options.perkLayout;
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    },
    centerTree() {
      PerkNetwork.resetPosition(true);
    },
    straightenEdges() {
      PerkNetwork.setEdgeCurve(false);
      PerkNetwork.setEdgeCurve(true);
    },
    cycleLayout() {
      player.options.perkLayout = (player.options.perkLayout + 1) % PerkLayouts.length;
      this.treeLayout = player.options.perkLayout;
      PerkNetwork.currentLayout = PerkLayouts[this.treeLayout];
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
      PerkNetwork.moveToDefaultLayoutPositions(this.treeLayout);
    }
  }
};
</script>

<template>
  <div class="c-perk-tab__header">
    You have <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span> {{ pluralize("Perk Point", pp) }}.
    <br>
    Perk choices are permanent and cannot be respecced.
    <br>
    Diamond-shaped perks also give Automator Points.
    <br>
    <div class="perk-settings">
      <PrimaryButton
        class="o-primary-btn"
        label="Starting tree layout:"
        @click="cycleLayout"
      >
        Perk Layout: {{ layoutText }}
      </PrimaryButton>
      <PrimaryToggleButton
        v-model="physicsEnabled"
        class="o-primary-btn"
        label="Physics:"
        on="Enabled"
        off="Disabled"
      />
      <PrimaryButton
        class="o-primary-btn"
        @click="centerTree"
      >
        Center Tree on START
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn"
        @click="straightenEdges"
      >
        Straighten Edges
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.perk-settings > button {
  margin-right: 1rem;
}
</style>
