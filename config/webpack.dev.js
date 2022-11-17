const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "/src/index.js",
  },
  output: {
    path: path.join(__dirname, "/build"),
    filename: "[name].bundle.js",
    libraryTarget: "umd",
    library: "D3DEFE",
    globalObject: "this",
  },

  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "/build"),
    compress: true,
    hot: true,
    port: 3000,
    overlay: true,
  },
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      inject: "head",
    }),
    new CleanWebpackPlugin(),
  ],
};
