<template>
    <b-modal
      id="cambio-lote-modal"
      ref="modal"
      title="Cambio de Lote"
      @show="resetModal"
      @hidden="onHidenModal"
      @ok="handleOk"
      @shown="focusMyElement" 
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <b-form-group
          label="Producto"
          label-for="nombre-producto"
        >
          <b-form-input
            id="nombre-producto"
            v-model="lastVentaItem.descripcion"
            :disabled = true
            placeholder="Producto"
          ></b-form-input>
        </b-form-group>
        
        <b-form-group
          label="Lote"
          label-for="alias-input"
          invalid-feedback="El Lote es requerido" >
           <vue-bootstrap-typeahead
            :data="lotes"
            ref="lote"
            :minMatchingChars=0
            v-model="loteSearch"
            :serializer="s => s.nombre"
            placeholder="Digite el Lote..."
            @hit="onSelectLote"
            @click="onSelectLote"
          ></vue-bootstrap-typeahead>
        </b-form-group>

        <b-form-group
          label="Stock"
          label-for="stock-producto"
        >
          <b-form-input
            id="stock-producto"
            v-model="stockProducto"
            :disabled = true
            placeholder="Stock"
          ></b-form-input>
        </b-form-group>

      </form>
    </b-modal>
</template>

<script>
  import axios from 'axios';
  import EventBus from '../../bus';

  export default {
   
    mounted() {
      this.nombreUsuario = sessionStorage.getItem('name-user')
      this.$nextTick(function () {
        //this.inicializarCampos();
      });
    },
    data() {
      return {

        lotes: [],
        loteSearch: '',
        selectedLote: null,
        lastVentaItem : EventBus.lastVentaItem ? EventBus.lastVentaItem : {},
        loteSeleccionado : {},
        stockProducto : 0
      }
    },
    computed: {
      
    },
    watch: {
      loteSearch(){
        this.buscarLotes();
      },
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.configState = valid;
        return valid;
      },
      resetModal() {
        this.loteSearch = '';
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
        
        this.responseAvailable = false;
        this.$emit('producto_cambio_lote', this.lastVentaItem, this.selectedLote);
      },
      buscarLotes() {
        let headers = {
          "token": sessionStorage.getItem("token-user")
        };
        let params = {
          "q": this.loteSearch
        };
        axios.get(localStorage.getItem("url") + "stock/lotes/" + this.lastVentaItem.codigo, {headers, params} ).then(response => { 
            if(response.data.success){
              this.lotes = response.data.lotes;
                  
            } else{
              console.log(response.data.error);
              this.error = true;
              this.$toast.error(response.data.error, {
                position: 'top'
              });
            }                
        }).catch(err => {
            console.log(err);
        });
      },
     onSelectLote(e){
        this.selectedLote = e; 
        this.loteSeleccionado = this.selectedLote;
        this.stockProducto = this.loteSeleccionado.stock;

      },
      onHidenModal() {
        //Si se cierra y no ha cargado todos los datos.
        //OBS: Misma validacion que está en principal
/*        if (!localStorage.getItem("cliente") || !localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("lote") || !localStorage.getItem("cajero") || !localStorage.getItem("formatoComprobante")) {
          this.$bvModal.show('cambio-lote-modal');
        }*/
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('cambio-lote-modal');
        })
      },
      focusMyElement() {
        this.$nextTick(function () {
          this.inicializarCampos();
        });
      },
      inicializarCampos() {
        this.lastVentaItem = EventBus.lastVentaItem;

        this.selectedLote = {
          codigo : this.lastVentaItem.lote_codigo,
          nombre : this.lastVentaItem.lote_nombre,
        };

        this.$refs.lote.inputValue = this.selectedLote?.nombre;

        //this.stockProducto = EventBus.lastVentaItem.stock;
        this.stockProducto = 0;
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

.display-none {
  display: none;
}
.display-block {
  display: block;
}
</style>
