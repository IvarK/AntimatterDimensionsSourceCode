<script>
export default {
  name: "HowToPlay",
  data() {
    return {
      hasTutorial: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn l-help-me": true,
        "h2p-tutorial--glow": this.hasTutorial,
      };
    }
  },
  methods: {
    update() {
      this.hasTutorial = Tutorial.emphasizeH2P();
    },
    showModal() {
      Modal.h2p.show();
    }
  }
};
</script>

<template>
  <div>
    <div
      :class="classObject"
      @click="showModal"
    >
      ?
      <div
        v-if="hasTutorial"
        class="h2p-tooltip"
      >
        Click for info
      </div>
    </div>
  </div>
</template>

<style scoped>
.h2p-tutorial--glow::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: gold;
  border-radius: var(--var-border-radius, inherit);
  animation: a-opacity 3s infinite;
}

.h2p-tooltip {
  width: fit-content;
  position: absolute;
  top: 0;
  right: 100%;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  transform: translate(-0.7rem, -0.5rem);
  padding: 0.2rem 0.4rem;
}

.h2p-tooltip::after {
  content: "";
  position: absolute;
  top: 0.6rem;
  left: 100%;
  border-top: 0.5rem solid transparent;
  border-left: 0.5rem solid var(--color-text);
  border-bottom: 0.5rem solid transparent;
}
</style>