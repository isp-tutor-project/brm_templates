module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("templates/brm/main.css")
    eleventyConfig.addPassthroughCopy("templates/brm/brm.js")
    // eleventyConfig.addPassthroughCopy("_assets/*.*")
    return {
        dir: {
            input: "templates",
            output: "dist",
            data: "_data",
            includes: "_includes"
        },
        templateFormats: ["njk", "jpg", "jpeg", "jfif", "png", "gif", "mp3", "mp4", "docx", "xml"]
    }
}