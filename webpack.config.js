const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  plugins: [
    new CopyPlugin([
      {
        from: "*.html",
        to: "./"
      },
      {
        from: "*.css",
        to: "./"
      }
    ])
  ]
};
