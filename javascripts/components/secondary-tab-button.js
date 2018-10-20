Vue.component('secondary-tab-button', {
  template:
    '<button class="secondarytabbtn" v-bind="$attrs" v-on="$listeners">\
        <slot></slot>\
    </button>'
});