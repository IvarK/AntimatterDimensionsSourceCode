<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "ShortcutsModal",
  components: {
    ModalCloseButton,
  },
  data() {
    return {
      shortcuts: [],
      timeStudyUnlocked: false,
      glyphUnlocked: false,
      glyphSacUnlocked: false
    };
  },
  computed: {
    visibleShortcuts() {
      return this.shortcuts.filter(x => x.visible());
    },
    moreShiftKeyInfo() {
      const shiftKeyFunctions = [];
      if (this.timeStudyUnlocked) {
        shiftKeyFunctions.push("while buying Time Studies to buy all up until that point");
        shiftKeyFunctions.push("to save Time Study Trees");
      }
      if (this.glyphUnlocked) {
        shiftKeyFunctions.push(`to ${(this.glyphSacUnlocked) ? "sacrifice" : "delete"} Glyphs`);
      }
      const shiftKeyInfo = makeEnumeration(shiftKeyFunctions);
      const message = (shiftKeyInfo === "")
        ? ""
        : `You can hold shift ${shiftKeyInfo}.`;
      return message;
    }
  },
  methods: {
    update() {
      for (const x in shortcuts) {
        this.shortcuts[x] = [];
        const here = this.shortcuts[x];
        const there = shortcuts[x];
        here.name = there.name;
        here.keys = there.keys;
        here.visible = there.visible;
      }
      const progress = PlayerProgress.current;
      this.timeStudyUnlocked = progress.isEternityUnlocked;
      this.glyphUnlocked = progress.isRealityUnlocked;
      this.glyphSacUnlocked = RealityUpgrade(19).isBought;
    }
  },
};
</script>

<template>
  <div class="c-modal-shortcuts l-modal-shortcuts">
    <ModalCloseButton @click="emitClose" />
    <div class="l-modal-shortcuts__column">
      <h2>Hotkey List</h2>
      <div class="l-modal-shortcuts-row">
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Buy 1 Dimension</span>
        <kbd>shift</kbd><kbd>1</kbd>-<kbd>shift</kbd><kbd>8</kbd>
      </div>
      <div class="l-modal-shortcuts-row">
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Buy 10 Dimensions</span>
        <kbd>1</kbd>-<kbd>8</kbd>
      </div>
      <div
        v-for="(shortcut, index) in visibleShortcuts"
        :key="index"
        class="l-modal-shortcuts-row"
      >
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">{{ shortcut.name }}</span>
        <kbd
          v-for="(entry, i) in shortcut.keys"
          :key="i"
        >
          {{ entry }}
        </kbd>
      </div>
    </div>
    <div class="l-modal-shortcuts__column l-modal-shortcuts__column--right">
      <div style="height: 3rem;" />
      <div class="l-modal-shortcuts-row">
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Modifier key</span>
        <kbd>shift</kbd>
      </div>
      <span class="c-modal-shortcuts__shift-description">
        Shift is a modifier key that shows additional information on certain things
        and adjusts the function of certain buttons.
        <br>
        {{ moreShiftKeyInfo }}
      </span>
      <br>
      <br>
      <div class="l-modal-shortcuts-row">
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Autobuyer Controls</span>
        <kbd>alt</kbd>
      </div>
      <span class="c-modal-shortcuts__shift-description">
        Alt is a modifier key that, when pressed in conjunction with any key that has a corresponding autobuyer,
        will toggle said autobuyer. This works for all autobuyers in the Autobuyer tab, but only if they are active.
        <br>
        When pressing both Alt and Shift, you can toggle buying singles or buying max for the Antimatter Dimension
        and Tickspeed Autobuyers instead.
      </span>
      <br>
      <br>
      <div class="l-modal-shortcuts-row">
        <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Tab Movement</span>
        <div>
          <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd>
        </div>
      </div>
      <span class="c-modal-shortcuts__shift-description">
        Using the Arrow Keys will cycle you through the game's pages.
        The Up and Down arrows cycle you through tabs,
        and the Left and Right arrows cycle you through that tab's subtabs.
      </span>
    </div>
  </div>
</template>
