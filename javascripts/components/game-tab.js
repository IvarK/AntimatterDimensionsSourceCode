// So this one looks different. What we achieve here is basically
// <div class="l-game-tab">
//   <slot class="l-game-tab__content"/>
//   <footer-links class="l-game-tab__footer"/>
// </div>
// But the problem is that one cannot pass classes straight to slots, and given that
// $slots.default is an array, we need to manually patch them with l-game-tab__content

Vue.component('game-tab', {
  render: function (createElement) {
    for (let slot of this.$slots.default) {
      let staticClass = String.empty;
      if (!slot.data) {
        slot.data = {};
      }
      if (slot.data.staticClass) {
        staticClass = slot.data.staticClass;
      }
      slot.data.staticClass = staticClass + " l-game-tab__content";
    }
    return createElement(
      "div", { class: { "l-game-tab": true } },
      [
        this.$slots.default,
        createElement(
          "footer-links", { class: { "l-game-tab__footer": true } }
        )
      ]
    );
  }
});