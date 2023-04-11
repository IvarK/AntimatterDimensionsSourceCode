<script>
export default {
  name: "CreditsDisplay",
  props: {
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    people() { return GameDatabase.credits.people; },
    roles() { return GameDatabase.credits.roles; },
    isS12EndDisplay() { return this.$viewModel.theme === "S12" && !this.isModal; },
  },
  methods: {
    relevantPeople(role) {
      return this.people
        .filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  }
};
</script>

<template>
  <div :class="{ 'c-credits-s12-end': isS12EndDisplay }">
    <h1
      v-if="!isModal"
      class="c-credits-header"
    >
      Antimatter Dimensions
    </h1>

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
  </div>
</template>

<style scoped>
.c-credits-s12-end {
  --color-text: white;
  color: white;
}

.c-credits-header {
  color: black;
}

.t-dark .c-credits-header,
.t-amoled .c-credits-header,
.t-s6 .c-credits-header,
.t-s10 .c-credits-header {
  animation: a-credits-header--glow 25s infinite;
}

.t-s12 .c-credits-header {
  color: var(--color-antimatter);
}

@keyframes a-credits-header--glow {
  0% { color: #2196f3; }
  33% { color: #673ab7; }
  66% { color: #00bcd4; }
  100% { color: #2196f3; }
}

.t-s11 .c-credits-header {
  animation: a-credits-header--glow-blob 25s infinite;
}

@keyframes a-credits-header--glow-blob {
  0% { color: #fbc21b; }
  33% { color: #caa32c; }
  66% { color: #fba11b; }
  100% { color: #fbc21b; }
}

.t-dark-metro .c-credits-header,
.t-amoled-metro .c-credits-header {
  color: #e0e0e0;
}

.c-credits-section {
  color: var(--color-text);
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