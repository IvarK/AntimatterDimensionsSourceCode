<script>
export default {
  name: "OpenModalShortcutsButton",
  methods: {
    handleClick() {
      Modal.hotkeys.show();
    }
  }
};
</script>

<template>
  <p
    class="c-options-tab__shortcuts-link"
    @click="handleClick"
  >
    Press <kbd>?</kbd> to open shortcut list.
  </p>
</template>
