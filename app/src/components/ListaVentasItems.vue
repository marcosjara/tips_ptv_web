<template>
  <div class="lista-ventas-items-container">
    <b-table 
    class="lista-ventas-items" 
    striped hover 
    :items="items" 
    :fields="fields" 
    selectable 
    select-mode="single"
    sticky-header="true" 
    @row-selected="onRowSelected">

      <template #cell(actions)="row">
        <b-button size="sm" @click="borrarConfirmar(row.item, row.index)" class="mr-1">
          Borrar
        </b-button>
      </template>
    </b-table>
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" @ok="borrar">
      {{ infoModal.content }}
    </b-modal>
  </div>

</template>

<script>
//import Factura from "./Factura.vue";
import axios from 'axios';

export default {
  name: "ListaVentasItems",
  props : {
    items : Array
  },
  components: {
    //Factura,

  },
  data() {
    return {
      fields: [
        { key: 'codigo_barras', label: 'Código', sortable: false, sortDirection: 'desc' },
        { key: 'descripcion', label: 'Descripción', sortable: false, class: 'text-left', 
          formatter: (value, key, producto) => {
            //console.log(value, key, producto); 
            let ds = value;
            if (producto.lote_codigo && producto.lote_codigo > 0) {
              ds += ' (' + producto.lote_nombre + ')';
            }

            return ds;
          } 
        },
        { key: 'cantidad', label: 'Cantidad', sortable: false, class: 'text-right' },
        { key: 'bruto', label: 'Precio', sortable: false, class: 'text-right', 
          formatter: (value) => {
            return this.$options.filters.toCurrency(value);
          }
       },
        { key: 'subtotal', label: 'Sub-total', sortable: false, class: 'text-right', 
          formatter: (value) => {
            return this.$options.filters.toCurrency(value);
          }
       },
        
        { key: 'actions', label: 'Acciones' }
      ],
      infoModal: {
          id: 'ventas-item-borrar',
          title: '',
          content: '',
          item: null,
          index: null
        }
    };
  },
  mounted() {
    
  },
  methods: {
    loadVentasItems(ventaId) {
      let headers = {
          "token": sessionStorage.getItem("token-user")
        };
        let params = {
          "ventaId": ventaId
        };
        axios.get(localStorage.getItem("url") + "venta/ventas-items-by-numero", {headers, params} ).then(response => { 
          console.log(response.data);
          if(response.data.success){
            console.log("this.items antes de agregar", this.items);
            const itemsCopy = [].slice.call(this.items);
            response.data.ventas_items.forEach(venta => {
              //console.log(venta);
              itemsCopy.push(venta);  
            });
            this.items = itemsCopy;
            //console.log("this.items", this.items);
          } else{
            console.log(response);
          }                
      }).catch(err => {
          console.log(err);
      });      
    },
    /*
    * Un click selecciona, el otro deselecciona
    */
    // eslint-disable-next-line no-unused-vars
    onRowSelected(items, index) {
      //console.log(items, index);
      //this.selected = items[0];
      //if (items && items[0]) {
        this.$emit('producto_selected', items[0]);
      //}
    },
    borrarConfirmar(item, index) {
      this.infoModal.title = 'Confirma Borrar?';
      this.infoModal.content = 'Está seguro de Quitar el Producto ' + item.codigo + ' - ' + item.descripcion + '?';
      this.infoModal.item = item;
      this.infoModal.index = index;
      this.$root.$emit('bv::show::modal', this.infoModal.id);
    },
    // eslint-disable-next-line no-unused-vars
    borrar(bvModalEvt) {
      
      this.$emit('producto_deleted', this.infoModal.item, this.infoModal.index);
    },
    cerrarModal() {
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('forma-cobro-modal')
      });
    },
    focusMyElement() {
      this.$refs.focusThis.focus();
    },
    buttonClick(number) {
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
    },
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


</style>
