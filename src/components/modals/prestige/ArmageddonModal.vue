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
      if (!Pelle.isDoomed) return `You are about to Doom your Reality`;
      return `You are about to perform an Armageddon reset`;
    },
    enterDoom() {
      return `Proceeding will reset everything except Challenge records, Achievements and anything under the
      General header on the Statistics tab. Are you sure you want to proceed? :-)`;
    },
    message() {
      const isFirstReset = (Currency.remnants.eq(0))
        ? `which produce ${format(this.nextRealityShardGain, 2, 2)} Reality Shards/s`
        : `which will increase your Reality Shard gain from ${format(this.realityShardGain, 2, 2)}/s
          to ${format(this.nextRealityShardGain, 2, 2)}/s`;

      return `You will gain ${quantify("Remnant", this.remnantsGain, 2, 0)} ${isFirstReset}`;
    },
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
      if (!Pelle.isDoomed) {
        Glyphs.harshAutoClean();
        if (Glyphs.freeInventorySpace === 0) {
          Modal.message.show(`Entering Doomed will unequip your Glyphs. Some of your
          Glyphs could not be unequipped due to lack of inventory space.`);
          return;
        }
        Glyphs.unequipAll();
        Glyphs.harshAutoClean();
        for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.doomedGlyph(type));
        Glyphs.refreshActive();
        player.celestials.pelle.doomed = true;
        Pelle.armageddon(false);
        respecTimeStudies(true);
        Currency.infinityPoints.reset();
        player.infMult = 0;
        Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
        disChargeAll();
        player.buyUntil10 = true;
        player.records.realTimeDoomed = 0;
        Pelle.quotes.show(Pelle.quotes.INITIAL);
      }

      Pelle.armageddon(true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      {{ enterDoom }}
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
