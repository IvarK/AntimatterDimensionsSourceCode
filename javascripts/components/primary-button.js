Vue.component('primary-button', {
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
          "c-primary-btn": true,
          "c-primary-btn--disabled": !this.enabled,
        };
      }
    }
});

Vue.component('primary-button-on-off', {
    props: {
        on: String,
        off: String,
        value: Boolean
    },
    template:
        '<primary-button v-bind="$attrs" @click="emitInput(!value)">{{value ? on : off}}</primary-button>'
});

Vue.component('primary-button-named-on-off', {
    props: {
        text: String,
        value: Boolean
    },
    template:
        '<primary-button v-bind="$attrs" @click="emitInput(!value)">{{displayText}}</primary-button>',
    computed: {
        displayText: function () {
            let text = this.text;
            text = text && text.length > 0 ? text + " " : "";
            return this.value ? text + "ON" : text + "OFF";
        }
    }
});