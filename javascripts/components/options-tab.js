Vue.component('options-tab', {
  props: {
    actions: Object,
  },
  template:
    `<div class="l-options-tab">
        <options-buttons-grid :actions="actions.options"/>
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

Vue.component('options-buttons-grid', {
  components: {
    "options-button": {
      template:
        `<primary-button
              class="c-primary-btn--options l-options-grid__button"
              @click="emitClick"
            ><slot /></primary-button>`
    },
    "update-rate-slider": {
      props: {
        value: {
          type: Number,
          default: 50
        },
      },
      template:
        `<div class="c-primary-btn c-primary-btn--options c-primary-btn--update-rate l-options-grid__button"> 
          <b>Update Rate: {{ value }} ms</b>
          <input class="c-primary-btn--update-rate__slider"
            type="range" min="33" max="200"
            :value="value" @input="emitInput(parseInt($event.target.value))"
          />
         </div>`
    }
  },
  props: {
    actions: Object
  },
  data: function() {
    return {
      model: player.options
    };
  },
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
  template:
    `<div class="l-options-grid">
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="actions.changeTheme"
        >Current theme: {{ theme }}</options-button>
        <options-button
          @click="actions.changeNotation"
        >Notation: {{ model.notation }}</options-button>
        <options-button
          @click="actions.toggleNews"
        >Hide/show the news</options-button>
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off
          v-model="model.retryChallenge"
          class="c-primary-btn--options l-options-grid__button"
          text="Automatically retry challenges"
        />
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="actions.export"
        >Export</options-button>
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="showImportModal"
        >Import</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--options_font-large"
          @click="showConfirmationOptions"
        >Confirmations</options-button>
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="actions.save"
        >Save</options-button>
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="showLoadGameModal"
        >Load</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          @click="actions.cloudSave"
        >Cloud save</options-button>
        <options-button
          @click="actions.cloudLoad"
        >Cloud load</options-button>
        <primary-button-on-off
          class="c-primary-btn--options l-options-grid__button"
          v-model="model.cloud"
          text="Automatic cloud saving/loading"
        />
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off-custom
          v-model="model.hotkeys"
          class="c-primary-btn--options l-options-grid__button"
          on="Disable hotkeys"
          off="Enable hotkeys"
        />
        <options-button
          class="c-primary-btn--options_font-x-large"
          @click="actions.hardReset"
        >RESET THE GAME</options-button>
        <primary-button-on-off-custom
          v-model="model.commas"
          class="c-primary-btn--options l-options-grid__button"
          on="Commas on exponents"
          off="Notation on exponents"
        />
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--options l-options-grid__button--hidden"
        />
        <update-rate-slider
          v-model="model.updateRate"
          @input="actions.refreshUpdateRate"
        />
        <options-button
          class="c-primary-btn--options_font-large"
          @click="showAnimationOptions"
        >Animations</options-button>
      </div>
    </div>`
});