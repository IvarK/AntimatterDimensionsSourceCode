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
  <div class="information-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        About the game
      </div>
    </div>
    <div class="info-body">
      Antimatter Dimensions is an Idle Incremental game created by Finnish developer Hevipelle. Originating as a solo
      project in 2016, it was expanded upon by a large team of developers and testers from then on.
      <br>
      <br>
      The game has unfolding gameplay and multiple prestige layers. The "How to Play" button contains useful
      information about progressing.
    </div>
    <div class="socials">
      <span ach-tooltip="Antimatter Dimensions Discord Server">
        <a
          href="https://discord.gg/ST9NaXa"
          target="_blank"
        ><i class="fa-brands fa-discord" /></a>
      </span>
      <span ach-tooltip="r/AntimatterDimensions">
        <a
          href="https://www.reddit.com/r/antimatterdimensions"
          target="_blank"
        ><i class="fa-brands fa-reddit-alien" /></a>
      </span>
      <span ach-tooltip="Antimatter Dimensions on Google Play">
        <a
          href="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions"
          target="_blank"
        ><i class="fa-brands fa-google-play" /></a>
      </span>
      <span ach-tooltip="Game changelog">
        <a
          href="changelog.html"
          target="_blank"
        ><i class="fa-solid fa-arrows-rotate" /></a>
      </span>
      <span ach-tooltip="Credits">
        <a
          href="https://example.com"
          target="_blank"
        ><i class="fa-solid fa-users-line" /></a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.socials {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 7.5rem;
  color: white;
}

[ach-tooltip]:before {
  width: 20rem;
  font-size: 1.5rem;
}

.information-modal {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  width: calc(100vw - 50vh);
  height: calc(100vh - 60vh);
  justify-content: space-around;
}

.info-body {
  margin: 1rem;
  padding: 0.5rem;
  text-align: left;
  font-size: 2rem;
}

a {
  color: white;
}
</style>