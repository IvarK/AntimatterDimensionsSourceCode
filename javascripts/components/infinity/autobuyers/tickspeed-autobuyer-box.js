Vue.component("tickspeed-autobuyer-box",{
  data: function() {
    return {

    };
  },
  computed: {
    autobuyer: function() {
      return Autobuyer.tickspeed;
    },
    boxSetup: function() {
      return new AutobuyerBoxSetup("Tickspeed Autobuyer", this.autobuyer);
    },
  },
  methods: {
    update() {
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
    </autobuyer-box>`
});