<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CloudManualLoginModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      email: "",
      pass: "",
      error: false,
      errorMessage: ""
    };
  },
  computed: {
    inputIsValid(){
      return /\S+@\S+\.\S+/.test(this.email) && this.pass.length >= 6
    }
  },
  methods: {
    textEntry(){
      this.error = false;
      this.errorMessage = "";
    },
    async login(){
      try{
        await Cloud.manualCloudCreate(this.email,this.pass);
      }catch(e){
        console.log(e);
        try{
          await Cloud.manualCloudLogin(this.email, this.pass)
        }catch(LoginError){
          this.error = true;
          this.errorMessage = "Unable to login, please recheck email/password";
          return;
        }
      }
      this.emitClose();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice 
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      Cloud Login/Create
    </template>
    <div style="text-align:right">
    <span>Email Address:  </span>
    <input
      ref="email"
      v-model="email"
      type="text"
      @keypress="textEntry"
      @keyup.esc="emitClose"
    ><br>
    <span>Password:  </span>
    <input
      ref="pass"
      v-model="pass"
      type="password"
      @keypress="textEntry"
      @keyup.esc="emitClose"
    >
    </div>
    <div 
      ref="showError"
      v-if="error"
    >
      {{errorMessage}}
    </div>
    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="login"
    >
      Login/Join
    </PrimaryButton>
  </ModalWrapperChoice>
</template>
