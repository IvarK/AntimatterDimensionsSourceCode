Vue.component('options-tab', {
  props: ['model', 'view', 'actions'],
  template:
    '<tab-container>\
        <br>\
        <div class="tab-content">\
          <options-buttons :model="model.player.options" :actions="actions.options"></options-buttons>\
          <p>Hotkeys: 1-8 for buy 10 dimension, shift+1-8 for buy 1 dimension, T to buy max tickspeed, shift+T to buy one tickspeed, M for max all<br>\
S for sacrifice, D for dimension boost, G for antimatter galaxy, C for crunch, A for toggle autobuyers, R for replicanti galaxies, E for eternity.<br>\
You can hold shift while buying time studies to buy all up until that point, see each study\'s number, and save study trees.<br>\
Hotkeys do not work while holding control.</p>\
        </div>\
    </tab-container>'
});

Vue.component('options-buttons', {
    props: ['model', 'actions'],
    template:
    '<table class="options-container options-buttons">\
        <tr>\
          <td><primary-button fontSize="20px" @click="actions.changeTheme">Current theme: {{ theme }}</primary-button></td>\
          <td><primary-button fontSize="120%" @click="actions.changeNotation">Notation: {{ model.notation }}</primary-button></td>\
          <td><primary-button fontSize="120%" @click="actions.toggleNews">Hide/show the news</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-named-on-off fontSize="120%" text="Automatically retry challenges" v-model="model.retryChallenge"></primary-named-on-off></td>\
          <td><primary-button fontSize="20px" @click="actions.export">Export</primary-button></td>\
          <td><primary-button fontSize="20px" @click="showImportModal">Import</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-button fontSize="160%" @click="showConfirmationOptions">Confirmations</primary-button></td>\
          <td><primary-button fontSize="20px" @click="actions.save">Save</primary-button></td>\
          <td><primary-button fontSize="20px" @click="showLoadGameModal">Load</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-button fontSize="120%" @click="actions.cloudSave">Cloud save</primary-button></td>\
          <td><primary-button fontSize="120%" @click="actions.cloudLoad">Cloud load</primary-button></td>\
          <td><primary-named-on-off fontSize="120%" text="Automatic cloud saving/loading" v-model="model.cloud"></primary-named-on-off></td>\
        </tr>\
        <tr>\
          <td><primary-on-off fontSize="120%" on="Disable hotkeys" off="Enable hotkeys" v-model="model.hotkeys"></primary-on-off></td>\
          <td><primary-button fontSize="20px" @click="actions.hardReset">RESET THE GAME</primary-button></td>\
          <td><primary-on-off fontSize="120%" on="Commas on exponents" off="Notation on exponents" v-model="model.commas"></primary-on-off></td>\
        </tr>\
        <tr>\
          <td/>\
          <td><update-rate-slider v-model="model.updateRate" @input="actions.refreshUpdateRate"></update-rate-slider></td>\
          <td><primary-button fontSize="160%" @click="showAnimationOptions">Animations</primary-button></td>\
        </tr>\
     </table>',
    computed: {
        theme: function() {
            return Themes.find(this.model.theme).displayName();
        }
    },
    methods: {
        showLoadGameModal: function() {
            Modal.loadGame.show();
        },
        showImportModal: function() {
            Modal.import.show();
        },
        showConfirmationOptions: function() {
            Modal.confirmationOptions.show();
        },
        showAnimationOptions: function() {
            Modal.animationOptions.show();
        }
    },
    components: {
        'update-rate-slider': {
            props: {
                value: {
                    type: Number,
                    default: 50
                }
            },
            template:
                '<div class="storebtn update-rate-btn" style="font-size:130%; text-align: center; cursor: default;"> \
                   <b>Update Rate: {{ value }} ms</b>\
                   <input class="slider" style="width: 170px;"\
                     type="range" min="33" max="200"\
                     :value="value" @input="emitInput(parseInt($event.target.value))" />\
                 </div>'
        }
    }
});