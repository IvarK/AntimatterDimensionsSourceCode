Vue.component('options', {
    props: ['options', 'actions'],
    template:
    '<table>\
        <tr>\
          <td is="options-button" font="20px" :text="\'Current theme: \' + theme" @click="actions.changeTheme" />\
          <td is="options-button" font="120%" :text="\'Notation: \' + options.notation" @click="actions.changeNotation" />\
          <td is="options-button" font="120%" text="Hide/show the news" @click="actions.toggleNews" />\
        </tr>\
        <tr>\
          <td is="on-off-button" font="120%" text="Automatically retry challenges" v-model="options.retryChallenge" />\
          <td is="options-button" font="20px" text="Export" @click="actions.export" />\
          <td is="options-button" font="20px" text="Import" @click="actions.import" />\
        </tr>\
        <tr>\
          <td is="options-button" font="160%" text="Confirmations" @click="actions.openConfirmationOptions" />\
          <td is="options-button" font="20px" text="Save" @click="actions.save" />\
          <td is="options-button" font="20px" text="Load" @click="actions.load" />\
        </tr>\
        <tr>\
          <td is="options-button" font="120%" text="Cloud save" @click="actions.cloudSave" />\
          <td is="options-button" font="120%" text="Cloud load" @click="actions.cloudLoad" />\
          <td is="on-off-button" font="120%" text="Automatic cloud saving/loading" v-model="options.cloud" />\
        </tr>\
        <tr>\
          <td is="toggle-button" font="120%" on="Disable hotkeys" off="Enable hotkeys" v-model="options.hotkeys" />\
          <td is="options-button" font="20px" text="RESET THE GAME" @click="actions.hardReset" />\
          <td is="toggle-button" font="120%" on="Commas on exponents" off="Notation on exponents" v-model="options.commas" />\
        </tr>\
        <tr>\
          <td />\
          <td is="update-rate-slider" v-model="options.updateRate" @input="actions.refreshUpdateRate"/>\
          <td is="options-button" font="160%" text="Animations" @click="actions.openAnimationOptions" />\
        </tr>\
     </table>',
    computed: {
        theme: function() {
            return Themes.find(this.options.theme).displayName();
        }
    },
    methods: {
    },
    components: {
        'toggle-button': {
            props: ['font', 'on', 'off', 'value'],
            template:
                '<options-button :font="font" :text="value ? on : off" @click="$emit(\'input\', !value)" />'
        },
        'on-off-button': {
            props: ['font', 'text', 'value'],
            template:
                '<options-button :font="font" :text="displayText" @click="$emit(\'input\', !value)" />',
            computed: {
                displayText: function () {
                    return this.value ? this.text + " ON" : this.text + " OFF";
                }
            }
        },
        'update-rate-slider': {
            props: ['value'],
            template:
                '<td><div class="storebtn optionsbtn" style="font-size:130%; text-align: center;"> \
                   <b>Update Rate: {{ value }} ms</b>\
                   <input class="slider" style="width: 170px;"\
                     type="range" min="33" max="200"\
                     :value="value" @input="$emit(\'input\', $event.target.value)" />\
                 </div></td>'
        }
    }
});

Vue.component('options-button', {
    props: ['font', 'text'],
    template:
    '<td><button class="storebtn optionsbtn" :style="{ fontSize: font }" @click="$emit(\'click\')">\
        {{ text }}\
    </button></td>'
});