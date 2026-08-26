<script>
export default {
  name: "HowToPlay",
  data() {
    return {
      hasTutorial: false,
      isModern: false,
    };
  },
  computed: {
    h2pClassObject() {
      return {
        "o-tab-btn l-help-me": true,
      };
    },
    topMargin() {
      return {
        "margin-top": this.isModern ? "4.5rem" : "1rem",
      };
    }
  },
  methods: {
    update() {
      this.hasTutorial = Tutorial.emphasizeH2P();
      this.isModern = player.options.newUI;
    },
    showH2P() {
      Modal.h2p.show();
    },
    showInfo() {
      Modal.information.show();
    }
  }
};
</script>

<template>
  <div>
    <div
      :class="h2pClassObject"
      :style="topMargin"
      @click="showH2P"
    >
      ?
      <div
        v-if="hasTutorial"
        class="h2p-tooltip"
      >
        Click for info
      </div>
    </div>
    <div
      v-if="hasTutorial"
      class="h2p-tutorial--glow"
      :style="topMargin"
    />
    <div
      class="o-tab-btn l-information l-help-me"
      @click="showInfo"
    >
      i
    </div>
  </div>
</template>

<style scoped>
.l-help-me {
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 2rem;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.9rem;
  border-radius: var(--var-border-radius, 50%);
  transition-delay: 0s;
  pointer-events: auto;
  cursor: pointer;
}

.h2p-tutorial--glow {
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 0;
  right: 2rem;
  z-index: 2;
  background: gold;
  border-radius: var(--var-border-radius, 50%);
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
  padding: 0.2rem 0.4rem;
  transform: translate(-0.7rem, -0.4rem);
}

.h2p-tooltip::after {
  content: "";
  position: absolute;
  top: 0.6rem;
  left: 100%;
  border-top: 0.5rem solid transparent;
  border-bottom: 0.5rem solid transparent;
  border-left: 0.5rem solid var(--color-text);
}
</style>