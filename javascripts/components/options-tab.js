Vue.component('options-tab', {
  props: {
    actions: Object,
  },
  template:
    `<div class="l-options-tab">
        <options-buttons :actions="actions.options"/>
        <p>
          Hotkeys: 1-8 for buy 10 dimension, shift+1-8 for buy 1 dimension, T to buy max tickspeed, shift+T to buy one tickspeed, M for max all
          <br>
          S for sacrifice, D for dimension boost, G for antimatter galaxy, C for crunch, A for toggle autobuyers, R for replicanti galaxies, E for eternity.
          <br>
          You can hold shift while buying time studies to buy all up until that point, see each study's number, and save study trees.
          <br>
          Hotkeys do not work while holding control.
        </p>
    </div>`
});

Vue.component('options-buttons', {
    props: ['actions'],
    data: function() {
      return {
        model: player.options
      };
    },
    template:
    '<table class="options-container">\
        <tr>\
          <td><primary-button fontSize="20px" @click="actions.changeTheme">Current theme: {{ theme }}</primary-button></td>\
          <td><primary-button @click="actions.changeNotation">Notation: {{ model.notation }}</primary-button></td>\
          <td><primary-button @click="actions.toggleNews">Hide/show the news</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-button-on-off text="Automatically retry challenges" v-model="model.retryChallenge"/></td>\
          <td><primary-button fontSize="20px" @click="actions.export">Export</primary-button></td>\
          <td><primary-button fontSize="20px" @click="showImportModal">Import</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-button fontSize="18px" @click="showConfirmationOptions">Confirmations</primary-button></td>\
          <td><primary-button fontSize="20px" @click="actions.save">Save</primary-button></td>\
          <td><primary-button fontSize="20px" @click="showLoadGameModal">Load</primary-button></td>\
        </tr>\
        <tr>\
          <td><primary-button @click="actions.cloudSave">Cloud save</primary-button></td>\
          <td><primary-button @click="actions.cloudLoad">Cloud load</primary-button></td>\
          <td><primary-button-on-off text="Automatic cloud saving/loading" v-model="model.cloud"/></td>\
        </tr>\
        <tr>\
          <td><primary-button-on-off-custom on="Disable hotkeys" off="Enable hotkeys" v-model="model.hotkeys"/></td>\
          <td><primary-button fontSize="20px" @click="actions.hardReset">RESET THE GAME</primary-button></td>\
          <td><primary-button-on-off-custom on="Commas on exponents" off="Notation on exponents" v-model="model.commas"/></td>\
        </tr>\
        <tr>\
          <td/>\
          <td><update-rate-slider v-model="model.updateRate" @input="actions.refreshUpdateRate"/></td>\
          <td><primary-button fontSize="18px" @click="showAnimationOptions">Animations</primary-button></td>\
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
                `<div class="c-primary-btn c-primary-btn--options c-primary-btn--update-rate"> 
                   <b>Update Rate: {{ value }} ms</b>
                   <input style="width: 170px;"
                     type="range" min="33" max="200"
                     :value="value" @input="emitInput(parseInt($event.target.value))"
                   />
                 </div>`
        }
    }
});