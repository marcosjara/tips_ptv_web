<template>
    <b-modal
      id="configuracion-modal"
      ref="modal"
      title="Configuración de Opciones"
      @show="resetModal"
      @hidden="onHidenModal"
      @ok="handleOk"
      @shown="focusMyElement" 
      hide-footer
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <b-form-group
          label="Usuario"
          label-for="nombre-usuario"
        >
          <b-form-input
            id="nombre-usuario"
            v-model="nombreUsuario"
            :disabled = true
            placeholder="Nombre de Usuario (Alias)"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Cliente"
          label-for="alias-input"
          invalid-feedback="La agrupación es requerida"          
        >
           <vue-bootstrap-typeahead
            :data="clientes"
            ref="cliente"
            :minMatchingChars=0
            v-model="clienteSearch"
            :serializer="s => s.nombre"
            placeholder="Digite el Cliente..."
            @hit="onSelectCliente"
            @click="onSelectCliente"
          ></vue-bootstrap-typeahead>
        </b-form-group>

<!--
        <b-form-group
          label="Agrupación"
          label-for="alias-input"
          invalid-feedback="La agrupación es requerida"
        >
           <vue-bootstrap-typeahead
            :data="agrupaciones"
            ref="agrupacion"
            :minMatchingChars=0
            v-model="agrupacionSearch"
            :serializer="s => s.nombre"
            placeholder="Digite la Agrupación..."
            @hit="onSelectAgrupacion"
            @click="onSelectAgrupacion"
          ></vue-bootstrap-typeahead>
        </b-form-group>
-->
        <!-- Campo desabilitado para Deposito -->
        <b-form-group v-if="disabledDeposito"
          label="Deposito"
          label-for="deposito-disabled"
        >
          <b-form-input
            id="deposito-disabled"
            v-model="valueDeposito"
            :disabled = disabledDeposito
            placeholder="Depósito"
          ></b-form-input>
        </b-form-group>

        <b-form-group 
          label="Deposito"
          label-for="alias-input"
          invalid-feedback="El Deposito es requerido"
          :class="disabledDeposito ? 'display-none' : 'display-block'"
        >
           <vue-bootstrap-typeahead
            :data="depositos"
            ref="deposito"
            :minMatchingChars=0
            v-model="depositoSearch"
            :serializer="s => s.nombre"
            placeholder="Digite el Deposito..."
            @hit="onSelectDeposito"
            @click="onSelectDeposito"
          ></vue-bootstrap-typeahead>
        </b-form-group>


        <!-- Campo desabilitado para Moneda -->
        <b-form-group v-if="disabledMoneda"
          label="Moneda"
          label-for="moneda-disabled"
        >
          <b-form-input
            id="moneda-disabled"
            v-model="valueMoneda"
            :disabled = disabledMoneda
            placeholder="Moneda"
          ></b-form-input>
        </b-form-group>

        <b-form-group v-if="!disabledMoneda"
          label="Moneda"
          label-for="alias-input"
          invalid-feedback="La moneda requerida"
        >
           <vue-bootstrap-typeahead
            :data="monedas"
            ref="moneda"
            :minMatchingChars=0
            v-model="monedaSearch"
            :serializer="s => s.descripcion"
            placeholder="Digite la Moneda..."
            @hit="onSelectMoneda"
            @click="onSelectMoneda"
          ></vue-bootstrap-typeahead>
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
          label="Cajero"
          label-for="alias-input"
          invalid-feedback="El Cajero es requerido"
        >
           <vue-bootstrap-typeahead
            :data="cajeros"
            ref="cajero"
            :minMatchingChars=0
            v-model="cajeroSearch"
            :serializer="s => s.nombre"
            placeholder="Digite el Cajero..."
            @hit="onSelectCajero"
            @click="onSelectCajero"
          ></vue-bootstrap-typeahead>
        </b-form-group>

        <b-form-group
          label="Formato Comprobante"
          label-for="alias-input"
          invalid-feedback="El Formato es requerido"
        >
           <vue-bootstrap-typeahead
            :data="formatosComprobantes"
            ref="formatoComprobante"
            :minMatchingChars=0
            v-model="formatoComprobanteSearch"
            :serializer="s => s.nombre"
            placeholder="Seleccione el formato..."
            @hit="onSelectFormatoComprobante"
            @click="onSelectFormatoComprobante"
          ></vue-bootstrap-typeahead>
        </b-form-group>

      </form>
    </b-modal>
</template>

<script>
  import axios from 'axios';
  //import _ from 'underscore';

  export default {
    mounted() {
      this.nombreUsuario = sessionStorage.getItem('name-user')
      this.$nextTick(function () {
        //this.inicializarCampos();
      });
    },
    data() {
      return {
        nombreUsuario : '',

        clientes: [],
        clienteSearch: '',
        selectedCliente: null,

        agrupaciones: [],
        agrupacionSearch: '',
        selectedAgrupacion: null,
        
        depositos: [],
        depositoSearch: '',
        selectedDeposito: null,
      
        monedas: [],
        monedaSearch: '',
        selectedMoneda: null,

        tiposPrecios: [],
        tipoPrecioSearch: '',
        selectedTipoPrecio: null,

        cajeros: [],
        cajeroSearch: '',
        selectedCajero: null,

        formatosComprobantes: [],
        formatoComprobanteSearch: '',
        selectedFormatoComprobante: null,

        configState: null,

        disabledDeposito : false,
        disabledMoneda : false,

        valueDeposito : '',
        valueMoneda : '',
      }
    },
    computed: {
      
    },
    watch: {
      clienteSearch(){
        this.buscarClientes();
      },
      agrupacionSearch(){
        this.buscarAgrupaciones();
      },
      depositoSearch(){
        this.buscarDepositos();
      },
      monedaSearch(){
        this.buscarMonedas();
      },
      tipoPrecioSearch(){
        this.buscarTiposPrecios();
      },
      cajeroSearch(){
        this.buscarCajeros();
      },
      formatoComprobanteSearch(){
        this.buscarFormatosComprobantes();
      }
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.configState = valid;
        return valid;
      },
      resetModal() {
        this.clienteSearch = '';
        this.agrupacionSearch = '';
        this.depositoSearch = '';
        this.monedaSearch = '';
        this.tipoPrecioSearch = '';
        this.cajeroSearch = '';
        this.formatoComprobanteSearch = '';
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
        
        this.responseAvailable = false;
       
      },
      buscarClientes() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
        };
        let params = {
          "q": this.clienteSearch
        };
        axios.get(localStorage.getItem("url") + "venta/clientes", {headers, params} ).then(response => { 
            if(response.data.success){
              this.clientes = response.data.clientes;
                  
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
      buscarAgrupaciones() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          "alias": this.alias,
          "clave": this.clave
        };
        let params = {
          "q": this.agrupacionSearch
        };
        axios.get(localStorage.getItem("url") + "stock/agrupaciones", {headers, params} ).then(response => { 
            if(response.data.success){
              this.agrupaciones = response.data.agrupaciones;
                  
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
      buscarDepositos() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          "alias": this.alias,
          "clave": this.clave
        };
        let params = {
          "q": this.depositoSearch
        };
        axios.get(localStorage.getItem("url") + "stock/depositos", {headers, params} ).then(response => { 
            if(response.data.success){
              this.depositos = response.data.depositos;
                  
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
      buscarMonedas() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          "alias": this.alias,
          "clave": this.clave
        };
        let params = {
          "q": this.monedaSearch
        };
        axios.get(localStorage.getItem("url") + "moneda/list", {headers, params} ).then(response => { 
            if(response.data.success){
              this.monedas = response.data.monedas;
                  
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
      buscarTiposPrecios() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          "alias": this.alias,
          "clave": this.clave
        };
        let params = {
          "q": this.tipoPrecioSearch
        };
        axios.get(localStorage.getItem("url") + "stock/tipos-precios", {headers, params} ).then(response => { 
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
      buscarCajeros() {
        let headers = {
          "token": sessionStorage.getItem("token-user"),
          //"alias": this.alias,
          //"clave": this.clave
        };
        let params = {
          "q": this.cajeroSearch
        };
        axios.get(localStorage.getItem("url") + "stock/cajeros", {headers, params} ).then(response => { 
            if(response.data.success){
              this.cajeros = response.data.cajeros;
                  
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
      buscarFormatosComprobantes() {
        this.formatosComprobantes = [{
          codigo: 'comprobante_comun',
          nombre: 'Comprobante Común',
          action: 'imprimirFacturaComun.action',
          params: ''
/*        },{
          codigo: 'comprobante_comun_alternativo',
          nombre: 'Comprobante Común Alt.',
          action: 'imprimirFacturaComun.action',
          params: '&json_config=json_alt'*/
        },{
          codigo: 'ticket_comun',
          nombre: 'Ticket Común',
          action: 'imprimirTicketComun.action',
          params: ''
/*        },{
          codigo: 'ticket_comun_alternativo',
          nombre: 'Ticket Común Alt.',
          action: 'imprimirTicketComun.action',
          params: '&json_config=json_alt'*/
        }];
      },
      onSelectCliente(e){
        this.selectedCliente = e; 
        
        localStorage.setItem("cliente", JSON.stringify(this.selectedCliente)); 
      },
      onSelectAgrupacion(e){
        this.selectedAgrupacion = e; 
        
        localStorage.setItem("agrupacion", JSON.stringify(this.selectedAgrupacion)); 
      },
      onSelectDeposito(e){
        this.selectedDeposito = e; 
        
        localStorage.setItem("deposito", JSON.stringify(this.selectedDeposito)); 
      },
      onSelectMoneda(e){
        this.selectedMoneda = e; 
        localStorage.setItem("moneda", JSON.stringify(this.selectedMoneda)); 
      },
      onSelectTipoPrecio(e){
        this.selectedTipoPrecio = e; 
        localStorage.setItem("tipoPrecio", JSON.stringify(this.selectedTipoPrecio)); 
      },
      onSelectCajero(e){
        this.selectedCajero = e; 
        localStorage.setItem("cajero", JSON.stringify(this.selectedCajero)); 
      },
      onSelectFormatoComprobante(e){
        this.selectedFormatoComprobante = e; 
        localStorage.setItem("formatoComprobante", JSON.stringify(this.selectedFormatoComprobante)); 
      },
      onHidenModal() {
        //Si se cierra y no ha cargado todos los datos.
        //OBS: Misma validacion que está en principal
        if (!localStorage.getItem("cliente") || !localStorage.getItem("deposito") || !localStorage.getItem("moneda") || !localStorage.getItem("tipoPrecio") || !localStorage.getItem("cajero") || !localStorage.getItem("formatoComprobante")) {
          this.$bvModal.show('configuracion-modal');
        }
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('configuracion-modal');
        })
      },
      isVentasItemsAdded: function () {
        const vi = JSON.parse(localStorage.getItem("ventasItems"));
        
        if (vi && vi.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      focusMyElement() {
        this.$nextTick(function () {
          this.inicializarCampos();
        });
      },
      inicializarCampos() {
        this.selectedCliente = JSON.parse(localStorage.getItem("cliente"));
        this.$refs.cliente.inputValue = this.selectedCliente?.nombre;

        //this.selectedAgrupacion = JSON.parse(localStorage.getItem("agrupacion"));
        //this.$refs.agrupacion.inputValue = this.selectedAgrupacion?.nombre;
        
        this.selectedDeposito = JSON.parse(localStorage.getItem("deposito"));
        console.log("this.$refs.deposito", this.$refs.deposito)
        if (this.$refs.deposito) {
          this.$refs.deposito.inputValue = this.selectedDeposito?.nombre;
        }
        this.valueDeposito = this.selectedDeposito?.nombre;

        this.selectedMoneda = JSON.parse(localStorage.getItem("moneda"));
        if (this.$refs.moneda) {
          this.$refs.moneda.inputValue = this.selectedMoneda?.descripcion;
        }
        this.valueMoneda = this.selectedMoneda?.descripcion;

        this.selectedTipoPrecio = JSON.parse(localStorage.getItem("tipoPrecio"));
        this.$refs.tipoPrecio.inputValue = this.selectedTipoPrecio?.descripcion;

        this.selectedCajero = JSON.parse(localStorage.getItem("cajero"));
        this.$refs.cajero.inputValue = this.selectedCajero?.nombre;
        
        this.selectedFormatoComprobante = JSON.parse(localStorage.getItem("formatoComprobante"));
        this.$refs.formatoComprobante.inputValue = this.selectedFormatoComprobante?.nombre;
        
        //this.$refs.agrupacion.focus();
        this.disabledDeposito = this.isVentasItemsAdded();
        this.disabledMoneda = this.isVentasItemsAdded();

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
