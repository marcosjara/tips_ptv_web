<template>
  <div>
    <!--<b-button v-b-toggle.sidebar-right>Toggle Sidebar</b-button>-->
    <b-sidebar id="sidebar-right" title="Sidebar" right shadow>
      <div class="px-3 py-2">
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </p>
        <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
      </div>
    </b-sidebar>
  </div>
</template>

<script>

export default {
  name: "SidebarRight",
  components: {

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
    crearFactura() {
      let producto = "";
      let exenta = 0;
      let gravada5 = 0;
      let gravada10 = 0;

      //Inmobiliaria
      if (this.tipoFactura == 1) {
        producto = "Venta de Inmueble, Lote, Terreno, etc";
        const coeficienteDivisor = 1.015;
        const iva = 5;
        const ivaBase = 30;

        if (iva == 0) {
          exenta = this.montoFactura;
        } else {
          if (ivaBase == 100) {
            let dif = 0;
            if (iva != 0) dif = (this.montoFactura * ivaBase) / 100;
            exenta = this.montoFactura - dif;
          } else {
            let dif = 0;
            if (iva != 0)
              dif = ((this.montoFactura / coeficienteDivisor) * ivaBase) / 100;
            exenta = this.montoFactura / coeficienteDivisor - dif;
          }
        }

        if (iva == 5) {
          if (ivaBase == 100) {
            gravada5 = (this.montoFactura * ivaBase) / 100;
          } else {
            gravada5 =
              ((this.montoFactura / coeficienteDivisor) * ivaBase) / 100 +
              ((((this.montoFactura / coeficienteDivisor) * ivaBase) / 100) *
                5.0) /
                100.0;
          }
        }

        if (iva == 10) {
          gravada10 = (this.montoFactura * ivaBase) / 100;
        }
      }
      //Restaurante
      if (this.tipoFactura == 2) {
        producto = "Consumision";

        //const montoAFacturar = this.montoFactura;
        const coeficienteDivisor = 1;
        const iva = 10;
        const ivaBase = 50;

        const valorIva = parseInt(this.montoFactura) / 21;
        const montoAFacturar = this.montoFactura - valorIva;

        if (iva == 0) {
          exenta = montoAFacturar;
        } else {
          if (ivaBase == 100) {
            let dif = 0;
            if (iva != 0) dif = (montoAFacturar * ivaBase) / 100;
            exenta = montoAFacturar - dif;
          } else {
            let dif = 0;
            if (iva != 0)
              dif = ((montoAFacturar / coeficienteDivisor) * ivaBase) / 100;
            exenta = montoAFacturar / coeficienteDivisor - dif;
          }
        }

        if (iva == 5) {
          if (ivaBase == 100) {
            gravada5 = (montoAFacturar * ivaBase) / 100;
          } else {
            gravada5 =
              ((montoAFacturar / coeficienteDivisor) * ivaBase) / 100 +
              ((((montoAFacturar / coeficienteDivisor) * ivaBase) / 100) *
                5.0) /
                100.0;
          }
        }

        if (iva == 10) {
          exenta = montoAFacturar / 2;
          gravada5 = 0;
          gravada10 = montoAFacturar / 2 + valorIva;
        }
      }
      //Servicio
      if (this.tipoFactura == 3) {
        producto = "Prestacion de Servicios de X Y Z";
        const iva = 10;

        if (iva == 10) {
          exenta = 0;
          gravada5 = 0;
          gravada10 = this.montoFactura;
        }
      }

      this.config = {
        producto: producto,
        exenta: Math.round(exenta),
        gravada5: Math.round(gravada5),
        gravada10: Math.round(gravada10),
        totalGravada5: Math.round(gravada5 / 21),
        totalGravada10: Math.round(gravada10 / 11),
        totalIva: Math.round(gravada5 / 21 + gravada10 / 11),
        totalGeneral: this.montoFactura,
      };
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
