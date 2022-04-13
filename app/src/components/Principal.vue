<template>
  <div>
    <nav-bar :nombreEmpresa="nombreEmpresa" :version="version" @onNuevo="onNuevoConfirmar" :montoTotal="montoTotal"></nav-bar>
    <sidebar-custom></sidebar-custom>
    <sidebar-right></sidebar-right>
    
    <b-container fluid>
    
      <carga-producto ref="cargaProducto" 
        @producto_added="onVentaItemAgregado"
        @producto_cantidad_updated="onVentaItemCantidadUpdated" 
        @producto_precio_updated="onVentaItemPrecioUpdated" 
      ></carga-producto>

      <lista-ventas-items :items="ventasItems" 
        @producto_deleted="onVentaItemBorrado" 
        @producto_selected="onVentaItemSelected" 
        
        ref="listaVentasItems"
      ></lista-ventas-items>
      
    </b-container>

    <connection-modal></connection-modal>
    <login-modal></login-modal>
    <consultar-ventas-modal></consultar-ventas-modal>
    <consultar-clientes-modal></consultar-clientes-modal>
    <consultar-productos-modal></consultar-productos-modal>
    <configuracion-modal></configuracion-modal>
    <cambio-precio-modal @producto_cambio_precio="onVentaItemCambioTipoPrecio"></cambio-precio-modal>
    <cambio-lote-modal @producto_cambio_lote="onVentaItemCambioLote"></cambio-lote-modal>
    <operacion-restringida-modal ref="operacionRestringidaModal"></operacion-restringida-modal>
    <forma-cobro-modal :cliente="clienteVenta"></forma-cobro-modal>

    
    <bottom-bar @onCambioPrecio="openModalCambioPrecio(event)" @onCambioLote="openModalCambioLote(event)"></bottom-bar>
    <impresion :src="srcImpresion"></impresion>
  </div>  
</template>

<script>
import axios from 'axios';

import CargaProducto from './CargaProducto.vue';
import NavBar from './NavBar.vue';
import BottomBar from './BottomBar.vue';
import SidebarCustom from "./SidebarCustom.vue";
import SidebarRight from "./SidebarRight.vue";
import ConnectionModal from "./modal/ConnectionModal.vue";
import LoginModal from './modal/LoginModal.vue';
import ConsultarVentasModal from './modal/ConsultarVentasModal.vue';
import ConsultarClientesModal from './modal/ConsultarClientesModal.vue';
import ConsultarProductosModal from './modal/ConsultarProductosModal.vue';
import ListaVentasItems from './ListaVentasItems.vue';
import ConfiguracionModal from './modal/ConfiguracionModal.vue';
import CambioPrecioModal from './modal/CambioPrecioModal.vue';
import CambioLoteModal from './modal/CambioLoteModal.vue';
import FormaCobroModal from './modal/FormaCobroModal.vue';
import OperacionRestringidaModal from './modal/OperacionRestringidaModal.vue';
import EventBus from '../bus';
import Impresion from './Impresion.vue';

export default {
  name: "Principal",
  components: {
    NavBar,
    BottomBar,
    CargaProducto,
    SidebarCustom,
    SidebarRight,
    ConnectionModal,
    LoginModal,
    ConsultarVentasModal,
    ConsultarClientesModal,
    ListaVentasItems,
    ConsultarProductosModal,
    ConfiguracionModal,
    CambioPrecioModal,
    CambioLoteModal,
    FormaCobroModal,
    OperacionRestringidaModal,
    Impresion


  },
  data() {
    return {
      version : '',
      nombreEmpresa : '',
      clienteVenta : null,
      srcImpresion : '',
      ventasItems : [],
      montoTotal : 0,
      maxVentasItemsIndex : null
    };
  },
  created: function() {
    this.version = require('/package.json').version;
    EventBus.$on('producto-select', (productoSelected) => {
      productoSelected.cantidad = 1;
      this.onVentaItemAgregado(productoSelected);
    });
    EventBus.$on('cliente-select', (clienteSelected) => {
      this.clienteVenta = clienteSelected;
    });
    EventBus.$on('venta-imprimir', (ventaNumero) => {
      this.imprimirVenta(ventaNumero);
      this.$bvModal.hide('consultar-ventas-modal');
    });
    EventBus.$on('venta-guardada', (venta) => {
      //---
      console.log("venta", venta);
      this.imprimirVenta(venta.numero);
      this.nuevaVenta();
    });
    EventBus.$on('on-login', () => {
      //---
      if (!localStorage.getItem("cliente") || !localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("tipoPrecio") || !localStorage.getItem("cajero") || !localStorage.getItem("formatoComprobante")) {
        this.$bvModal.show('configuracion-modal');
      }

      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        //this.$refs.cargaProducto.$refs.codigo.selectAll();
      });
      
      this.nuevaVenta();
    });
    EventBus.$on('on-logout', () => {
      //localStorage.removeItem("cliente");
      //localStorage.removeItem("formatoComprobante");
      //localStorage.removeItem("tipoPrecio");
      //localStorage.removeItem("moneda");
      localStorage.removeItem("cajero");
      localStorage.removeItem("deposito");
      localStorage.removeItem("ventasItems");
      localStorage.removeItem("settings");
      
      sessionStorage.removeItem("token-user");
      sessionStorage.removeItem("name-user");
      sessionStorage.removeItem("alias-user");
      sessionStorage.removeItem("isAdmin-user");
      sessionStorage.removeItem("ventaId");
      

      this.ventasItems = [];

      this.$bvModal.show('login-modal');
    });
    EventBus.$on('connection-entablished', () => {
      this.recuperarSettings();

    });
    
  },
  mounted() {
    
    this.$nextTick(() => {
      this.$refs.cargaProducto.$refs.codigo.focus();
      //this.$refs.cargaProducto.$refs.codigo.select();
    });

    if (!localStorage.getItem("token-api")) {
      //Si aun no tiene datos de conexion
      this.$bvModal.show('connection-modal');
    } else {
      this.recuperarSettings();
      //Si ya tiene datos de conexion pero no esta autenticado
      if (!sessionStorage.getItem("token-user")) {
        this.$bvModal.show('login-modal');
      } else {
        if (!localStorage.getItem("cliente") || !localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("tipoPrecio") ) {
          this.$bvModal.show('configuracion-modal');
        }
      }
    }
    
    //if (sessionStorage.getItem("ventaId")) {
      //Recuperar los items de la venta
      //this.$refs.listaVentasItems.loadVentasItems(sessionStorage.getItem("ventaId"));
    //}

    if (localStorage.getItem("ventasItems")) {
      this.ventasItems = JSON.parse(localStorage.getItem("ventasItems"));
      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);
    }
  
    document.addEventListener('keydown', this.onKeyPress.bind(this));
    
  },
  beforeDestroy() {
      //document.removeEventListener('keydown', this._keyListener);
      document.removeEventListener('keydown', this.onKeyPress.bind(this));
  },
  methods: {
    onKeyPress : function(e) {

      if (e.keyCode == 114) { //F3
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.$bvModal.show('consultar-productos-modal');
      }
      if (e.keyCode == 115) { //F4
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.$bvModal.show('forma-cobro-modal');
        
      }

      if (e.keyCode == 117) { //F6
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.$bvModal.show('configuracion-modal');
      }
      
      if (e.keyCode == 118) { //F7
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.$bvModal.show('consultar-ventas-modal');
      }

      if (e.keyCode == 119) { //F8
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.$bvModal.show('consultar-clientes-modal');
      }


      //console.log(e.keyCode);
    },

    onKeyPressCambioPrecio : function(e) {
      if (e.keyCode == 113) { //F2
      //console.log("entra en cambiar precio", e.keyCode, EventBus.lastVentaItem);
        this.openModalCambioPrecio(e);
      }

      if (e.keyCode == 120) { //F9
        this.openModalCambioLote(e);
      }
    },
    openModalCambioPrecio : function(e) {
        if (EventBus.lastVentaItem) {
          e.preventDefault(); // present "Save Page" from getting triggered.
          this.$bvModal.show('cambio-precio-modal');
        }
    },
    openModalCambioLote : function(e) {
        if (EventBus.lastVentaItem) {
          e.preventDefault(); // present "Save Page" from getting triggered.
          this.$bvModal.show('cambio-lote-modal');
        }
    },
    imprimirVenta(numeroVenta) {
      const oThis = this;
      const alias = sessionStorage.getItem("alias-user");
      const fullUrl = localStorage.getItem("url");
      
      const virtualContext = fullUrl.substring(fullUrl.lastIndexOf("/", fullUrl.length -2) + 1, fullUrl.length - 1);
      const urlWithoutRest = fullUrl.substring(0, fullUrl.toUpperCase().indexOf("-REST")) + fullUrl.substring(fullUrl.toUpperCase().indexOf("-REST") + 5, fullUrl.lastIndexOf("/", fullUrl.length -2));

      const formatoComprobante =  localStorage.getItem("formatoComprobante") != null ? JSON.parse(localStorage.getItem("formatoComprobante")) : null;

      if (!formatoComprobante) {
        this.$toast.info('Debe seleccionar un Formato de Comprobante a Imprimir', {
          position: 'top'
        });
        this.$bvModal.show('configuracion-modal');
        return;
      }
      
      this.srcImpresion = "tipscloudPrintDirectly://" + urlWithoutRest + "/" + formatoComprobante.action + "?venta.numero=" + numeroVenta + "&timbradoFacturacionMovimiento.ingresoEgresoNumero=" + numeroVenta + "&virtualContext=" + virtualContext + "&user=" + alias + formatoComprobante.params;
      console.log("Run:", this.srcImpresion);
      setTimeout(function () { 
        oThis.srcImpresion = null;
      }, 1000);
      
    },
    nuevaVenta() {
      localStorage.removeItem("ventasItems");
      this.ventasItems = [];
      this.clienteVenta = null;
      this.maxVentasItemsIndex = null;
      this.montoTotal = 0;
      EventBus.montoTotal = 0;
      EventBus.lastVentaItem = null;

      this.$refs.cargaProducto.reiniciarCarga();
      
    },

    onVentaItemAgregado(producto) {
      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        this.$refs.cargaProducto.$refs.codigo.select();
      });

      const itemsCopy = [].slice.call(this.ventasItems.reverse());
      if ( ! this.maxVentasItemsIndex) {
        this.maxVentasItemsIndex = itemsCopy.length;
      } else {
        this.maxVentasItemsIndex ++;
      }
      var tipoPrecio = JSON.parse(localStorage.getItem("tipoPrecio"));
      //console.log("tipoPrecio", tipoPrecio);
      //console.log("producto", producto);
      const ventaItemAgregar = {
        '_index' : this.maxVentasItemsIndex,
        'codigo' : producto.codigo,
        'tipo_precio_codigo' : tipoPrecio.codigo,
        'tipo_precio_descripcion' : tipoPrecio.descripcion,
        'lote_codigo' : producto.lote_codigo,
        'lote_nombre' : producto.lote_nombre,
        'referencia' : producto.referencia,
        'codigo_barras' : producto.codigo_barras,
        'descripcion' : producto.descripcion,
        'cantidad' : producto.cantidad,
        'precio' : producto.precio,
        'bruto' : producto.precio,
        'subtotal' : producto.cantidad * producto.precio,
      };

      //const itemsCopy = [].slice.call(this.ventasItems.reverse());
      itemsCopy.push(ventaItemAgregar);
      this.ventasItems = itemsCopy.reverse();

      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);

      //Guardar ventasItems
      localStorage.setItem("ventasItems", JSON.stringify(this.ventasItems));

      //document.removeEventListener('keydown', this.onKeyPressCambioPrecio.bind(this));
      EventBus.lastVentaItem = ventaItemAgregar;
    },
    onVentaItemBorrado(producto, index) {
      
      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        this.$refs.cargaProducto.$refs.codigo.select();
      });      
      const ventasItems = JSON.parse(localStorage.getItem("ventasItems"));
      
      ventasItems.splice(index, 1);
      this.ventasItems = ventasItems;
      
      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);

      localStorage.setItem("ventasItems", JSON.stringify(this.ventasItems));
      
    },
    onVentaItemSelected(ventaItem) {
      if (ventaItem) {
        console.log("onVentaItemSelected producto yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", ventaItem);
        document.addEventListener('keydown', this.onKeyPressCambioPrecio.bind(this));

        this.$refs.cargaProducto.codigoDisabled = true;
        this.$refs.cargaProducto.cantidadDisabled = false;
        this.$refs.cargaProducto.precioDisabled = false;

        this.$nextTick(() => {
          this.$refs.cargaProducto.$refs.cantidad.focus();
          this.$refs.cargaProducto.$refs.cantidad.select();
        });
      
      
        this.$refs.cargaProducto.index = ventaItem._index;
        this.$refs.cargaProducto.codigo = ventaItem.codigo;
        this.$refs.cargaProducto.referencia = ventaItem.referencia;
        this.$refs.cargaProducto.codigo_barras = ventaItem.codigo_barras;
        this.$refs.cargaProducto.descripcion = ventaItem.descripcion;
        this.$refs.cargaProducto.cantidad = ventaItem.cantidad;
        this.$refs.cargaProducto.precio = ventaItem.bruto;
        this.$refs.cargaProducto.precioOriginal = ventaItem.bruto;

        EventBus.lastVentaItem = ventaItem;
      }
      
    },
    onVentaItemCambioTipoPrecio(ventaItem, tipoPrecio) {

      this.$refs.cargaProducto.codigoDisabled = false;
      this.$refs.cargaProducto.cantidadDisabled = true;
      this.$refs.cargaProducto.precioDisabled = true;
      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        //this.$refs.cargaProducto.$refs.codigo.select();
      });

      const ventasItems = JSON.parse(localStorage.getItem("ventasItems"));
      ventasItems.map(vi=> {
        if (vi._index === ventaItem._index) {
          vi.tipo_precio_codigo = tipoPrecio.codigo;
          vi.tipo_precio_descripcion = tipoPrecio.descripcion;
          vi.precio = tipoPrecio.precio_venta;
          vi.bruto = tipoPrecio.precio_venta;
          vi.subtotal = vi.cantidad * vi.precio;

          EventBus.lastVentaItem = vi;
        }
      });
      
      this.ventasItems = ventasItems;

      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);

      localStorage.setItem("ventasItems", JSON.stringify(this.ventasItems));
      
    },
    onVentaItemCambioLote(ventaItem, lote) {

      this.$refs.cargaProducto.codigoDisabled = false;
      this.$refs.cargaProducto.cantidadDisabled = true;
      this.$refs.cargaProducto.precioDisabled = true;
      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        //this.$refs.cargaProducto.$refs.codigo.select();
      });

      const ventasItems = JSON.parse(localStorage.getItem("ventasItems"));
      ventasItems.map(vi=> {
        if (vi._index == ventaItem._index) {
          vi.lote_codigo = lote.codigo;
          vi.lote_nombre = lote.nombre;

          EventBus.lastVentaItem = vi;
        }
      });
      
      this.ventasItems = ventasItems;

      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);

      localStorage.setItem("ventasItems", JSON.stringify(this.ventasItems));
      
    },
    onVentaItemUpdated(ventaItem) {
      //console.log("producto_updated", ventaItem);
      this.$refs.cargaProducto.codigoDisabled = false;
      this.$refs.cargaProducto.cantidadDisabled = true;
      this.$refs.cargaProducto.precioDisabled = true;
      this.$nextTick(() => {
        this.$refs.cargaProducto.$refs.codigo.focus();
        //this.$refs.cargaProducto.$refs.codigo.select();
      });

      const ventasItems = JSON.parse(localStorage.getItem("ventasItems"));
      ventasItems.map(vi=> {
        if (vi._index === ventaItem._index &&
            vi.codigo === ventaItem.codigo) {
          vi.cantidad = ventaItem.cantidad;
          vi.precio = ventaItem.precio;
          vi.bruto = ventaItem.precio;
          vi.subtotal = ventaItem.cantidad * ventaItem.precio
        }
      });
      
      this.ventasItems = ventasItems;

      this.montoTotal = 0;
      this.ventasItems.map(vi=> this.montoTotal += vi.bruto * vi.cantidad );
      EventBus.montoTotal = parseFloat(this.montoTotal);

      localStorage.setItem("ventasItems", JSON.stringify(this.ventasItems));
    },
    onVentaItemCantidadUpdated(ventaItem) {
      this.onVentaItemUpdated(ventaItem);
    },
    onVentaItemPrecioUpdated(ventaItem) {
      //Esta parte se puede componentizar, para los otros casos, con promesa o callback
      const settings = JSON.parse(localStorage.getItem("settings"));
      const isAdmin = parseInt(sessionStorage.getItem("isAdmin-user"));

      if (settings['stock.ptv.cambio_tipo_precio_restringido'] && settings['stock.ptv.cambio_tipo_precio_restringido'] === "true") {
        if (isAdmin == 1) {
          //Si es Administrador abre directo
          this.onVentaItemUpdated(ventaItem);
        } else {
          //Si no es Admministrador.
          this.ventaItemModificar = ventaItem;
          EventBus.$on('operacion-restringida-accepted', this.usuarioRestringidoAceptadoEventFunction);
          
          this.$bvModal.show('operacion-restringida-modal');
        }
      } else {
        this.onVentaItemUpdated(ventaItem);
      } 

    },
    usuarioRestringidoAceptadoEventFunction(user) {
      console.log("XXXXXXXXXXXXXXXXXXX acceso restringido aceptado con el usuario ", user);
      
      this.onVentaItemUpdated(this.ventaItemModificar);

      //Retirar el Listener
      EventBus.$off('operacion-restringida-accepted', this.usuarioRestringidoAceptadoEventFunction);

    },
    onNuevoConfirmar() {
      const oThis = this;
      if (localStorage.getItem("ventasItems") && JSON.parse(localStorage.getItem("ventasItems")).length > 0) {
        this.$bvModal.msgBoxConfirm('Existe una venta sin Concluir. Desea Descartarla?.', {
          title: 'Confirmación para Nueva Venta',
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
            oThis.nuevaVenta();
          }
        })
        .catch(err => {
          console.log(err);
        });
      } else {
        this.nuevaVenta();
      }
    },

    recuperarSettings() {
            //Recuperar Datos del Settings.

      let q = "general.datos.empresa.persona_id,stock.ptv.cambio_tipo_precio_restringido";
      axios.get(localStorage.getItem("url") + "helper/settings?q=" + q ).then(response => { 
          
          if(response.data.success){
            const settings = response.data.settings;

            localStorage.setItem("settings", JSON.stringify(settings));
            if (settings["general.datos.empresa.persona_id"] ) {
              const idPersona = settings["general.datos.empresa.persona_id"];
              
              axios.get(localStorage.getItem("url") + "persona/find/" + idPersona ).then(response2 => { 
                
                if(response2.data.success){
                  
                  this.nombreEmpresa = response2.data.persona.per_nombre;
                }
              });
            }
          }
      });
    }
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

.container-fluid {
  background-color: rgb(201, 199, 199);
}

</style>
7