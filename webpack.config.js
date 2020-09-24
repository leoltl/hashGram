var path = require('path');
    
module.exports = {
    entry: './src/chatClient/index.js',
    output: {
        path: path.resolve(__dirname, 'public','scripts'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
              }
          }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};