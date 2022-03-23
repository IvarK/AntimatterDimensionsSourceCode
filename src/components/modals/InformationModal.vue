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
      Antimatter Dimensions is an Idle Incremental game with multiple layers of unlocks, prestige, and achievements.
      <br>
      <br>
      The basic goal is to reach Infinity and receive an Infinity Point, which can be spent on various upgrades to
      increase your overall production.
    </div>
    <div class="socials">
      <span ach-tooltip="Antimatter Dimensions Discord Server">
        <a
          href="https://discord.gg/ST9NaXa"
          target="_blank"
          class="socials--discord"
        ><i class="fa-brands fa-discord" /></a>
      </span>
      <span ach-tooltip="r/AntimatterDimensions">
        <a
          href="https://www.reddit.com/r/antimatterdimensions"
          target="_blank"
          class="socials--reddit"
        ><i class="fa-brands fa-reddit" /></a>
      </span>
      <span ach-tooltip="Antimatter Dimensions on Google Play">
        <a
          href="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions"
          target="_blank"
          class="socials--android"
        ><i class="fa-brands fa-google-play" /></a>
      </span>
      <span ach-tooltip="Game changelog">
        <a
          href="changelog.html"
          target="_blank"
          class="socials--changelog"
        ><i class="fa-solid fa-arrows-rotate" /></a>
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
}

.socials--discord {
  color: #5865f2;
}

.socials--reddit {
  color: #ff4500;
}

.socials--android {
  color: #00ceff;
}

.socials--changelog {
  color: white;
}

[ach-tooltip]:before {
  width: 18rem;
}

.information-modal {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  width: calc(100vw - 50vh);
  height: calc(100vh - 60vh);
}

.info-body {
  margin: 1rem;
  padding: 0.5rem;
  text-align: left;
  font-size: 1.6rem;
}

a {
  color: white;
}
</style>