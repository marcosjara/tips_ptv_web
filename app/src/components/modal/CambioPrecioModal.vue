<template>
    <b-modal
      id="cambio-precio-modal"
      ref="modal"
      title="Cambio de Precio"
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
          label="Tipo Precio"
          label-for="alias-input"
          invalid-feedback="El Tipo de Precio es requerido" >
           <vue-bootstrap-typeahead
            :data="tiposPrecios"
            ref="tipoPrecio"
            :minMatchingChars=0
            v-model="tipoPrecioSearch"
            :serializer="s => s.descripcion"
            placeholder="Digite el Tipo de Precio..."
            @hit="onSelectTipoPrecio"
            @click="onSelectTipoPrecio"
          ></vue-bootstrap-typeahead>
        </b-form-group>

        <b-form-group
          label="Precio"
          label-for="precio-producto"
        >
          <b-form-input
            id="precio-producto"
            v-model="precioVenta"
            :disabled = true
            placeholder="Precio"
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

        tiposPrecios: [],
        tipoPrecioSearch: '',
        selectedTipoPrecio: null,
        lastVentaItem : EventBus.lastVentaItem ? EventBus.lastVentaItem : {},
        tipoPrecioSeleccionado : {},
        precioVenta : 0
      }
    },
    computed: {
      
    },
    watch: {
      tipoPrecioSearch(){
        this.buscarTiposPrecios();
      },
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.configState = valid;
        return valid;
      },
      resetModal() {
        this.tipoPrecioSearch = '';
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        //this.handleSubmit();
        
        this.responseAvailable = false;

        //Esta parte se puede componentizar, para los otros casos, con promesa o callback
        const settings = JSON.parse(localStorage.getItem("settings"));
        const isAdmin = parseInt(sessionStorage.getItem("isAdmin-user"));

        if (settings['stock.ptv.cambio_tipo_precio_restringido'] && settings['stock.ptv.cambio_tipo_precio_restringido'] === "true") {
          if (isAdmin == 1) {
            //Si es Administrador abre directo
            this.handleSubmit();
            this.$emit('producto_cambio_precio', this.lastVentaItem, this.selectedTipoPrecio);
          } else {
            //Si no es Admministrador.
            EventBus.$on('operacion-restringida-accepted', this.usuarioRestringidoAceptadoEventFunction);
            
            this.$bvModal.show('operacion-restringida-modal');

          }
        } else {
          this.handleSubmit();
          this.$emit('producto_cambio_precio', this.lastVentaItem, this.selectedTipoPrecio);
        }
        
      },
      usuarioRestringidoAceptadoEventFunction(user) {
        console.log("******************* acceso restringido aceptado con el usuario ", user);
        
        this.handleSubmit();
        this.$emit('producto_cambio_precio', this.lastVentaItem, this.selectedTipoPrecio);

        //Retirar el Listener
        EventBus.$off('operacion-restringida-accepted', this.usuarioRestringidoAceptadoEventFunction);

      },
      buscarTiposPrecios() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          "alias": this.alias,
          "clave": this.clave
        };
        let params = {
          "q": this.tipoPrecioSearch
        };
        axios.get(localStorage.getItem("url") + "stock/tipos-precios/" + this.lastVentaItem.codigo, {headers, params} ).then(response => { 
            if(response.data.success){
              this.tiposPrecios = response.data.tipos_precios;
                  
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
     onSelectTipoPrecio(e){
        this.selectedTipoPrecio = e; 
        //localStorage.setItem("tipoPrecio", JSON.stringify(this.selectedTipoPrecio)); 
        this.tipoPrecioSeleccionado = this.selectedTipoPrecio;
        this.precioVenta = this.tipoPrecioSeleccionado.precio_venta;
      },
      onHidenModal() {
        //Si se cierra y no ha cargado todos los datos.
        //OBS: Misma validacion que está en principal
/*        if (!localStorage.getItem("cliente") || !localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("tipoPrecio") || !localStorage.getItem("cajero") || !localStorage.getItem("formatoComprobante")) {
          this.$bvModal.show('cambio-precio-modal');
        }*/
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('cambio-precio-modal');
        })
      },
      focusMyElement() {
        this.$nextTick(function () {
          this.inicializarCampos();
        });
      },
      inicializarCampos() {
        this.lastVentaItem = EventBus.lastVentaItem;

        this.selectedTipoPrecio = {
          'codigo' : this.lastVentaItem.tipo_precio_codigo,
          'descripcion' : this.lastVentaItem.tipo_precio_descripcion,
          'precio_venta' : EventBus.lastVentaItem.precio
        };
        
        this.$refs.tipoPrecio.inputValue = this.selectedTipoPrecio?.descripcion;

        this.precioVenta = EventBus.lastVentaItem.precio;
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
