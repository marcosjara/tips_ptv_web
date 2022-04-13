<template>
<b-row class="m-2">
  <b-col class="w-80 " >
    <b-form-input
        id="_index"
        type="text"
        ref="_index"
        v-model="index"
        class="display-none"
      ></b-form-input>

   <b-form-group>
      <label for="codigo">Código:</label>
      <b-form-input
        id="codigo"
        type="text"
        ref="codigo"
        class="mt-2"
        v-model="codigo"
        :disabled="(codigoDisabled)" 
        placeholder="Código Producto"
        @focus="$refs.codigo.select()"
        @keydown.enter="buscarProducto"
      ></b-form-input>
    </b-form-group>
    <b-tooltip show.sync="true" target="codigo" placement="top">
      <strong>F3</strong> Buscar Productos
    </b-tooltip>
  </b-col>
  
  <b-col sm="12" md="6">
    <b-form-group >
      <label for="descripcion">Descripción:</label>
      <b-form-input
        id="descripcion"
        type="text"
        ref="descripcion"
        class="mt-2"
        v-model="descripcion"
        :disabled="true"
        placeholder="Descripción del Producto"
      ></b-form-input>
    </b-form-group>
  </b-col>

  <b-col class="w-70 ">
    <b-form-group>
      <label for="cantidad">Cantidad:</label>
      <b-form-input
        id="cantidad"
        type="number"
        ref="cantidad"
        class="mt-2"
        v-model="cantidad"
        :disabled="(cantidadDisabled)"
        placeholder="Cantidad"
        @keydown.enter="updateProductoCantidad"

      ></b-form-input>
    </b-form-group>
  </b-col>
  <b-col class="w-90 ">
    <b-form-group>
      <label for="precio">Precio:</label>
      <b-form-input
        id="precio"
        type="number"
        ref="precio"
        class="mt-2"
        v-model="precio"
        :disabled="(precioDisabled)"
        placeholder="Precio"
        @keydown.enter="updateProductoPrecio"
        
      ></b-form-input>
    </b-form-group>
  </b-col>
</b-row>

</template>

<script>
import axios from 'axios';


export default {
  name: "CargaProducto",
  components: {
    //Factura,

  },
  data() {
    return {
      index : 0,
      codigo : 0,
      codigoDisabled : false,
      descripcion : '',
      cantidad : 1,
      cantidadDisabled : true,
      precioOriginal : 0,
      precio : 0,
      precioDisabled : true,
      tipoFactura: 0,
      montoFactura: 0,
      buttonsDisabled: false,
      toastTitle: "",
      toastMessage: "",
      toastVariant: "",
    };
  },
  mounted() {

  },
  methods: {
    validarBusquedaProducto(){
      if (!localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("tipoPrecio") ) {
        this.$bvModal.show('configuracion-modal');
        return false;
      }
      return true;
    },
    buscarProducto() {
      if (!this.validarBusquedaProducto()) {
        return;
      }

      let headers = {
        "token": sessionStorage.getItem("token-user")
      };
      
      let params = {
        "codigo": this.codigo,
        "depositoId": JSON.parse(localStorage.getItem("deposito")).codigo,
        "tipoPrecioId": JSON.parse(localStorage.getItem("tipoPrecio")).codigo
      };
      axios.get(localStorage.getItem("url") + "stock/producto-buscar", {headers, params} ).then(response => { 
        if(response.data.success){
          const producto = response.data.producto;
          if (producto) {
            this.tratamientoProductoASerAgregado(producto);

            //Aviso de Stock minimo
            if (producto.stock_minimo != 0 && producto.stock_minimo >= producto.stock && producto.no_controlar_stock != 1) {
              this.$toast.error(producto.descripcion + ' <b>ha alcanzado el Stock mínimo</b>', {
                position: 'top'
              });
            }

          } else {
            this.$toast.error('Producto no encontrado', {
              position: 'bottom'
            });
            this.$refs.codigo.select();
          }

          
        } else{
          console.log(response.data.error);
          this.$toast.error(response.data.error, {
            position: 'top'
          });
        }                
      }).catch(err => {
        console.log(err);
        this.$toast.error('Error de Servidor', {
          position: 'bottom'
        });
      });
    },
    truncar(montoATruncar, posicion) {
      if (montoATruncar > 0)
        montoATruncar = Math.floor(montoATruncar * Math.pow(10, posicion)) / Math.pow(10, posicion);
      else
        montoATruncar = Math.ceil(montoATruncar * Math.pow(10, posicion)) / Math.pow(10, posicion);

      return montoATruncar;
    },
    reiniciarCarga() {
      //console.log("carga reiniciada"); y el index?
      this.codigo = 0;
      this.descripcion = '';
      this.cantidad = 0;
      this.precio = 0;

      this.codigoDisabled = false;
      this.cantidadDisabled = true;
      this.precioDisabled = true;

      this.$nextTick(() => {
        this.$refs.codigo.focus();
        this.$refs.codigo.select();
      });
      

    },
    updateProductoCantidad() {
      this.precio = this.precioOriginal;  //Por si cambia el precio pero no le da ENTER, usa el precio original

      const ventaItem = {
        _index : this.index,
        codigo : this.codigo,
        cantidad : this.cantidad,
        precio : parseInt(this.precio),
        subtotal : this.cantidad * parseInt(this.precio)
      }
      
      this.$emit('producto_cantidad_updated', ventaItem);
    },
    updateProductoPrecio() {
      const ventaItem = {
        _index : this.index,
        codigo : this.codigo,
        cantidad : this.cantidad,
        precio : parseInt(this.precio),
        subtotal : this.cantidad * parseInt(this.precio)
      }
      
      this.$emit('producto_precio_updated', ventaItem);
    },
    tratamientoProductoASerAgregado(producto) {
      //console.log(producto);
      let cantidad = 1;
      if (producto.es_pesable == 1) {
        //console.log(this.codigo);
        //const extractQtyFromCodigo = this.codigo.substring();

        if (this.codigo.length == 13) {
          const codigoBarraGramo = this.codigo.substring(7, 13);//extrea del codigo de barra solo la parte del gramo							
          const NUMERO_DIVIDIR = 10000;
          cantidad = this.truncar((parseFloat(codigoBarraGramo)/NUMERO_DIVIDIR), 3);//trunca la division en 3 digitos decimales
        } else {
          this.$toast.error('Código de Barras debe tener 13 caractéres', {
            position: 'bottom'
          });
          return; //no carga el producto
        }
      }

      var tipoPrecio = JSON.parse(localStorage.getItem("tipoPrecio"));

      let ds = producto.descripcion;
      //if (producto.lote_codigo && producto.lote_codigo > 0) {
      //  ds += ' (' + producto.lote_nombre + ')';
      //}

      const ventaItem = {
        codigo : producto.codigo,
        'tipo_precio_codigo' : tipoPrecio.codigo,
        'tipo_precio_descripcion' : tipoPrecio.descripcion,
        'lote_codigo' : producto.lote_codigo,
        'lote_nombre' : producto.lote_nombre,
        referencia : producto.referencia,
        codigo_barras : producto.codigo_barras,
        descripcion : ds,
        cantidad : cantidad,
        precio : parseInt(producto.precio),
        subtotal : parseInt(producto.precio)
      }
      this.descripcion = producto.descripcion;
      this.cantidad = cantidad;
      this.precio = parseInt(producto.precio);
      
      this.$emit('producto_added', ventaItem);
    },
/*    buttonClick(number) {
      //console.log(this.$bvToast);

      if (this.montoFactura <= 0) {
        this.$refs.montoFactura.focus();
        return;
      }
      this.tipoFactura = number;
      this.buttonsDisabled = true;
      this.crearFactura();
    },
    otraFactura() {
      this.montoFactura = 0;
      this.tipoFactura = 0;

      this.$nextTick(() => {
        const mfFc = this.$refs.montoFactura;
        //mfFc.select();
        mfFc.focus();
      });

      this.buttonsDisabled = false;
    },*/
  },
  computed: {
    buttonVariant1() {
      if (this.tipoFactura != 1) {
        return "secondary";
      }
      return "primary";
    },
    buttonVariant2() {
      if (this.tipoFactura != 2) {
        return "secondary";
      }
      return "primary";
    },
    buttonVariant3() {
      if (this.tipoFactura != 3) {
        return "secondary";
      }
      return "primary";
    },
  },
};
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
</style>