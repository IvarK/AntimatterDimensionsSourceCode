// So this one looks different. What we achieve here is basically
// <div class="l-game-tab">
//   <div class="l-game-tab__inner">
//     <slot class="l-game-tab__content"/>
//   </div>
//   <footer-links class="l-game-tab__footer"/>
// </div>
// The main idea is that l-game-tab__inner takes all available space, so l-game-tab__footer is always on bottom.
// But why render function? The problem is that one cannot pass classes straight to slots,
// and given that $slots.default is an array, we need to manually patch them with l-game-tab__content

Vue.component('game-tab', {
  render: function (createElement) {
    const renderResult = createElement(
      "div", { class: { "l-game-tab": true } },
      [
        createElement(
          "div", { class: { "l-game-tab__inner": true } },
          this.$slots.default
        ),
        createElement(
          "footer-links", { class: { "l-game-tab__footer": true } }
        )
      ]
    );
    if (!this.$slots.default) return renderResult;
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
    return renderResult;
  }
});