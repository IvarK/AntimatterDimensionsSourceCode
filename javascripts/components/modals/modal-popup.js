Vue.component('modal-popup', {
    props: ['view', 'model'],
    template:
        '<div class="modal">\
            <div :is="view.modal.current" @close="emitClose" :model="model" :view="view"/>\
        </div>'
});