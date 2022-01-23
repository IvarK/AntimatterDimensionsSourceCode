<script>
export default {
  name: "OpenModalHotkeysButton",
  methods: {
    handleClick() {
      Modal.hotkeys.show();
    }
  }
};
</script>

<template>
  <p
    class="c-options-tab__hotkeys-link"
    @click="handleClick"
  >
    Press <kbd>?</kbd> to open the hotkey list.
  </p>
</template>
