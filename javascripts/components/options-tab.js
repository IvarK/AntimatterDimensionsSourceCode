Vue.component('options-tab', {
  template:
    `<div class="l-options-tab">
        <options-buttons-grid />
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
          class="c-primary-btn--option l-options-grid__button"
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
        `<div class="c-primary-btn c-primary-btn--option c-primary-btn--update-rate l-options-grid__button"> 
          <b>Update Rate: {{ value }} ms</b>
          <input
            :value="value"
            class="c-primary-btn--update-rate__slider"
            type="range"
            min="33"
            max="200"
            @input="emitInput(parseInt($event.target.value))"
          />
         </div>`
    }
  },
  data: function() {
    return {
      options: player.options
    };
  },
  computed: {
    theme: function() {
      return Themes.find(this.options.theme).displayName();
    }
  },
  methods: {
    hardReset: function() {
      if (confirm("Do you really want to erase all your progress?")) {
        hardReset();
      }
    }
  },
  template:
    `<div class="l-options-grid">
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--option_font-x-large"
          onclick="GameOptions.changeTheme()"
        >Current theme: {{ theme }}</options-button>
        <options-button
          onclick="GameOptions.changeNotation()"
        >Notation: {{ options.notation }}</options-button>
        <options-button
          onclick="GameOptions.toggleNews()"
        >Hide/show the news</options-button>
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off
          v-model="options.retryChallenge"
          class="c-primary-btn--option l-options-grid__button"
          text="Automatically retry challenges"
        />
        <options-button
          class="c-primary-btn--option_font-x-large"
          onclick="GameOptions.export()"
        >Export</options-button>
        <options-button
          class="c-primary-btn--option_font-x-large"
          onclick="Modal.import.show()"
        >Import</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--option_font-large"
          onclick="Modal.confirmationOptions.show()"
        >Confirmations</options-button>
        <options-button
          class="c-primary-btn--option_font-x-large"
          onclick="GameOptions.save()"
        >Save</options-button>
        <options-button
          class="c-primary-btn--option_font-x-large"
          onclick="Modal.loadGame.show()"
        >Load</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          onclick="GameOptions.cloudSave()"
        >Cloud save</options-button>
        <options-button
          onclick="GameOptions.cloudLoad()"
        >Cloud load</options-button>
        <primary-button-on-off
          class="c-primary-btn--option l-options-grid__button"
          v-model="options.cloud"
          text="Automatic cloud saving/loading"
        />
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off-custom
          v-model="options.hotkeys"
          class="c-primary-btn--option l-options-grid__button"
          on="Disable hotkeys"
          off="Enable hotkeys"
        />
        <options-button
          class="c-primary-btn--option_font-x-large"
          @click="hardReset"
        >RESET THE GAME</options-button>
        <primary-button-on-off-custom
          v-model="options.commas"
          class="c-primary-btn--option l-options-grid__button"
          on="Commas on exponents"
          off="Notation on exponents"
        />
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="c-primary-btn--option l-options-grid__button--hidden"
        />
        <update-rate-slider
          v-model="options.updateRate"
          oninput="GameOptions.refreshUpdateRate()"
        />
        <options-button
          class="c-primary-btn--option_font-large"
          onclick="Modal.animationOptions.show();"
        >Animations</options-button>
      </div>
    </div>`
});