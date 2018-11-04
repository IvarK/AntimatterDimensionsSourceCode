Vue.component("challenge-grid", {
  props: {
    count: Number
  },
  template:
    `<div class="l-challenge-grid">
      <div v-for="id in count" :key="id" class="l-challenge-grid__cell">
        <slot :challengeId="id" />
      </div>
    </div>`
});