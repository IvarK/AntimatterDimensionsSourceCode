Vue.component('secondary-button', {
    template:
        '<button class="secondarytabbtn" v-bind="$attrs" v-on="$listeners">\
            <slot></slot>\
        </button>'
});