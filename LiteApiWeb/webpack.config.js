module.exports = {

    entry: './app/index.js',
    
    output: {
        // path: '',
        filename: './wwwroot/bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};