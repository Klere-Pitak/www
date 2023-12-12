const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
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

    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy('src/scripts');

    // md data import
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("_posts/*.md");
    });

    function sortByDate(a, b) {
        return Math.sign(Number(a.fileSlug) - Number(b.fileSlug))
    }

    eleventyConfig.addFilter('sortByDate', (values) => values.sort(sortByDate))

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}