Vue.component('secondary-tab-button', {
  template:
    `<button class="c-btn c-btn--secondary-tab" v-bind="$attrs" v-on="$listeners">
        <slot/>
    </button>`
});