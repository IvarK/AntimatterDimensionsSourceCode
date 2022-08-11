<script>
export default {
  name: "InformationModalButton",
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: false,
      default: null
    },
    showModal: {
      type: String,
      required: false,
      default: null
    },
  },
  methods: {
    openAssociatedModal() {
      Modal[this.showModal].show();
    }
  }
};
</script>

<template>
  <span
    :ach-tooltip="name"
    class="c-socials--icon__wrapper"
  >
    <a
      v-if="link"
      :href="link"
      target="_blank"
      class="c-socials--icon"
    >
      <i :class="icon" />
    </a>
    <a
      v-else
      class="c-socials--icon"
      @click="openAssociatedModal"
    >
      <i :class="icon" />
    </a>
  </span>
</template>

<style scoped>
.c-socials--icon {
  color: var(--color-text);
  cursor: pointer;
}

.c-socials--icon__wrapper {
  transition: all .2s ease-in-out;
}

.c-socials--icon__wrapper:hover {
  transform: scale(1.1);
}

[ach-tooltip]:before {
  width: 20rem;
  font-size: 1.5rem;
}
</style>