Vue.component('modal-options', {
    props: {
        closeButton: Boolean
    },
    template:
    '<div class="modal-options">\
        <modal-close-button v-if="closeButton" @click="emitClose"></modal-close-button>\
        <slot></slot>\
    </div>'
});

Vue.component('modal-close-button', {
    template:
        '<store-button class="closebtn" @click="emitClick">&times;</store-button>'
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
    props: ['model'],
    template:
        '<modal-options @close="emitClose" :closeButton="true" class="options-container">\
            <store-button-named-on-off text="Floating text:" v-model="options.floatingText"></store-button-named-on-off>\
            <store-button-named-on-off v-if="bigCrunchUnlocked" text="Big crunch:" v-model="options.bigCrunch"></store-button-named-on-off>\
            <store-button-named-on-off v-if="dilationUnlocked" text="Tachyon particles:" v-model="options.tachyonParticles"></store-button-named-on-off>\
            <store-button-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></store-button-named-on-off>\
        </modal-options>',
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
    props: ['model'],
    template:
        '<modal-options @close="emitClose" :closeButton="true" class="options-container">\
            <store-button-named-on-off text="Challenges:" v-model="options.challenges"></store-button-named-on-off>\
            <store-button-named-on-off v-if="eternityUnlocked" text="Eternity:" v-model="options.eternity"></store-button-named-on-off>\
            <store-button-named-on-off v-if="dilationUnlocked" text="Dilation:" v-model="options.dilation"></store-button-named-on-off>\
            <store-button-named-on-off v-if="realityUnlocked" text="Reality:" v-model="options.reality"></store-button-named-on-off>\
        </modal-options>',
    computed: {
        options: function() {
            return this.player.options.confirmations;
        },
        eternityUnlocked() {
            return this.player.eternities !== 0 || this.player.realities !== 0;
        }
    }
});