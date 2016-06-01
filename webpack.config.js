const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PathRewriterPlugin = require('webpack-path-rewriter')

const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?importLoaders=1&includePaths[]=' + path.resolve(__dirname, './static')
]

const cssExtractor = new ExtractTextPlugin('css', '[name].css')

const config = {
    entry: {
        app: ['./src/bootstrapper'],
    },
    resolve: {
        extensions: ['', '.js', '.scss'],
        root: [
            path.join(__dirname, './src'),
        ],
        modulesDirectories: ['node_modules'],
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist'),
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: PathRewriterPlugin.rewriteAndEmit({name: '[name].html'}),
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader?presets[]=es2015'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: cssExtractor.extract('style-loader', 'css-loader'),
            },
            {
                test: /\.scss$/,
                loader: cssExtractor.extract('style-loader', sassLoaders.join('!')),
            },
            {
                test: /\.woff$/,
                loaders: ['url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]'],
            },
            {
                test: /\.woff2$/,
                loaders: ['url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]'],
            },
        ],
    },
    plugins: [
        cssExtractor,
        new PathRewriterPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            moment: 'moment',
        }),
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions'],
        })
    ],
}

module.exports = config
