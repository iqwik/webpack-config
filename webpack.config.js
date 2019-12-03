const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const prodPath = path.join(__dirname, '/public');
const devPath = path.join(__dirname, '/dist');
const isDev = NODE_ENV === 'development';

const config = {
    entry: {
        app: './main.js'
    },
    context: __dirname,
    output: {
        filename: isDev ? '[name].js' : 'assets/js/[name].[hash:6].min.js',
        path: prodPath,
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({ __IS_DEV__ : isDev }),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : 'assets/css/[name].[hash:6].min.css',
            chunkFilename: isDev ? '[id].css' : '[id].[hash:6].min.css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: devPath+'/html/index.html',
        })
    ],
    module:
        {
            rules:
            [
                {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: [{
                            loader: 'babel-loader',
                            options: {
                                presets: ['env', 'react']
                            }
                        }
                    ]
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: /node_modules/,
                    use:
                    [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                localIdentName: '[name]--[local]--[hash:base64:6]'
                            }
                        },
                        'sass-loader',
                        'postcss-loader',
                        'resolve-url-loader',
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use:
                    [
                        {
                            loader: 'file-loader',
                            options: {
                                name: isDev ? '[path][name].[ext]' : 'assets/[path][name]_[hash:base64:6].[ext]',
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 70
                                }
                            }
                        },
                    ],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: isDev ? '[path][name].[ext]' : 'assets/[path][name]_[hash:base64:6].[ext]',
                        }
                    },
                }
            ]
    },
    resolve: {
        modules: [__dirname, 'node_modules'],
        extensions: ['.js', '.jsx'],
    },
    watch: isDev,
    watchOptions: { aggregateTimeout: 100 },
    devtool: isDev ? 'cheap-inline-module-source-map' : false,
    optimization: {
        minimize: !isDev
    }
};

module.exports = config;