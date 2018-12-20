Vue.component('automator-save-load-button', {
  props: {
    saveslot : Number
  },
  data: function () {
    return {
      msg: 'Hold to save',
      showTip: false,
    }
  },
  computed: {
    tooltip: function () {
      return {
        content: this.msg,
        placement: 'top',
        show: this.showTip,
        trigger: 'manual'
      };
    }
  },
  template:
    `<button class="realitytabbtn automator-save-load-btn" v-tooltip="tooltip">{{saveslot}}</button>`,

  mounted: function () {
    LongPress.addTo(this.$el, 1000, {
      longPress: (e) => {
        automatorSaveButton(this.saveslot, true)
        this.msg = 'Saved'
      },
      cancel: null,
      click: (e) => {
        automatorSaveButton(this.saveslot, false);
      }
    })
    var resetTip = () => {
    }
    // In order for the tip to pop up on mobile, need to manage it manually:
    $(this.$el).hover(e => { this.showTip = true; }, resetTip);
    $(this.$el).on("touchstart", e => { this.showTip = true; });
    $(this.$el).on("touchend touchcancel", resetTip);
    $(this.$el).on("touchmove", e => {
      e.preventDefault();  // suggested in stackoverflow example
      var t = e.changedTouches[0];
      if (this.$el !== document.elementFromPoint(t.pageX,t.pageY)) {
        resetTip();
      }
    })
  },
});
