<template>
    <b-modal
      id="operacion-restringida-modal"
      ref="modal"
      title="Operación Restringida"
      @show="resetModal"
      @hidden="onHidenModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group hidden
          label="Usuario"
          label-for="alias-input"
          invalid-feedback="El alias es requerido"
          :state="aliasState"
        >
          <b-form-input
            id="alias-input"
            ref="focusThisUsuario"
            v-model="alias"
            :state="aliasState"
            placeholder="Nombre de Usuario (Alias)"
            
          ></b-form-input>
        </b-form-group>

        <b-form-group hidden
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
            
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Clave unica del Usuario"
          label-for="clave-unica-input"
          invalid-feedback="La clave Unica es requerida"
          :state="claveState"
        >
          <b-form-input
            type="password"
            id="clave-unica-input"
            ref="focusThisClaveUnica"
            v-model="claveUnica"
            :state="claveUnicaState"
            @keyup.enter="handleOk"
            placeholder="Clave unica del Usuario"
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
        claveUnica: '',
        claveUnicaState: null,
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
          this.$bvModal.show('operacion-restringida-modal');
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
          "clave": this.clave,
          "claveUnica": this.claveUnica
        };

        axios.get(localStorage.getItem("url") + "auth/login-clave-unica", {headers} ).then(response => { 
          this.claveUnica = '';
          if(response.data.success){
            //console.log("response.data.user", response.data.user);
            if (parseInt(response.data.user.isAdmin) != 1) {
              this.$toast.error('Usuario debe ser Administrador', {
                position: 'top'
              });
              return;
            }

            this.cerrarModal();

            localStorage.setItem('alias-administrador', response.data.user.alias);  //Para uso futuro
            EventBus.$emit('operacion-restringida-accepted', response.data.user);

          } else{
            console.log(response.data.error);
            this.error = true;
            this.$toast.error(response.data.error, {
              position: 'top'
            });
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
        //console.log("!this.checkFormValidity()", !this.checkFormValidity());
        if (!this.checkFormValidity()) {
          return;
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('operacion-restringida-modal')
        });
      },
      focusMyElement() {
        this.$refs.focusThisClaveUnica.focus();
        if (localStorage.getItem("alias-administrador")) {
          this.alias = localStorage.getItem("alias-administrador");
        }
        
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
