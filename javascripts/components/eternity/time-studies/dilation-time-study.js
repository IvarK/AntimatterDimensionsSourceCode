Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  template:
    `<time-study :setup="setup" class="o-time-study--dilation">
      Dilation
    </time-study>`
});