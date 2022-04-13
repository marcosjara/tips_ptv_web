<template>
    <b-modal
      id="consultar-ventas-modal"
      ref="modal"
      size="xl"
      title="Consulta de Ventas"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Buscar venta"
          label-for="filter-input"
          invalid-feedback="El Filtro es requerido"
          :state="filterState"
        >
          <b-form-input
            id="filter-input"
            ref="focusThis"
            v-model="filter"
            :state="filterState"
            @keydown.enter="invokeBuscarVentas()"
            placeholder="Numero, Nombre del Cliente, etc."
            required
          ></b-form-input>
        </b-form-group>
      </form>
      
      <lista-ventas :query="filter" ref="listaVentas" @select="ventaSelect"></lista-ventas>

    </b-modal>
</template>

<script>
  import ListaVentas from '../ListaVentas.vue';
  
  export default {
  components: { ListaVentas },
    
    data() {
      return {
        filter: '',
        filterState: null,
        ventaSelected : null
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
          //this.$bvModal.hide('consultar-ventas-modal');
        })
      },
      focusMyElement() {
        this.$refs.focusThis.focus();

        //this.buscarVentas();
        this.invokeBuscarVentas();
        
      },
      invokeBuscarVentas() {
        this.$refs.listaVentas.buscarVentas();
      },
      ventaSelect(ventaSelected) {
        console.log("venta select", ventaSelected.numero);
        this.$bvModal.hide('consultar-ventas-modal');
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
