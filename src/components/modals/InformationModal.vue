<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "InformationModal",
  components: {
    ModalCloseButton,
  },
};
</script>

<template>
  <div class="l-information-modal c-information-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        About the game
      </div>
    </div>
    <div class="c-info-body">
      Antimatter Dimensions is an Idle Incremental game created by Finnish developer Hevipelle. Originating as a solo
      project in 2016, it was expanded upon by a large team of developers and testers from then on.
      <br>
      <br>
      The game has unfolding gameplay and multiple prestige layers. The "How to Play" button contains useful
      information about progressing.
    </div>
    <div class="l-socials c-socials">
      <span
        ach-tooltip="GitHub repository"
        class="c-socials--icon__wrapper"
      >
        <a
          href="https://github.com/IvarK/IvarK.github.io"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-brands fa-github" /></a>
      </span>
      <span
        ach-tooltip="Game changelog"
        class="c-socials--icon__wrapper"
      >
        <a
          href="changelog.html"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-solid fa-file-lines" /></a>
      </span>
      <span
        ach-tooltip="r/AntimatterDimensions"
        class="c-socials--icon__wrapper"
      >
        <a
          href="https://www.reddit.com/r/antimatterdimensions"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-brands fa-reddit-alien" /></a>
      </span>
      <span
        ach-tooltip="Antimatter Dimensions Discord Server"
        class="c-socials--icon__wrapper"
      >
        <a
          href="https://discord.gg/ST9NaXa"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-brands fa-discord" /></a>
      </span>
      <span
        ach-tooltip="Antimatter Dimensions on Google Play"
        class="c-socials--icon__wrapper"
      >
        <a
          href="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-brands fa-google-play" /></a>
      </span>
      <!-- TODO: Add way to see credits here -->
      <span
        ach-tooltip="Credits"
        class="c-socials--icon__wrapper"
      >
        <a
          href="https://example.com"
          target="_blank"
          class="c-socials--icon"
        ><i class="fa-solid fa-users" /></a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.l-information-modal {
  display: flex;
  flex-direction: column;
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 50vh);
  justify-content: space-around;
}

.c-information-modal {
  margin: 0.5rem;
}

.c-info-body {
  text-align: left;
  font-size: 2rem;
  margin: 1rem;
  padding: 0.5rem;
}

.c-socials {
  font-size: 7.5rem;
}

.l-socials {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.c-socials--icon {
  color: var(--color-text);
}

.c-socials--icon__wrapper {
  transition: all 0.2s ease-in-out;
}

.c-socials--icon__wrapper:hover {
  transform: scale(1.1);
}

[ach-tooltip]::before {
  width: 20rem;
  font-size: 1.5rem;
}
</style>
