const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?name=images/[name].[ext]']
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "./styles/app.css",
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/raw-index.html"
        })
    ]
};