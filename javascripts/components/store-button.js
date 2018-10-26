Vue.component('store-button', {
    props: {
        fontSize: String,
        enabled: {
          type: Boolean,
          default: true
        }
    },
    template:
        '<button :class="classObject" :style="{ fontSize: fontSize }" v-on="$listeners">\
            <slot></slot>\
        </button>',
    computed: {
      classObject: function() {
        return {
          storebtn: this.enabled,
          unavailablebtn: !this.enabled,
        };
      }
    }
});

Vue.component('store-button-on-off', {
    props: {
        on: String,
        off: String,
        value: Boolean
    },
    template:
        '<store-button v-bind="$attrs" @click="emitInput(!value)">{{value ? on : off}}</store-button>'
});

Vue.component('store-button-named-on-off', {
    props: {
        text: String,
        value: Boolean
    },
    template:
        '<store-button v-bind="$attrs" @click="emitInput(!value)">{{displayText}}</store-button>',
    computed: {
        displayText: function () {
            let text = this.text;
            text = text && text.length > 0 ? text + " " : "";
            return this.value ? text + "ON" : text + "OFF";
        }
    }
});