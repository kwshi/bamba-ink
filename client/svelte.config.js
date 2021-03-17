const svPreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: svPreprocess({
    postcss: true,
    defaults: {
      script: "typescript",
      style: "postcss",
    },
  }),
};
