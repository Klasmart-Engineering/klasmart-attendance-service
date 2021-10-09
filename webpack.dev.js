const path = require('path');
const { IgnorePlugin } = require('webpack');

console.log(__dirname);
module.exports = {
    mode: 'development',
    target: 'node',
    entry: ['./src/index.ts'],
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
          "@src": path.resolve(__dirname, "src/"),
          "@tests": path.resolve(__dirname, "tests/")
        },
        symlinks: false
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new IgnorePlugin({
        resourceRegExp: /^pg-native$/,
      }),
    ],
    externals: {
        

    },

    devServer: {
        port: 3000
    }
};