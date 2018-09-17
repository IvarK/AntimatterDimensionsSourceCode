Vue.component('options', {
    props: ['model', 'actions'],
    template:
    '<table>\
        <tr>\
          <td is="options-button" fontSize="20px" @click="actions.changeTheme">Current theme: {{ theme }}</td>\
          <td is="options-button" fontSize="120%" @click="actions.changeNotation">Notation: {{ model.notation }}</td>\
          <td is="options-button" fontSize="120%" @click="actions.toggleNews">Hide/show the news</td>\
        </tr>\
        <tr>\
          <td is="on-off-button" fontSize="120%" text="Automatically retry challenges" v-model="model.retryChallenge" />\
          <td is="options-button" fontSize="20px" @click="actions.export">Export</td>\
          <td is="options-button" fontSize="20px" @click="actions.import">Import</td>\
        </tr>\
        <tr>\
          <td is="options-button" fontSize="160%" @click="actions.openConfirmationOptions">Confirmations</td>\
          <td is="options-button" fontSize="20px" @click="actions.save">Save</td>\
          <td is="options-button" fontSize="20px" @click="actions.load">Load</td>\
        </tr>\
        <tr>\
          <td is="options-button" fontSize="120%" @click="actions.cloudSave">Cloud save</td>\
          <td is="options-button" fontSize="120%" @click="actions.cloudLoad">Cloud load</td>\
          <td is="on-off-button" fontSize="120%" text="Automatic cloud saving/loading" v-model="model.cloud" />\
        </tr>\
        <tr>\
          <td is="toggle-button" fontSize="120%" on="Disable hotkeys" off="Enable hotkeys" v-model="model.hotkeys" />\
          <td is="options-button" fontSize="20px" @click="actions.hardReset">RESET THE GAME</td>\
          <td is="toggle-button" fontSize="120%" on="Commas on exponents" off="Notation on exponents" v-model="model.commas"></td>\
        </tr>\
        <tr>\
          <td/>\
          <td is="update-rate-slider" v-model="model.updateRate" @input="actions.refreshUpdateRate"></td>\
          <td is="options-button" fontSize="160%" @click="actions.openAnimationOptions">Animations</td>\
        </tr>\
     </table>',
    computed: {
        theme: function() {
            return Themes.find(this.model.theme).displayName();
        }
    },
    methods: {
    },
    components: {
        'toggle-button': {
            props: ['on', 'off', 'value'],
            template:
                '<options-button v-bind="$attrs" @click="emitInput(!value)">{{value ? on : off}}</options-button>'
        },
        'on-off-button': {
            props: ['text', 'value'],
            template:
                '<options-button v-bind="$attrs" @click="emitInput(!value)">{{displayText}}</options-button>',
            computed: {
                displayText: function () {
                    return this.value ? this.text + " ON" : this.text + " OFF";
                }
            }
        },
        'update-rate-slider': {
            props: ['value'],
            template:
                '<td><div class="storebtn optionsbtn" style="font-size:130%; text-align: center; cursor: default;"> \
                   <b>Update Rate: {{ value }} ms</b>\
                   <input class="slider" style="width: 170px;"\
                     type="range" min="33" max="200"\
                     :value="value" @input="emitInput($event.target.value)" />\
                 </div></td>'
        }
    }
});

Vue.component('options-button', {
    inheritAttrs: false,
    template:
    '<td><primary-button class="optionsbtn" v-bind="$attrs" v-on="$listeners">\
        <slot></slot>\
     </primary-button></td>'
});