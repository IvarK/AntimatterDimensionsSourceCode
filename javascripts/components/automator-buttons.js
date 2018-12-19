Vue.component('automator-save-load-button', {
  props: {
    'saveslot' : Number
  },
  data: function () {
    return {
      msg: 'Hold to save',
      showTip: false,
    }
  },
  template:
    `<button class="realitytabbtn automator-save-load-btn"
             v-tooltip="{
               content: msg,
               placement: 'top',
               show: showTip,
               trigger: 'manual'
             }">{{saveslot}}</button>`,
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
      this.showTip = false;
      this.msg = 'Hold to save';
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
