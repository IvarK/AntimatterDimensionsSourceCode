<script>
import BigCrunchAutobuyerBox from "@/components/tabs/autobuyers/BigCrunchAutobuyerBox";
import DimensionBoostAutobuyerBox from "@/components/tabs/autobuyers/DimensionBoostAutobuyerBox";
import EternityAutobuyerBox from "@/components/tabs/autobuyers/EternityAutobuyerBox";
import GalaxyAutobuyerBox from "@/components/tabs/autobuyers/GalaxyAutobuyerBox";
import ModalWrapper from "@/components/modals/ModalWrapper";
import RealityAutobuyerBox from "@/components/tabs/autobuyers/RealityAutobuyerBox";

export default {
  name: "AutobuyerEditModal",
  components: {
    BigCrunchAutobuyerBox,
    DimensionBoostAutobuyerBox,
    EternityAutobuyerBox,
    GalaxyAutobuyerBox,
    ModalWrapper,
    RealityAutobuyerBox,
  },
  computed: {
    header() {
      return `Edit Autobuyers`;
    },
    message() {
      return `Using this modal, you can edit various values inside your autobuyers.`;
    },
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ header }}
    </template>
    <div class="c-modal-message__text-fit">
      <span>
        {{ message }}
      </span>
    </div>
    <!--
      We only include these autobuyers as these are (probably) the ones that users will want to change
      most often.
    -->
    <RealityAutobuyerBox class="c-reality-pos c-autobuyer-box__modal" />
    <EternityAutobuyerBox class="c-eternity-pos c-autobuyer-box__modal" />
    <BigCrunchAutobuyerBox class="c-infinity-pos c-autobuyer-box__modal" />
    <GalaxyAutobuyerBox class="c-autobuyer-box__modal" />
    <DimensionBoostAutobuyerBox class="c-autobuyer-box__modal" />
  </ModalWrapper>
</template>

<style scoped>
/* From AutobuyersTab.vue */
/* This is necessary for the ExpandingControlBox within these components to render in the right stacking order
when they're open. It looks slightly hacky but actually can't be done any other way; each AutobuyerBox creates
its own stacking context, which means that all z-indices specified within are essentially scoped and the
AutobuyerBox components will always render in page order regardless of internal z-indices without these. */
.c-reality-pos {
  z-index: 3;
}

.c-eternity-pos {
  z-index: 2;
}

.c-infinity-pos {
  z-index: 1;
}

/* For some reason, we need to specifically define the font size here or else it balloons up to a size
bigger than that of the autobuyer tab. */
.c-autobuyer-box__modal {
  font-size: 1.1rem;
  border-color: var(--color-text);
}

.c-modal-message__text-fit {
  width: auto;
}
</style>
