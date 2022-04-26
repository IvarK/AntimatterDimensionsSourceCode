<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ArmageddonModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    topLabel() {
      if (!this.isDoomed) return `You are about to Doom your Reality`;
      return `You are about to perform an Armageddon reset`;
    },
    message() {
      const isFirstReset = (Currency.remnants.eq(0))
        ? `which will produce ${format(this.nextRealityShardGain, 2, 2)} Reality Shards/s`
        : `which will increase your Reality Shards gain from ${format(this.realityShardGain, 2, 2)}/s
          to ${format(this.nextRealityShardGain, 2, 2)}/s`;

      return `Armageddon will start a new Doomed Reality. You will gain
      ${quantify("Remnant", this.remnantsGain, 2, 0)} ${isFirstReset}`;
    },
    optionsObject() {
      if (!this.isDoomed) return {};
      return {
        option: "armageddon"
      };
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    handleYesClick() {
      if (this.isDoomed) {
        Pelle.armageddon(true);
        return;
      }

      Glyphs.harshAutoClean();
      if (!Glyphs.unequipAll()) {
        Modal.message.show(`Entering Doomed will unequip your Glyphs. Some of your
        Glyphs could not be unequipped due to lack of inventory space.`);
        return;
      }
      Glyphs.harshAutoClean();
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.doomedGlyph(type));
      Glyphs.refreshActive();
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      respecTimeStudies(true);
      Currency.infinityPoints.reset();
      player.IPMultPurchases = 0;
      Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
      disChargeAll();
      player.buyUntil10 = true;
      player.records.realTimeDoomed = 0;
      Pelle.quotes.show(Pelle.quotes.initial);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    v-bind="optionsObject"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      Entering Doomed will reset everything except Challenge records, Celestial progress and anything under
      the General and Reality header on the Statistics tab. You will not gain any rewards from your progress
      in your current Reality. Entering Doomed will also disable certain game mechanics.
      <br>
      <br>
      Are you sure you want to do this?
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
