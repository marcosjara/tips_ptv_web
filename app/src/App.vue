<template>


    <v-app>
      <v-banner
        v-if="deferredPrompt"
        color="info"
        dark
        class="text-left"
      >
        Crear un acceso directo en el Escritorio
        
        <template v-slot:actions>
          <v-btn text @click="dismiss">Cancelar</v-btn>
          <v-btn text @click="install">Instalar</v-btn>
        </template>
      </v-banner>


    <b-button v-if="updateExists" @click="refreshApp" variant="success">
      Click AQUI ver la ultima version disponible
    </b-button>
    
    <principal/>

    </v-app>
</template>

<script>
import Principal from "./components/Principal.vue";

export default {
  name: "App",
  components: {
    Principal,
  },
  data() {
    return {
      deferredPrompt: null,
      refreshing: false,
      registration: null,
      updateExists: false,
    }
  },
  created() {
    
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
    /*
    window.addEventListener("isUpdateAvailable", e => {
      e.preventDefault();
      //this.$bvToast.show("toast");
    });
    */
   
    //Actualizacion
    document.addEventListener(
      'swUpdated', this.showRefreshUI, { once: true }
    );
    if (navigator.serviceWorker) {  
      navigator.serviceWorker.addEventListener(
        'controllerchange', () => {
          if (this.refreshing) return;
          this.refreshing = true;
          window.location.reload();
        }
      );
    }    
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
    showRefreshUI (e) {
      // Display a button inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail;
      this.updateExists = true;
    },
    refreshApp () {
      // Handle a user tap on the update app button.
      this.updateExists = false;
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) { return; }
      this.registration.waiting.postMessage('skipWaiting');
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
@media only screen and (max-width: 320px) {

   body { 
      font-size: 0.7em; 
   }

}
</style>
