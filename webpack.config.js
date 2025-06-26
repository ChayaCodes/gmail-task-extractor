const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        background: './src/background/background.ts',
        content: './src/content/main.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        environment: {
            dynamicImport: false,
            arrowFunction: true,  
            destructuring: true,  
        }
    },
    devtool: false,
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...' 
        ],
        moduleIds: 'deterministic',  
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            target: "es2015"
                        }
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'public', to: '' },
                { 
                    from: 'node_modules/@inboxsdk/core/pageWorld.js',
                    to: 'pageWorld.js'
                }
            ],
        }),
    ],
};