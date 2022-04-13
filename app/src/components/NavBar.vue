<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" :sticky="true">
    <b-navbar-brand href="#">{{nombreEmpresa || 'Mi Empresa'}}
      <div class="font-small">{{aliasUsuario}} - {{cajeroUsuario}} - {{version}}</div>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav >
        <b-nav-item href="#" class="custom-b-nav-item" @click="$emit('onNuevo')">Nuevo</b-nav-item>
      </b-navbar-nav>
      
    </b-collapse>
    <b-navbar-brand href="#" right><span class="total">{{ montoTotal | toCurrency}}</span></b-navbar-brand>

  </b-navbar>

</template>

<script>
//import Factura from "./Factura.vue";

export default {
  name: "NavBar",
  props : {
    version : String,
    montoTotal : Number,
    nombreEmpresa : String
  },
  components: {
    //Factura,

  },
  mounted() {
    this.aliasUsuario = sessionStorage.getItem('alias-user');
    if (localStorage.getItem('cajero')) {
      this.cajeroUsuario = JSON.parse(localStorage.getItem('cajero')).nombre;
    }
    
    
  },
  data() {
    return {
      aliasUsuario : '',
      cajeroUsuario : ''
    };
  },

  methods: {

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

.total {
  font-size: 2em;
}

.font-small {
  font-size: xx-small;
}

.custom-b-nav-item {
  background-color: rgba(231, 229, 229, 0.5);
}
</style>
