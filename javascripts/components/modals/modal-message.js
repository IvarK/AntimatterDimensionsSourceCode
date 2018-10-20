Vue.component('modal-message', {
    props: ['view'],
    template:
        '<div class="modal-message">\
            <div v-html="view.modal.message"/>\
            <store-button @click="emitClose">Okay</store-button>\
        </div>'
});