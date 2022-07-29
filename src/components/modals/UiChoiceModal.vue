<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UiChoiceModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    handleYesClick() {
      GameOptions.toggleUI();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Visual Changes
    </template>
    <div class="c-modal-message__text l-left">
      We noticed that you've loaded an old save; a few visual changes have been made since older versions of the game:
      <br>
      - Many more game events now have animations. If these impact your performance or gameplay, they can be disabled
      in the Visual Options tab.
      <br>
      - New confirmation windows have replaced the default Javascript alert windows. These can be disabled in the
      Gameplay Options tab.
      <br>
      - The game now also has a new sleek layout which was designed with more Modern design practices in mind.
      <br>
      <br>
      You can change between the Classic UI which older versions of the game used and the newer Modern UI in the Visual
      Options tab at any time. Would you like to swap to the Modern UI now?
    </div>
    <template #cancel-text>
      Remain
    </template>
    <template #confirm-text>
      Swap
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-left {
  text-align: left;
}
</style>
