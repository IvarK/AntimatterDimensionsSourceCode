Vue.component("automator-save-load-button", {
  props: {
    saveslot: Number
  },
  data: function () {
    return {
      msg: "Hold to save",
      showTip: false,
    }
  },
  computed: {
    tooltip: function () {
      return {
        content: this.msg,
        placement: "top",
        show: this.showTip,
        trigger: "manual"
      };
    },
    listeners: function () {
      return Object.assign({}, this.$listeners, {
        touchstart: e => this.showTip = true,
        mouseover: e => this.showTip = true,
        mouseout: e => this.resetTip(),
        touchend: e => this.resetTip(),
        touchcancel: e => this.resetTip(),
        touchmove: e => {
          e.preventDefault();  // suggested in stackoverflow example
          var t = e.changedTouches[0];
          if (this.$el !== document.elementFromPoint(t.pageX, t.pageY)) {
            this.resetTip();
          }
        },
        "longpress": e => {
          automatorSaveButton(this.saveslot, true)
          this.msg = "Saved"
        },
        "longpressclick": e => {
          automatorSaveButton(this.saveslot, false);
        }
      });
    }
  },
  template:
    `<button class="realitytabbtn automator-save-load-btn" v-on="listeners"
             v-tooltip="tooltip" v-long-press="{ delay: 1000 }">{{saveslot}}</button>`,
  methods: {
    resetTip: function () {
      this.msg = "Hold to save";
      this.showTip = false;
    }
  },
});

Vue.component("automator-shop-button", {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      purchased: false,
      available: false,
    }
  },
  computed: {
    getClass: function() {
      return [this.purchased ? "automatorinstructionbought" :
        this.available ? "automatorinstruction" : "automatorinstructionlocked",
        Automator.Instructions[this.name].type];
    },
    // this assumes prices are constant
    getPrice: function() {
      return Automator.Instructions[this.name].price;
    },
    instructionID: function() {
      return Automator.Instructions[this.name].id;
    },
    domID: function() {
      return "automator" + Automator.Instructions[this.name].id;
    },
    displayName: function() {
      return Automator.Instructions[this.name].displayName;
    },
    popoverTrigger: function() {
      // If the html did not specify a tooltip, we set the trigger to
      // manual so that it doesn't show up:
      return this.$slots["tooltip-header"] ? "hover" : "manual";
    },
  },
  methods: {
    update: function() {
      this.purchased = player.reality.automatorCommands.has(this.instructionID);
      this.available = !this.purchased && canBuyAutomatorInstruction(this.instructionID);
    },
    buy: function() {
      buyAutomatorInstruction(this.instructionID);
    }
  },
  template:
  `<v-popover :trigger="popoverTrigger" popover-inner-class="tooltip-inner automator-tooltip">
    <button :class="getClass"
            :id="domID"
            @click="buy">
            <div>{{displayName}}</div>
            <div v-if="!this.purchased">Cost: {{getPrice}} RM</div>
    </button>
    <div slot="popover">
      <div class="automator-tooltip-header">
        <slot name="tooltip-header"></slot>
      </div>
      <div class="automator-tooltip-content"><div>
        <slot name="tooltip-content"></slot>
      </div></div>
    </div>
  </v-popover>`
});
