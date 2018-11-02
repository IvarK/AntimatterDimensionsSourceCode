Vue.component('tab-container', {
  props: ['stickyFooter'],
  template:
    `<div class="l-flex-expand" align="center">
      <div class="l-flex-expand">
        <slot></slot>
      </div>
      <footer-links></footer-links>
    </div>`
});