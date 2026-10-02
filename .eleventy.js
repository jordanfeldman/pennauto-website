const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Make site data available globally
  eleventyConfig.addGlobalData("site", {
    name: "Penn Automotive",
    phone: "(412) 461-7500",
    email: "info@pennauto.us",
    address: "243 West 8th Ave, West Homestead, PA 15120",
    city: "West Homestead, PA 15120",
    tekmetricShopId: "b92059d2-febd-4dc6-8bbe-7bbea2ec5e50",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
