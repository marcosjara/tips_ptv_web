<template>
  <div class="lista-productos-container">
    <b-table class="lista-productos" striped hover 
            :items="items" 
            :fields="fields" 
            sticky-header="true"
            selectable
            @row-selected="onRowSelected"
      ></b-table>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  
  name: "ListaProductos",
  components: {
  },
  props : {
    query : String
  },

  data() {
    return {
      page : 1,
      size : 10,
      items: [],
      //fields : ["codigo_barras", "descripcion", "minimo", "stock", "precio"],
      fields: [
        { key: 'codigo_barras', label: 'Código', sortable: false, sortDirection: 'desc' },
        { key: 'descripcion', label: 'Descripción', sortable: false, class: 'text-left', 
          formatter: (value) => {
            //console.log(value, key, producto); 
            return value;
          }
        },
        { key: 'stock_minimo', label: 'Mínimo', sortable: false, class: 'text-right', tdClass: 'setAmountTdClass'},
        { key: 'stock', label: 'Stock', sortable: false, class: 'text-right' },
        { key: 'precio', label: 'Precio', sortable: false, class: 'text-right', 
          formatter: (value) => {
            return this.$options.filters.toCurrency(value);
          }
        }
      ],
      //selected : null,
    };
  },
  mounted() {
    const listElm = document.querySelector('.lista-productos');
      listElm.addEventListener('scroll', () => {
        //console.log(e);
        if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
          this.page++;
          this.more();
        }
      });
  },
  methods: {
    onRowSelected(items) {
      //console.log(items[0]);
      //this.selected = items[0];
      this.$emit('select', items[0]);

    },
    // eslint-disable-next-line no-unused-vars
    setAmountTdClass(value, key, producto) {
      
      if (producto.stock_minimo != 0 && producto.stock_minimo >= producto.stock && producto.no_controlar_stock != 1) {
        return 'text-red';
      } else {
        return 'text-green';
      }
      
    },
    more() {
      let headers = {
        "token": sessionStorage.getItem("token-user")
      };
      let params = {
        "q": this.query,
        "page": this.page,
        "limit": this.size,
        "agrupacionId": (localStorage.getItem("agrupacion") ? JSON.parse(localStorage.getItem("agrupacion")).codigo : null),
        "depositoId": (localStorage.getItem("deposito") ? JSON.parse(localStorage.getItem("deposito")).codigo : null),
        "tipoPrecioId": (localStorage.getItem("tipoPrecio") ? JSON.parse(localStorage.getItem("tipoPrecio")).codigo : null),
      };
      
      axios.get(localStorage.getItem("url") + "stock/productos", {headers, params} ).then(response => { 
          //console.log(response.data);
          if(response.data.success){
            //console.log(response.data.productos);
            const itemsCopy = [].slice.call(this.items);
            response.data.productos.forEach(producto => {
              
              if (producto.stock_minimo != 0 && producto.stock_minimo >= producto.stock && producto.no_controlar_stock != 1) {
                //producto._rowVariant = 'danger';
              }
              itemsCopy.push(producto);  
            });
            this.items = itemsCopy;
            //console.log("this.items", this.items);
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
    buscarProductos() {
      this.page = 1;
      this.items = [];
      this.more();      
    },
  
  },
  computed: {
    
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
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
.text-red {
  color: red ;
}

.text-green {
  color: green;
}
</style>
