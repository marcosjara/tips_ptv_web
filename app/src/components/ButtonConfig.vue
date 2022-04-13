<template>
  <b-dropdown variant="dark text-white">
    <template #button-content>
      <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
    </template>
    <b-dropdown-item-button @click="imprimir()" hidden>
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Imprimir <span class="sr-only">(Prueba de impresion)</span>
    </b-dropdown-item-button>
    <b-dropdown-item-button @click="conectar()" hidden>
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Conectar <span class="sr-only">(Clic para conectar)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="cambioPrecio()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Cambio de Precio (F2)<span class="sr-only">(Cambio de Precio)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="consultarProductos()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Productos (F3)<span class="sr-only">(Buscar productos)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="concluirVenta()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Concluir venta (F4)</b-dropdown-item-button>

    <b-dropdown-item-button @click="configurarOpciones()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Configuracion (F6)<span class="sr-only">(Configurar)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="consultarVentas()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Ventas (F7)<span class="sr-only">(Buscar ventas anteriores)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="consultarClientes()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Clientes (F8)<span class="sr-only">(Buscar clientes)</span>
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="cambioLote()">
      <b-icon icon="lock-fill" aria-hidden="true"></b-icon>
      Cambio de Lote (F9)<span class="sr-only">(Cambio de Lote)</span>
    </b-dropdown-item-button>

    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item-button @click="cerrarConexionConfirmar()" variant="danger" hidden>
      <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
      Conectarme a otro Sistema
    </b-dropdown-item-button>

    <b-dropdown-item-button @click="cerrarCesionConfirmar()" variant="danger">
      <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
      Cerrar Cesión
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import EventBus from '../bus';

export default {
  name: "BottomConfig",
  components: {
    //Factura,

  },
  data() {
    return {
      tipoFactura: 0,
      montoFactura: 0,
      buttonsDisabled: false,
      config: {
        producto: "",
        exenta: 0,
        gravada5: 0,
        gravada10: 0,
        totalGravada5: 0,
        totalGravada10: 0,
        totalIva: 0,
        totalGeneral: 0,
      },
      toastTitle: "",
      toastMessage: "",
      toastVariant: "",
    };
  },
  mounted() {
    
  },
  methods: {
    imprimir() {
      this.$emit("onImprimir");
    },
    conectar() {
      this.$bvModal.show('connection-modal');
    },
    consultarVentas() {
      this.$bvModal.show('consultar-ventas-modal');
    },
    cambioPrecio() {
      //this.$bvModal.show('cambio-precio-modal');
      this.$emit("onCambioPrecio");
    },
    cambioLote() {
      //this.$bvModal.show('cambio-precio-modal');
      this.$emit("onCambioLote");
    },
    consultarClientes() {
      this.$bvModal.show('consultar-clientes-modal');
    },
    consultarProductos() {
      this.$bvModal.show('consultar-productos-modal');
    },
    configurarOpciones() {
      this.$bvModal.show('configuracion-modal');
    },
    concluirVenta() {
      this.$bvModal.show('forma-cobro-modal');
    },
    cerrarConexionConfirmar() {
      if (localStorage.getItem("ventasItems") && JSON.parse(localStorage.getItem("ventasItems")).length > 0) {
        this.$bvModal.msgBoxConfirm('Existe una venta sin Concluir. Desea Descartarla?.', {
          title: 'Confirmación para Cerrar Conexión',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Descartar Venta',
          cancelTitle: 'Cancelar',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            this.cerrarConexion();
          }
        })
        .catch(() => {
          // An error occurred
        });
      } else {
        this.cerrarConexion();
      }
    },
    cerrarConexion() {
      localStorage.removeItem("token-api");
      localStorage.removeItem("cliente");
      localStorage.removeItem("moneda");
      localStorage.removeItem("deposito");
      localStorage.removeItem("tipoPrecio");
      localStorage.removeItem("cajero");
      localStorage.removeItem("url");
      localStorage.removeItem("formatoComprobante");
      
      this.cerrarCesion();
    },
    cerrarCesionConfirmar() {
      //console.log(localStorage.getItem("ventasItems") && JSON.parse(localStorage.getItem("ventasItems")).length > 0);
      //console.log(this.$bvModal);
      if (localStorage.getItem("ventasItems") && JSON.parse(localStorage.getItem("ventasItems")).length > 0) {
        this.$bvModal.msgBoxConfirm('Existe una venta sin Concluir. Desea Descartarla?.', {
          title: 'Confirmación para Cerrar Sesión',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Descartar Venta',
          cancelTitle: 'Cancelar',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            this.cerrarCesion();
          }
        })
        .catch(err => {
          console.log(err);
        });
      } else {
        this.cerrarCesion();
      }
    },
    cerrarCesion() {
      EventBus.$emit('on-logout');
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

</style>
