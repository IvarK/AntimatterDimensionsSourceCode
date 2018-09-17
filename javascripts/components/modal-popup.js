Vue.component('modal-popup', {
    props: ['view', 'model'],
    template:
        '<div v-if="view.modal" class="modal savemenu" style="display: flex">\
            <div :is="view.modal" v-model="view.modal" :model="model"/>\
        </div>'
});

var modalUnlocksMixin = {
    computed: {
        player: function() {
            return this.model.player;
        },
        dilationUnlocked() {
            return !this.player.dilation.tachyonParticles.eq(0) || this.player.realities !== 0;
        },
        realityUnlocked() {
            return this.player.realities !== 0;
        }
    }
};

Vue.component('modal-animation-options', {
    mixins: [modalUnlocksMixin],
    props: ['value', 'model'],
    template:
        '<div class="options options-modal">\
            <primary-button class="closebtn" @click="emitInput(undefined)">&times;</primary-button>\
            <primary-named-on-off text="Floating text:" v-model="options.floatingText"></primary-named-on-off>\
            <primary-named-on-off v-if="bigCrunchUnlocked" text="Big crunch:" v-model="options.bigCrunch"></primary-named-on-off>\
            <primary-named-on-off v-if="dilationUnlocked" text="Tachyon particles:" v-model="options.tachyonParticles"></primary-named-on-off>\
            <primary-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></primary-named-on-off>\
        </div>',
    computed: {
        options: function () {
            return this.player.options.animations;
        },
        bigCrunchUnlocked: function() {
            return this.player.infinitied !== 0 || this.player.eternities !== 0 || this.player.realities !== 0;
        }
    }
});

Vue.component('modal-confirmation-options', {
    mixins: [modalUnlocksMixin],
    props: ['value', 'model'],
    template:
        '<div class="options options-modal">\
            <primary-button class="closebtn" @click="emitInput(undefined)">&times;</primary-button>\
            <primary-named-on-off text="Challenges:" v-model="options.challenges"></primary-named-on-off>\
            <primary-named-on-off v-if="eternityUnlocked" text="Eternity:" v-model="options.eternity"></primary-named-on-off>\
            <primary-named-on-off v-if="dilationUnlocked" text="Dilation:" v-model="options.dilation"></primary-named-on-off>\
            <primary-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></primary-named-on-off>\
        </div>',
    computed: {
        options: function() {
            return this.player.options.confirmations;
        },
        eternityUnlocked() {
            return this.player.eternities !== 0 || this.player.realities !== 0;
        }
    }
});