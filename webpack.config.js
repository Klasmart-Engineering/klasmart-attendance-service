const path = require('path');
const { IgnorePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    // TODO: if mode is set to 'production' entity names are changing 
    // like attendance -> s,  feedback -> d. probably webpack is shortening names
    mode: 'development',
    target: 'node',
    entry: ['./src/index.ts'],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(j|t)s$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          "@src": path.resolve(__dirname, "./src/"),
          "@tests": path.resolve(__dirname, "./tests/")
        },
        symlinks: false
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new IgnorePlugin({
        resourceRegExp: /^pg-native$/,
      }),
    ],
    externals: [nodeExternals({additionalModuleDirs: ["./types/**"]})],

    devServer: {
        port: 3000
    }
};