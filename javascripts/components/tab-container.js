Vue.component('tab-container', {
  props: ['stickyFooter'],
  template:
    `<div class="l-flex-expand" align="center">
      <div class="l-flex-expand">
        <slot/>
      </div>
      <footer-links/>
    </div>`
});