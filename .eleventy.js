const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const csso = require('postcss-csso')
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

module.exports = function(eleventyConfig) {

    eleventyConfig.addTemplateFormats('css');

    eleventyConfig.addExtension('css', {
        outputFileExtension: 'css',
        compile: async (content, inputPath) => {
            if (inputPath !== './src/styles/index.css') {
                return;
            }

            return async () => {
                const output = await postcss([
                    autoprefixer,
                    postcssNested,
                    cssnano({ preset: 'default' }),
                ])
                .use(postcssImport())
                .use(postcssPresetEnv())
                .process(content, { from: inputPath })
                
                return output.css
            }
        }
    })

    // eleventyConfig.addPassthroughCopy('src/styles/style.css');
    eleventyConfig.addPassthroughCopy('assets');

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}