Vue.component('secondary-tab-button', {
  template:
    `<button class="o-btn o-btn--secondary-tab" v-bind="$attrs" v-on="$listeners">
      <slot/>
    </button>`
});