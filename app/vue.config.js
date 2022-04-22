// Inside vue.config.js
module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: "Tips-Ptv",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/sw.js',
      swDest: 'service-worker.js'
      // ...other Workbox options...
    }
  },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete('workbox')
        config.plugins.delete('pwa')
      },
      builderOptions: {
        publish: [
          {
            "provider": "github",
            "owner": "marcosjara",
            "repo": "tips_ptv_web",
            "token": "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"
          }]
      }
    }
  }
};
