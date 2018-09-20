Vue.component('tab-container', {
  props: ['stickyFooter'],
  template:
    '<div align="center">\
      <br>\
      <slot></slot>\
      <footer-links :sticky="stickyFooter"></footer-links>\
    </div>'
});