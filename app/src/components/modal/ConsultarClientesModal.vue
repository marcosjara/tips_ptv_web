<template>
    <b-modal
      id="consultar-clientes-modal"
      ref="modal"
      size="xl"
      title="Consulta de Clientes"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Buscar cliente"
          label-for="filter-input"
          invalid-feedback="El Filtro es requerido"
          :state="filterState"
        >
          <b-form-input
            id="filter-input"
            ref="focusThis"
            v-model="filter"
            :state="filterState"
            @keydown.enter="invokeBuscarClientes()"
            placeholder="Nombre del Cliente, Documento, etc."
            required
          ></b-form-input>
        </b-form-group>
      </form>
      
      <lista-clientes :query="filter" ref="listaClientes" @select="clienteSelect"></lista-clientes>

    </b-modal>
</template>

<script>
  import ListaClientes from '../ListaClientes.vue';
  import EventBus from '../../bus';

  export default {
  components: { ListaClientes },
    
    data() {
      return {
        filter: '',
        filterState: null,
        clienteSelected : null
      }
    },
    mounted() {
      // Detect when scrolled to bottom.
      
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.filterState = valid;
        return valid;
      },
      resetModal() {
        this.filter = '';
      },

      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
        
        //console.log("token", this.token);
        //let tokenData = this.$jwtDec.decode(this.token);
        //localStorage.setItem("token-api", this.token);
        //localStorage.setItem("url", tokenData["url"]);

        //this.$bvModal.show('login-modal');
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return;
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          //this.$bvModal.hide('consultar-clientes-modal');
        })
      },
      focusMyElement() {
        this.$refs.focusThis.focus();

        //this.buscarClientes();
        this.invokeBuscarClientes();
        
      },
      invokeBuscarClientes() {
        this.$refs.listaClientes.buscarClientes();
      },
      clienteSelect(clienteSelected) {
        EventBus.$emit('cliente-select', clienteSelected);
        this.$bvModal.hide('consultar-clientes-modal');
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
