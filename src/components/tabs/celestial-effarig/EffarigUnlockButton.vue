<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";

export default {
  name: "EffarigUnlockButton",
  components: {
    DescriptionDisplay,
    CostDisplay
  },
  props: {
    unlock: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isAvailable: false
    };
  },
  computed: {
    config() {
      return this.unlock.config;
    },
    classObject() {
      return {
        "c-effarig-shop-button": true,
        "c-effarig-shop-button--bought": this.isBought,
        "c-effarig-shop-button--available": this.isAvailable && !this.isBought
      };
    }
  },
  methods: {
    update() {
      this.isBought = this.unlock.isUnlocked;
      this.isAvailable = Currency.relicShards.gte(this.unlock.cost);
    },
    purchase() {
      this.unlock.purchase();
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="purchase"
  >
    <DescriptionDisplay :config="config" />
    <CostDisplay
      v-if="!isBought"
      :config="config"
      name="Relic Shard"
      label=""
    />
    <div v-else>
      (Unlocked)
    </div>
  </button>
</template>