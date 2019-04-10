"use strict";

Vue.component("automator-save-load-button", {
  props: {
    saveslot: Number
  },
  data() {
    return {
      msg: "Hold to save",
      showTip: false,
    };
  },
  computed: {
    tooltip() {
      return {
        content: this.msg,
        placement: "top",
        show: this.showTip,
        trigger: "manual"
      };
    },
    listeners() {
      return Object.assign({}, this.$listeners, {
        touchstart: () => this.showTip = true,
        mouseover: () => this.showTip = true,
        mouseout: () => this.resetTip(),
        touchend: () => this.resetTip(),
        touchcancel: () => this.resetTip(),
        touchmove: e => {
          e.preventDefault();
          const t = e.changedTouches[0];
          if (this.$el !== document.elementFromPoint(t.pageX, t.pageY)) {
            this.resetTip();
          }
        },
        "longpress": () => {
          automatorSaveButton(this.saveslot, true);
          this.msg = "Saved";
        },
        "longpressclick": () => {
          automatorSaveButton(this.saveslot, false);
        }
      });
    }
  },
  template:
    `<button class="realitytabbtn automator-save-load-btn" v-on="listeners"
             v-tooltip="tooltip" v-long-press="{ delay: 1000 }">{{saveslot}}</button>`,
  methods: {
    resetTip() {
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
  data() {
    return {
      purchased: false,
      available: false,
    };
  },
  computed: {
    classObject() {
      const classObject = {
        "automatorinstructionbought": this.purchased,
        "automatorinstruction": this.available,
        "automatorinstructionlocked": !this.available
      };
      classObject[AutomatorInstructions.Instructions[this.name].type] = true;
      return classObject;
    },
    // This assumes prices are constant
    cost() {
      return AutomatorInstructions.Instructions[this.name].price;
    },
    instructionID() {
      return AutomatorInstructions.Instructions[this.name].id;
    },
    domID() {
      return "automator" + AutomatorInstructions.Instructions[this.name].id;
    },
    displayName() {
      return AutomatorInstructions.Instructions[this.name].displayName;
    },
    popoverTrigger() {
      // If the html did not specify a tooltip, we set the trigger to
      // manual so that it doesn't show up:
      return this.$slots["tooltip-header"] ? "hover" : "manual";
    },
  },
  methods: {
    update() {
      this.purchased = player.reality.automatorCommands.has(this.instructionID);
      this.available = !this.purchased && canBuyAutomatorInstruction(this.instructionID);
    },
    buy() {
      buyAutomatorInstruction(this.instructionID);
    }
  },
  template:
  `<v-popover :trigger="popoverTrigger" popover-inner-class="tooltip-inner automator-tooltip">
    <button :class="classObject"
            :id="domID"
            @click="buy">
            <div>{{displayName}}</div>
            <div v-if="!this.purchased">Cost: {{cost}} RM</div>
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
