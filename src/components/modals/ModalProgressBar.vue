<script>
import OfflineSpeedupButton from "@/components/OfflineSpeedupButton";

export default {
  name: "ModalProgressBar",
  components: {
    OfflineSpeedupButton,
  },
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remainingTime() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      const ms = timeSinceStart * (this.progress.max - this.progress.current) / this.progress.current;
      return TimeSpan.fromMilliseconds(ms).toStringShort();
    },
    buttons() {
      return this.progress.buttons || [];
    }
  },
};
</script>

<template>
  <div
    class="l-modal-overlay c-modal-overlay progress-bar-modal"
  >
    <div class="c-modal">
      <div class="modal-progress-bar">
        <div class="modal-progress-bar__label">
          {{ progress.label }}
        </div>
        <div>
          {{ progress.info() }}
        </div>
        <div class="modal-progress-bar__margin">
          <div>
            {{ progress.progressName }}: {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }}
          </div>
          <div>
            Remaining: {{ remainingTime }}
          </div>
          <div class="modal-progress-bar__hbox">
            <div class="modal-progress-bar__bg">
              <div
                class="modal-progress-bar__fg"
                :style="foregroundStyle"
              />
            </div>
          </div>
        </div>
        <div class="modal-progress-bar__buttons">
          <OfflineSpeedupButton
            v-for="(button, id) in buttons"
            :key="id"
            :button="button"
            :progress="progress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-modal {
  z-index: 8;
}

.c-modal {
  position: fixed;
  /* stylelint-disable-next-line unit-allowed-list */
  top: 50vh;
  /* stylelint-disable-next-line unit-allowed-list */
  left: 50vw;
  transform: translate(-50%, -50%);
}

.modal-progress-bar {
  display: flex;
  flex-direction: column;
  width: 40rem;
  z-index: 3;
  justify-content: space-between;
  align-items: center;
}

.modal-progress-bar__hbox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.modal-progress-bar__bg {
  width: 20rem;
  height: 2rem;
  background: black;
  margin-right: 1rem;
  margin-left: 1rem;
}

.modal-progress-bar__fg {
  height: 100%;
  background: blue;
}

.modal-progress-bar__buttons {
  display: flex;
  flex-direction: row;
  width: 25rem;
  justify-content: space-between;
  align-items: center;
}

.modal-progress-bar__label {
  font-size: large;
  padding-bottom: 0.5rem;
}

.modal-progress-bar__margin {
  margin: 1rem 0;
}
</style>
