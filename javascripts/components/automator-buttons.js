Vue.component('automator-save-load-button', {
  props: ['saveslot'],
  data: function() { return {
    msg: 'Hold to save',
    showTip: false,
  }},
  template:
    `<button class="realitytabbtn tt-save-load-btn"
             v-tooltip="{
               content: msg,
               placement: 'top',
               show: showTip,
               trigger: 'manual'
             }"
             style="width:30px;
                    height: 30px;
                    font-size: 1.2rem;
                    display: block;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-left: 5px;">{{saveslot}}</button>`,
  mounted: function() {
    var _this = this;
    LongPress.addTo(this.$el, 1000, {
      longPress: function(e) {
        automatorSaveButton(_this.saveslot, true)
        _this.msg = 'Saved'
      },
      cancel: null,
      click: function(e) {
        automatorSaveButton(_this.saveslot, false);
      }
    })
    var resetTip = function() {
      _this.showTip = false;
      _this.msg = 'Hold to save';
    }
    // In order for the tip to pop up on mobile, need to manage it manually:
    $(this.$el).hover(function(e) { _this.showTip = true; }, resetTip);
    $(this.$el).on("touchstart", function(e) { _this.showTip = true; });
    $(this.$el).on("touchend touchcancel", resetTip);
    $(this.$el).on("touchmove", function(e) {
      e.preventDefault();  // suggested in stackoverflow example
      var t = e.changedTouches[0];
      if (_this.$el !== document.elementFromPoint(t.pageX,t.pageY)) {
        resetTip();
      }
    })
  },
});

/*
For use with another changeset
Vue.component('automator-shop-button', {
  props: [ 'instructionType', 'id', 'action', 'tooltipHeader' ],
  template:
  `<v-popover trigger="hover" popover-inner-class="tooltip-inner tooltip-wide">
    <button v-bind:class="['automatorinstruction', instructionType]"
            v-bind:id="id"
            @click="action">
      <slot name="button-content"></slot>
    </button>
    <div slot="popover">
      <div style="white-space: nowrap; display: table-row">
        <img style="float:left;min-width:160px;visibility:hidden;width:0px;">
        <h3>{{tooltipHeader}}</h3>
      </div>
      <div style="display: table-cell; width: 1px">
        <slot name="tooltip-content"></slot>
      </div>
    </div>
  </v-popover>`
});
*/