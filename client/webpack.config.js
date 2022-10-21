const path = require("path");
module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/public`,
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./public"),
    },
    port: 3000,
    open: true,
    watchFiles: ["src/**/*"],
  },
};
