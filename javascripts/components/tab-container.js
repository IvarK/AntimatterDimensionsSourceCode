Vue.component('tab-container', {
  props: ['stickyFooter'],
  template:
    '<div class="tab-container" align="center">\
      <br>\
      <slot></slot>\
      <footer-links></footer-links>\
    </div>'
});