<template>
    <b-modal
      id="connection-modal"
      ref="modal"
      title="Datos de Conexión"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Token API"
          label-for="token-input"
          invalid-feedback="El token es requerido"
          :state="tokenState"
        >
          <b-form-input
            id="token-input"
            ref="focusThis"
            v-model="token"
            :state="tokenState"
            placeholder="Pegar el Token"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
</template>

<script>
  import EventBus from '../../bus';

  export default {
    
    data() {
      return {
        token: '',
        tokenState: null,
      }
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.tokenState = valid
        return valid;
      },
      resetModal() {
        this.token = ''
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
        
        console.log("token", this.token);
        let tokenData = this.$jwtDec.decode(this.token);
        localStorage.setItem("token-api", this.token);
        localStorage.setItem("url", tokenData["url"]);

        this.$bvModal.show('login-modal');
        EventBus.$emit('connection-entablished');

      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('connection-modal')
        })
      },
      focusMyElement() {
        this.$refs.focusThis.focus()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
