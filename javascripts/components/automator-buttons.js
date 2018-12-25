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

Vue.component('automator-shop-button', {
  props: {
    "instruction-type": String,
    id: String,
    action: String,
  },
  template:
  `<v-popover trigger="hover" popover-inner-class="tooltip-inner automator-tooltip">
    <button :class="['automatorinstruction', instruction-type]"
            :id="id"
            :onclick="action">
      <slot name="button-content"></slot>
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
