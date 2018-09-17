Vue.component('primary-button', {
    props: {
        fontSize: String
    },
    template:
        '<button class="storebtn" :style="{ fontSize: fontSize }" v-on="$listeners">\
            <slot></slot>\
        </button>'
});