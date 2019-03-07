const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PathRewriterPlugin = require('webpack-path-rewriter')

const sassLoaders = [
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            plugins: [
                autoprefixer({
                    browsers: ['last 2 versions'],
                })
            ],
        },
    },
    'sass-loader?importLoaders=1&includePaths[]=' + path.resolve(__dirname, './static')
]

const cssExtractor = new ExtractTextPlugin('[name]-[hash].css')

const config = {
    entry: './src/bootstrapper.js',
    resolve: {
        extensions: ['.js', '.scss'],
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.join(__dirname, './dist'),
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                loaders: ['uglify-loader', 'babel-loader?presets[]=es2015'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader'),
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(sassLoaders),
            },
            {
                test: /\.woff$/,
                loaders: ['url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]'],
            },
            {
                test: /\.woff2$/,
                loaders: ['url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]'],
            },
            {
                test: /\.png$/,
                loader: 'file-loader?name=[name].[ext]&limit=4096'
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
        cssExtractor,
        new PathRewriterPlugin(),
        new webpack.ProvidePlugin({
            moment: 'moment',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin(),
    ],
}

module.exports = config
