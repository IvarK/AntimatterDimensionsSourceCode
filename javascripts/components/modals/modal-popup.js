Vue.component('modal-popup', {
    props: ['view', 'model'],
    template:
        '<div class="modal savemenu" style="display: flex">\
            <div :is="view.modal.current" @close="emitClose" :model="model"/>\
        </div>'
});