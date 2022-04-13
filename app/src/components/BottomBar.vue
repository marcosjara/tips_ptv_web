<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" fixed="bottom" :sticky="true">
    <b-navbar-brand href="https://www.tipscloudapps.com" target="blank">TipsCloudApps.com</b-navbar-brand>
    <button-config @onImprimir="onImprimir" @onCambioPrecio="onCambioPrecio" @onCambioLote="onCambioLote"></button-config>
  </b-navbar>
</template>

<script>
import ButtonConfig from "./ButtonConfig.vue";

export default {
  name: "BottomBar",
  components: {
    ButtonConfig,

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
    onImprimir() {
      this.$emit("onImprimir");
    },
    onCambioPrecio() {
      this.$emit("onCambioPrecio");
    },
    onCambioLote() {
      this.$emit("onCambioLote");
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
