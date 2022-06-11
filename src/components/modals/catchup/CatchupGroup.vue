<script>
import CatchupEntry from "@/components/modals/catchup/CatchupEntry";

export default {
  name: "CatchupGroup",
  components: {
    CatchupEntry,
  },
  props: {
    group: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      collapsed: true,
    };
  },
  computed: {
    shownResources() {
      return GameDatabase.catchupResources.filter(r => r.requiredStage === this.group);
    },
    dropDownIconClass() {
      return this.collapsed ? "far fa-plus-square" : "far fa-minus-square";
    },
  }
};
</script>

<template>
  <div v-if="shownResources.length !== 0">
    <span
      class="o-catchup-group-title"
      @click="collapsed = !collapsed"
    >
      <i :class="dropDownIconClass" /> {{ name }}
    </span>
    <div v-if="!collapsed">
      <CatchupEntry
        v-for="(resource, i) of shownResources"
        :key="i"
        class="l-left"
        :info="resource"
      />
    </div>
  </div>
</template>

<style scoped>
.o-catchup-group-title {
  font-size: 1.5rem;
}

.l-left {
  text-align: left;
}
</style>
