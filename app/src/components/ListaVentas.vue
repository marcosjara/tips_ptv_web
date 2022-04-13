<template>
  <div class="lista-ventas-container">
    <b-table class="lista-ventas" striped hover 
            :items="items" 
            :fields="fields" 
            sticky-header="true"
            selectable
            @row-selected="onRowSelected"
      >
      <template #cell(actions)="row">
        <b-button size="sm" @click="imprimir(row.item.numero)" class="mr-1">
          Imprimir
        </b-button>
      </template>

      </b-table>
  </div>

</template>

<script>
import axios from 'axios';
import EventBus from '../bus';

export default {
  
  name: "ListaVentas",
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
      //fields : ["numero", "fecha", "cliente_nombre", "monto_total"],
      fields: [
        { key: 'numero', label: 'Código', sortable: false, sortDirection: 'desc' },
        { key: 'fecha', label: 'Descripción', sortable: false, class: 'text-left',
        // eslint-disable-next-line no-unused-vars
        formatter: (value, key, item) => {
            return new Date(value).toISOString().substring(0, 19);
          }
        },
        { key: 'cliente_nombre', label: 'Cantidad', sortable: false, class: 'text-right' },
        { key: 'monto_total', label: 'Total', sortable: false, class: 'text-right', 
          formatter: (value) => {
            return this.$options.filters.toCurrency(value);
          }
        },
        
        { key: 'actions', label: 'Acciones' }
      ],
      //selected : null,
    };
  },
  mounted() {
    const listElm = document.querySelector('.lista-ventas');
      listElm.addEventListener('scroll', () => {
        //console.log(e);
        if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
          this.page++;
          this.more();
        }
      });
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    imprimir(numero) {
      EventBus.$emit('venta-imprimir', numero)
    },
    onRowSelected(items) {
      //console.log(items[0]);
      //this.selected = items[0];
      this.$emit('select', items[0]);

    },
    more() {
      let headers = {
        "token": sessionStorage.getItem("token-user")
      };
      let params = {
        "q": this.query,
        "page": this.page,
        "limit": this.size
      };
      axios.get(localStorage.getItem("url") + "venta/ventas", {headers, params} ).then(response => { 
          //console.log(response.data);
          if(response.data.success){
            //console.log(response.data.ventas);
            const itemsCopy = [].slice.call(this.items);
            response.data.ventas.forEach(venta => {
              //console.log(venta);
              itemsCopy.push(venta);  
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
    buscarVentas() {
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
