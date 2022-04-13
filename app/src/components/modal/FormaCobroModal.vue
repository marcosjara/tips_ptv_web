<template>
    <b-modal
      id="forma-cobro-modal"
      ref="modal"
      title="Forma de Cobro"
      @show="showModal"
      @hidden="onHidenModal"
      @ok="handleOk"
      @shown="focusMyElement"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-button :variant="montoTotalCobradoVariant" block>{{ montoTotalCobradoText }} {{ montoTotalACobrar | toCurrency}}</b-button>

        <b-row v-for="(item, index) in formasCobros" v-bind:key="item.value">
          <b-col >

            <b-form-group
              label=""
              label-for="alias-input"
              invalid-feedback="El alias es requerido"
              class="mt-1"
            >
              <b-form-select v-model="selected" :options="options"></b-form-select>
            </b-form-group>
            
          </b-col>
          <b-col  >
            <b-form-group
              label=""
              label-for="monto-input"
              invalid-feedback="La clave es requerida"
              class="mt-1"
            >
              <b-form-input
                type="number"
                name="monto-input"
                v-model="item.monto"
                :data-index="index"
                :ref="`fp_${item.type}_${item.moneda}`"
                :disabled="disabledFields"
                @keyup="keyupMonto"
                @keyup.enter="handleOk"
                @change="changeMonto"
                placeholder="Monto"
                required
              ></b-form-input>
            </b-form-group>

          </b-col>
        </b-row>
        <!--
        <b-button variant="primary" @click="agregarFormaCobro">Agregar</b-button>
        -->
        

        


      </form>
    </b-modal>
</template>

<script>
  import axios from 'axios';
  import EventBus from '../../bus';

  export default {
    props : {
      cliente : Object  //Cliente seleccionado para la Venta
    },
    created(){
      //this.moneda = JSON.parse(localStorage.getItem('moneda'))
    },
    mounted(){
      this.loadFormasCobrosOptions();
      this.agregarFormaCobro();
      
      this.selectFormaCobro();
    },

    data() {
      return {
        disabledFields : false,
        moneda : null,
        montoTotalACobrar : 0,
        montoTotalCobradoVariant : 'danger',
        montoTotalCobradoText : 'Faltan',
        //monto : 0,
        error: false,
        selected: 'efectivo_gs',
        //options: [
        //  { type: 'efectivo', value: 'efectivo_gs', text: 'Efectivo Gs' },
//          { type: 'efectivo', value: 'efectivo_usd', text: 'Efectivo USD' }
//        ],
        /*formasCobros : [{
          type : 'efectivo',
          text : 'Efectivo ' + moneda.codigo,
          moneda : moneda.codigo,
          monto : 0,  //Valor que el usuario digita
        }]*/
        options : [],
        formasCobros : []
      }
    },
    methods: {
      keyupMonto(e) {
        let index = e.target.getAttribute('data-index');

        this.formasCobros[index]['monto'] = parseFloat(e.target.value || 0);  //Actualiza el Monto
        this.updateMontoTotalCobrado();

      },
      updateMontoTotalCobrado() {
        //console.log(this.formasCobros);
        let montoYaCargado = 0;
        for (let i = 0; i < this.formasCobros.length; i++) {
          const formaCobro = this.formasCobros[i];
          
          montoYaCargado += formaCobro['monto'];
        }
        this.montoTotalACobrar = EventBus.montoTotal - montoYaCargado;
        if (this.montoTotalACobrar > 0) {
          //Faltan
          this.montoTotalCobradoVariant = 'danger';
          this.montoTotalCobradoText = 'Faltan';
        } else {
          //Sobran
          this.montoTotalCobradoVariant = 'success';
          this.montoTotalCobradoText = 'Vuelto';
        }
      },
      changeMonto(val, e) {
        console.log(val, e);
/*        console.log(e.target);
        console.log(e.target.getAttribute('data-index'));
        console.log(e.target.value);
*/
        let montoYaCargado = 0;
        for (let i = 0; i < this.formasCobros.length; i++) {
          const formaCobro = this.formasCobros[i];
          
          montoYaCargado += formaCobro['monto'];
        }
        this.montoTotalACobrar = EventBus.montoTotal - montoYaCargado;
        if (this.montoTotalACobrar > 0) {
          //Faltan
          this.montoTotalCobradoVariant = 'danger';
          this.montoTotalCobradoText = 'Faltan';
        } else {
          //Sobran
          this.montoTotalCobradoVariant = 'success';
          this.montoTotalCobradoText = 'Vuelto';
        }

      },
      loadFormasCobrosOptions() {
        //Aqui deben estar cargadas todas las opciones de formas de Cobros.
        this.moneda = JSON.parse(localStorage.getItem('moneda'));
        this.options.push({
          type : 'efectivo',
          value : 'fp_efectivo_' + this.moneda.codigo,
          text : 'Efectivo ' + this.moneda.descripcion,
          moneda : this.moneda.codigo,
          monto : 0
        });
        console.log(this.options);
      },
      agregarFormaCobro() {
        this.formasCobros.push({
          type : 'efectivo',
          value : 'fp_efectivo_'  + this.moneda.codigo,
          text : 'Efectivo ' + this.moneda.descripcion,
          moneda : this.moneda.codigo,
          monto : 0
        });

        console.log(this.formasCobros);

      },
      selectFormaCobro() {
        this.selected = 'fp_efectivo_'  + this.moneda.codigo;
      },
      checkFormValidity() {
        let valid = this.$refs.form.checkValidity();
        if (this.error) {
          valid = false;
        }
        return valid;
      },
      showModal() {
        
        this.updateMontoTotalCobrado();

      },
      onHidenModal() {
        
      },
      handleSubmit() {
        // Exit when the form isn't valid
       /* if (!this.checkFormValidity()) {
          return
        }
        
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('configuracion-modal');
        })*/
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        this.error = false;
        this.disabledFields = true;
        bvModalEvt.preventDefault();

        if (this.montoTotalACobrar > 0) {
          this.disabledFields = false;
          this.$toast.error('Faltan completar ' + this.montoTotalACobrar + ' para Concluir la Venta', {
            position: 'top'
          });
          
          return;
        }
        
        this.responseAvailable = false;
        
        const varFormasCobros = this.formasCobros.filter(fp=>{
          if (fp.monto > 0) {
            return true;
          }
        });

        let headers = {
          "token": sessionStorage.getItem("token-user")
        };

        
        let otherFields = null;
        //console.log("this.montoTotalACobrar", this.montoTotalACobrar);
        if (this.montoTotalACobrar < 0) { //Si hay vuelto
          otherFields = {}; 
          otherFields['vuelto'] = Math.abs(this.montoTotalACobrar);
        }

        for (const formaCobro of varFormasCobros) {
          formaCobro['monto'] = EventBus.montoTotal;
        }


        let clienteEnviar = JSON.parse(localStorage.getItem("cliente"));  //Cliente por defecto
        if (this.cliente != null) {
          clienteEnviar = this.cliente;  //Cliente Seleccionado
        }
        let data = {
          'ventas_items' : JSON.parse(localStorage.getItem("ventasItems")),
          'cliente' : clienteEnviar,
          'moneda' : JSON.parse(localStorage.getItem("moneda")),
          'deposito' : JSON.parse(localStorage.getItem("deposito")),
          'cajero' : JSON.parse(localStorage.getItem("cajero")),
          'formas_cobros' : varFormasCobros,
          'montoTotal' : EventBus.montoTotal,
          'other_fields' : otherFields
        };
        console.log("data", data);

        //---
        //---
        axios.post(localStorage.getItem("url") + "venta/venta-guardar", data, {headers} ).then(response => { 
          //console.log(response.data);
          this.disabledFields = false;
          if(response.data.success){
            EventBus.$emit("venta-guardada", response.data.venta);
            //Luego de Loguearse el Usuario
            //Mismo codigo en Principal.vue:mounted
            
            this.cerrarModal();
            this.$toast.success('Venta Guardada', {
              position: 'top'
            });

          } else{
            
            console.log(response.data.error);
            this.error = true;
            this.$toast.error(response.data.error, {
              position: 'top'
            });
          }                
        }).catch(err => {
          this.disabledFields = false;
          console.log(err);
          this.error = true;
          this.$toast.error('Error de Servidor', {
            position: 'bottom'
          });
        });

      },
      cerrarModal() {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('forma-cobro-modal')
        });
      },
      focusMyElement() {
        if (!(EventBus.montoTotal > 0)) {
           this.$toast.error('El Monto Total el Cero', {
            position: 'top'
          });
          this.$nextTick(() => {
            this.$bvModal.hide('forma-cobro-modal');
            this.moneda = JSON.parse(localStorage.getItem('moneda'));
          });
          //this.moneda = JSON.parse(localStorage.getItem('moneda'));
        }
        
        const fpFocus = `fp_efectivo_${this.moneda.codigo}`;
        
        this.$refs[fpFocus][0].value = EventBus.montoTotal;
        this.$refs[fpFocus][0].focus();
        this.$refs[fpFocus][0].select();
        
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
