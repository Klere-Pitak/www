module.exports = (ctx) => ({
    plugins: {
        'postcss-import': { root: ctx.file.dirname },
        'postcss-preset-env': {},
        'postcss-nested': {},
        autoprefixer: {},
        cssnano: ctx.env === 'production' ? {} : false,
    },
});