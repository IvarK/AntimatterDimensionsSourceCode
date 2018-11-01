Vue.component('modal-message', {
    props: ['view'],
    template:
        '<div class="modal-message">\
            <div v-html="view.modal.message"/>\
            <primary-button @click="emitClose">Okay</primary-button>\
        </div>'
});