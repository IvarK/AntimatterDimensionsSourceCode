<script>
export default {
  name: "CreditsDisplay",
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
  }
};
</script>

<template>
  <div>
    <h1 class="c-credits-header">
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
.c-credits-header {
  color: #6b237d;
}

.s-base--dark .c-credits-header {
  color: yellow;
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