<template>
  <div>
    <span :hidden="hidden">Envianos tus comentarios:</span>
    <b-form-textarea
      id="textarea"
      v-model="comentario"
      placeholder="Tienes alguna sugerencia para cambiar o agregar algo nuevo en la pagina?, o tal ves algun tips util para otra pagina interesante? "
      rows="3"
      max-rows="6"
      class="mb-3"
      :disabled="disabled"
      :hidden="hidden"
    ></b-form-textarea>

    <b-button 
      variant="success" 
      class="mb-2" 
      @click="enviar()" 
      :disabled="disabled"
      :hidden="hidden"
      >Enviar Comentario</b-button
    >

    <h3 :hidden="!hidden">Gracias por tus sugerencias. La tendremos en cuenta</h3>

  </div>
</template>

<script>
import db from "../db.js";

export default {
  name: "Comentario",
  data() {
    return {
      disabled : false,
      hidden : false,
      comentario: "",
    };
  },
  methods: {
    async enviar() {
      this.disabled = true;
      const users = db.collection('comentarios');

      console.log("c", this.comentario);
      await users.add({
        text: this.comentario
      });

      console.log('Agregado gracias');
      this.hidden = true;      
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
