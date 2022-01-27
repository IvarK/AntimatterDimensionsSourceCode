<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "HotkeysModal",
  components: {
    ModalCloseButton,
  },
  data() {
    return {
      updateIndicies: [],
      visible: [],
      timeStudyUnlocked: false,
      glyphSacUnlocked: false
    };
  },
  computed: {
    moreShiftKeyInfo() {
      const shiftKeyFunctions = [];
      if (this.timeStudyUnlocked) {
        shiftKeyFunctions.push("while buying Time Studies to buy all up until that point");
        shiftKeyFunctions.push("to save Time Study Trees");
      }
      if (this.glyphSacUnlocked) {
        shiftKeyFunctions.push("to purge Glyphs");
      }
      const shiftKeyInfo = makeEnumeration(shiftKeyFunctions);
      return (shiftKeyInfo === "")
        ? ""
        : `You can hold Shift ${shiftKeyInfo}.`;
    },
    hotkeyCount() {
      return shortcuts.length;
    },
    shortcutNames() {
      return shortcuts.map(x => x.name);
    },
    shortcutkeys() {
      return shortcuts.map(x => x.keys);
    }
  },
  created() {
    for (let i = 0; i < this.hotkeyCount; i++) {
      const visible = shortcuts[i].visible;
      if (typeof visible === "function") {
        this.updateIndicies.push(i);
      } else {
        this.visible[i] = visible;
      }
    }
  },
  methods: {
    update() {
      for (const index of this.updateIndicies) {
        this.$set(this.visible, index, shortcuts[index].visible());
      }
      const progress = PlayerProgress.current;
      this.timeStudyUnlocked = progress.isEternityUnlocked;
      this.glyphSacUnlocked = RealityUpgrade(19).isBought;
    }
  },
};
</script>

<template>
  <div class="c-modal-hotkeys l-modal-hotkeys">
    <ModalCloseButton @click="emitClose" />
    <div class="l-modal-hotkeys__column">
      <h2>Hotkey List</h2>
      <div class="l-modal-hotkeys-row">
        <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Buy 1 Dimension</span>
        <kbd>shift</kbd><kbd>1</kbd>-<kbd>shift</kbd><kbd>8</kbd>
      </div>
      <div class="l-modal-hotkeys-row">
        <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Buy 10 Dimensions</span>
        <kbd>1</kbd>-<kbd>8</kbd>
      </div>
      <div
        v-for="index in hotkeyCount"
        :key="index"
      >
        <span
          v-if="visible[index]"
          class="l-modal-hotkeys-row"
        >
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ shortcutNames[index] }}</span>
          <kbd
            v-for="(key, i) in shortcutkeys[index]"
            :key="i"
          >
            {{ key }}
          </kbd>
        </span>
      </div>
    </div>
    <div class="l-modal-hotkeys__column l-modal-hotkeys__column--right">
      <div style="height: 3rem;" />
      <div class="l-modal-hotkeys-row">
        <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Modifier key</span>
        <kbd>shift</kbd>
      </div>
      <span class="c-modal-hotkeys__shift-description">
        Shift is a modifier key that shows additional information on certain things
        and adjusts the function of certain buttons.
        <br>
        {{ moreShiftKeyInfo }}
      </span>
      <br>
      <br>
      <div class="l-modal-hotkeys-row">
        <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Autobuyer Controls</span>
        <kbd>alt</kbd>
      </div>
      <span class="c-modal-hotkeys__shift-description">
        Alt is a modifier key that, when pressed in conjunction with any key that has a corresponding autobuyer,
        will toggle said autobuyer. This works for all autobuyers in the Autobuyer tab, but only if they are active.
        <br>
        When pressing both Alt and Shift, you can toggle buying singles or buying max for the Antimatter Dimension
        and Tickspeed Autobuyers instead.
      </span>
      <br>
      <br>
      <div class="l-modal-hotkeys-row">
        <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">Tab Movement</span>
        <div>
          <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd>
        </div>
      </div>
      <span class="c-modal-hotkeys__shift-description">
        Using the Arrow Keys will cycle you through the game's pages.
        The Up and Down arrows cycle you through tabs,
        and the Left and Right arrows cycle you through that tab's subtabs.
      </span>
    </div>
  </div>
</template>
