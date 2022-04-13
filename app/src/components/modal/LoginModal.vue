<template>
    <b-modal
      id="login-modal"
      ref="modal"
      title="Datos de Autenticación"
      @show="resetModal"
      @hidden="onHidenModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Usuario"
          label-for="alias-input"
          invalid-feedback="El alias es requerido"
          :state="aliasState"
        >
          <b-form-input
            id="alias-input"
            ref="focusThis"
            v-model="alias"
            :state="aliasState"
            placeholder="Nombre de Usuario (Alias)"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Clave"
          label-for="clave-input"
          invalid-feedback="La clave es requerida"
          :state="claveState"
        >
          <b-form-input
            type="password"
            id="clave-input"
            v-model="clave"
            :state="claveState"
            @keyup.enter="handleOk"
            placeholder="Clave de Acceso"
            required
          ></b-form-input>
        </b-form-group>

      </form>
    </b-modal>
</template>

<script>
  import axios from 'axios';
  import EventBus from '../../bus';

  export default {
    
    data() {
      return {
        alias: '',
        aliasState: null,
        clave: '',
        claveState: null,
        error: false
      }
    },
    methods: {
      checkFormValidity() {
        let valid = this.$refs.form.checkValidity();
        this.aliasState = valid;
        this.claveState = valid;
        console.log("this.error", this.error);
        if (this.error) {
          valid = false;
        }
        return valid;
      },
      resetModal() {
        this.alias = ''
        this.clave = ''
      },
      onHidenModal() {
        //Si se cierra y no ha logueado al usuario.
        if (!sessionStorage.getItem("token-user")) {
          this.$bvModal.show('login-modal');
        }
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        this.error = false;
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
        
        this.responseAvailable = false;
        
        let headers = {
          "token": localStorage.getItem("token-api"),
          "alias": this.alias,
          "clave": this.clave
        };

        axios.get(localStorage.getItem("url") + "auth/login", {headers} ).then(response => { 
          if(response.data.success){
            sessionStorage.setItem("token-user", response.data.token_user);
            
//            let tokenData = this.$jwtDec.decode(response.data.token_user);

            sessionStorage.setItem("name-user", response.data.user['nombre']);
            sessionStorage.setItem("alias-user", response.data.user['alias']);
            sessionStorage.setItem("isAdmin-user", response.data.user['isAdmin']);
            
            //Luego de Loguearse el Usuario
            //Mismo codigo en Principal.vue:mounted
            this.cerrarModal();
            this.$toast.success('Autenticado con Exito', {
              position: 'top'
            });

            EventBus.$emit('on-login');
          } else{
            if (response.data.error == 'Token API Inválida') {
              this.$toast.error('Token API Inválida. Vuelva a Ingresarlo', {
                position: 'top'
              });
              localStorage.removeItem('token-api');
              localStorage.removeItem('url');
              this.$bvModal.hide('login-modal');
              this.$bvModal.show('connection-modal');
            } else {
              console.log(response.data.error);
              this.error = true;
              this.$toast.error(response.data.error, {
                position: 'top'
              });
            }
          }                
        }).catch(err => {
          console.log(err);
          this.error = true;
          this.$toast.error('Error de Servidor', {
            position: 'bottom'
          });
        });

      },
      handleSubmit() {},
      cerrarModal() {
        // Exit when the form isn't valid
        console.log("!this.checkFormValidity()", !this.checkFormValidity());
        if (!this.checkFormValidity()) {
          return;
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('login-modal')
        });
      },
      focusMyElement() {
        this.$refs.focusThis.focus();

        //Preguntar por las dudas si existe Token API, ya que se pudo haber limpiado el navegador
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
