"use strict";

Vue.component("modal-delete-companion", {
  data() {
    return {
      messageIndex: 0,
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      switch (this.messageIndex) {
        case 0:
          return "Are you sure you want to get rid of your Companion Glyph?";
        case 1:
          return "You will not receive any cake.";
        case 2:
          return "This is permanent! You will not get another Companion Glyph!";
        default:
          return "Invalid message index";
      }
    }
  },
  methods: {
    handleYesClick() {
      this.messageIndex++;
      if (this.messageIndex === 3) this.deleteCompanion();
    },
    handleNoClick() {
      this.messageIndex = 0;
      this.emitClose();
    },
    deleteCompanion() {
      // Yes, this actually deletes a companion glyph at random, but the player can only ever legitimately have one.
      // Passing information into modals seems to require a bunch of refactoring that's not worth it for this one case.
      const toDelete = player.reality.glyphs.inventory.filter(g => g.type === "companion")[0];
      Glyphs.removeFromInventory(toDelete);
      this.handleNoClick();
    }
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      {{ message }}
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleYesClick"
      >Yes</primary-button>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >No</primary-button>
    </div>`
});