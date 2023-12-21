const slugify = require("slugify");

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/scripts');

    // md data import
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("_posts/*.md");
    });

    eleventyConfig.addFilter('withCategory', function(collection, category) {
        if (!category) return collection;
        return collection.filter(item => slugify(item.data.category, {
            lower: true,
            trim: true,
            replacement: "-",
            remove: /[*+~.·,()'"`´%!?¿:@]/g
        }) == category)
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