<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "TitleScreenModal",
  components: {
    PrimaryButton
  },
  data() {
    return {
      loggedIn: false,
      userName: "",
      cloudAntimatters: [10, 10, 10]
    };
  },
  computed: {
    isSelected() {
      return GameStorage.currentSlot === this.saveId;
    },
    saveAntimatters() {
      return [0, 1, 2].map(id => {
        const save = GameStorage.saves[id];
        return new Decimal(save ? save.antimatter || save.money : 10);
      });
    }
  },
  methods: {
    load(id) {
      document.getElementById("loading").style.display = "none";
      GameStorage.loadSlot(id - 1);
    },
    loadCloud(id) {
      document.getElementById("loading").style.display = "none";
      GameStorage.currentSlot = id - 1;
      Cloud.loadCheck();
    },
    formatAntimatter(antimatter) {
      return formatPostBreak(antimatter, 2, 1);
    },
    update() {
      this.loggedIn = Cloud.loggedIn;
      if (!this.loggedIn) return;
      this.userName = Cloud.user.displayName;
    },
  },
  watch: {
    async loggedIn() {
      this.cloudAntimatters = await Cloud.getCloudAntimatters();
    }
  }
};
</script>

<template>
  <div class="c-modal l-modal title-screen-modal">
    <h2>Are you ready to make antimatter?</h2>
    <div class="panel-container">
      <div class="cloud-panel">
        <h3>Cloud saves</h3>
        <div v-if="loggedIn">
          <div
            v-for="id in 3"
            :key="id"
            class="l-modal-options__save-record"
          >
            <PrimaryButton
              class="load-button"
              @click="loadCloud(id)"
            >
              Load Cloud Save #{{ id }}<br>
              {{ formatAntimatter(cloudAntimatters[id - 1]) }} Antimatter
            </PrimaryButton>
          </div>
          <h4>Logged in as {{ userName }}</h4>
        </div>
        <div v-else>
          <h4>Not logged in</h4>
          <PrimaryButton
            class="load-button"
            onclick="Cloud.login()"
          >
            Login with Google to enable Cloud Saving
          </PrimaryButton>
        </div>
      </div>
      <div class="local-panel">
        <h3>Local saves</h3>
        <div
          v-for="id in 3"
          :key="id"
          class="l-modal-options__save-record"
        >
          <PrimaryButton
            class="load-button"
            @click="load(id)"
          >
            Load Save #{{ id }}<br>
            {{ formatAntimatter(saveAntimatters[id - 1]) }} Antimatter
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-screen-modal {
  z-index: 1000;
}

.panel-container {
  display: flex;
  width: 50rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 5rem;
  padding: 2rem;
}

.load-button {
  height: auto;
  width: 20rem;
}
</style>