<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "CreditsModal",
  components: {
    ModalCloseButton
  },
  computed: {
    people() { return GameDatabase.credits.people; },
    roles() { return GameDatabase.credits.roles; },
  },
  methods: {
    relevantPeople(role) {
      return this.people
        .filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    close() {
      this.$emit("close");
      Modal.information.show();
    }
  }
};
</script>

<template>
  <div class="l-credits-modal c-credits-modal">
    <ModalCloseButton @click="close" />
    <div class="c-credits-header">
      <div class="c-h2p-title">
        Antimatter Dimensions
      </div>
    </div>

    <div
      v-for="role in roles.count"
      :key="role"
    >
      <h2 class="c-credits-section">
        {{ pluralize(roles[role], relevantPeople(role).length) }}
      </h2>
      <div :class="{ 'l-credits--bulk': relevantPeople(role).length > 10}">
        <div
          v-for="person in relevantPeople(role)"
          :key="person.name"
          class="c-credit-entry"
        >
          {{ person.name }}
          <span v-if="person.name2">
            ({{ person.name2 }})
          </span>
        </div>
      </div>
    </div>

    <br><br><br><br><br><br><br><br><br>
    <h1 class="c-credits-header">
      Thank you so much for playing!
    </h1>
    <br><br><br><br><br><br><br><br><br>
  </div>
</template>

<style scoped>
.l-credits-modal {
  display: block;
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 60vh);
  /* stylelint-disable-next-line unit-allowed-list */
  height: calc(100vh - 40vh);
}

.c-credits-modal {
  overflow-y: scroll;
  margin: 0.5rem;
}

.c-credits-header {
  color: yellow;
}

.c-credits-section {
  color: white;
  text-shadow: 1px 1px 2px turquoise;
  margin-top: 10rem;
  margin-bottom: 2rem;
}

.l-credits--bulk {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 76%;
  position: relative;
  left: 12%;
}

.c-credit-entry {
  font-size: 1.3rem;
  margin-top: 1rem;
}
</style>