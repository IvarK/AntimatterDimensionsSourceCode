<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "ChangeNameModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
      input: "",
      actualName: ""
    };
  },
  created() {
    this.input = player.speedrun.name;
    this.actualName = Speedrun.generateName(this.input);
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    updateName() {
      this.actualName = Speedrun.generateName(this.input);
    },
    confirmChange() {
      player.speedrun.name = this.actualName;
      this.emitClose();
    },
  },
};
</script>

<template>
  <div class="c-modal-import l-modal-content--centered">
    <ModalCloseButton @click="emitClose" />
    <h3>Change your Speedrun Player Name</h3>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup="updateName"
      @keyup.enter="confirmChange"
      @keyup.esc="emitClose"
    >
    <i>
      This can no longer be changed once the timer starts, and there is a limit of {{ formatInt(40) }} characters.
    </i>
    <div>
      Your new name will be {{ actualName }}
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-import__import-btn c-modal__confirm-btn"
      @click="confirmChange"
    >
      Change Name
    </PrimaryButton>
  </div>
</template>
