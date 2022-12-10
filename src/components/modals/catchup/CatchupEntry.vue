<script>
export default {
  name: "CatchupEntry",
  props: {
    info: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      focusedResourceId: -1,
      tabToOpen: String,
    };
  },
  computed: {
    config() {
      return this.info.config;
    },
    hasDedicatedH2p() {
      return this.config.openH2pEntry !== undefined;
    },
  },
  methods: {
    isFocusedResource(info) {
      this.focusedResourceId = info.id;
      if (this.focusedResourceId === -1) return true;
      const focusedResourceName = GameDatabase.catchupResources[this.focusedResourceId].name;
      if (focusedResourceName !== info.name) return true;
      return this.tabToOpen = focusedResourceName;
    },
    showHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(
        tab => tab.alias === (this.hasDedicatedH2p ? this.config.openH2pEntry : this.tabToOpen))[0];
      Modal.h2p.show();
    },
  },
};
</script>

<template>
  <div class="c-modal-catchup-entry">
    <span
      class="c-resource-name"
      :info="info"
      :is-focused="isFocusedResource(info)"
      @click="showHowTo"
    >
      <span class="c-underline">{{ info.name }}</span>: <i class="fas fa-question-circle" />
    </span> {{ info.description }}
  </div>
</template>

<style scoped>
.c-resource-name {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}

.c-underline {
  text-decoration: underline;
}

.c-modal-catchup-entry {
  border-top: 0.1rem solid var(--color-text);
  padding: 0.5rem 0 0.5rem 1.5rem;
  cursor: default;
}

.c-modal-catchup-entry:nth-child(1) {
  border-top: none;
}
</style>
