module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      builderOptions: {
        appId: "jisseki.com",
        win: {
          target: "zip",
          icon: "resources/icon.png"
        },
        mac: {
          target: "dmg",
          icon: "resources/icon.png"
        },
      }
    }
  },
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
};