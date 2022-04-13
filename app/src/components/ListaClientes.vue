<template>
  <div class="lista-clientes-container">
    <b-table class="lista-clientes" striped hover 
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
  
  name: "ListaClientes",
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
      fields : ["codigo", "nombre", "documento", "direccion", "telefono", "celular"],
      //selected : null,
    };
  },
  mounted() {
    const listElm = document.querySelector('.lista-clientes');
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
    more() {
      let headers = {
        "token": sessionStorage.getItem("token-user")
      };
      let params = {
        "q": this.query,
        "page": this.page,
        "limit": this.size
      };
      axios.get(localStorage.getItem("url") + "venta/clientes", {headers, params} ).then(response => { 
          //console.log(response.data);
          if(response.data.success){
            //console.log(response.data.clientes);
            const itemsCopy = [].slice.call(this.items);
            response.data.clientes.forEach(cliente => {
              //console.log(cliente);
              itemsCopy.push(cliente);  
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
    buscarClientes() {
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
