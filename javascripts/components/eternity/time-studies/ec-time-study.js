Vue.component("ec-time-study", {
  props: {
    setup: Object
  },
  template:
    `<time-study :setup="setup" class="o-time-study--eternity-challenge">
      Eternity Challenge {{setup.study.id}}
    </time-study>`
});