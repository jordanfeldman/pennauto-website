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
    // Apple MapKit JS token (domain-restricted to pennauto.us). Leave empty to
    // show the Google map to everyone.
    mapkitToken: "eyJhbGciOiJFUzI1NiIsImtpZCI6IkxTM1EzWDI3QTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJQRFdZNEc1Q0ZSIiwiaWF0IjoxNzkwOTA5NjU4LCJleHAiOjE4MjI0NDU2NTgsIm9yaWdpbiI6Imh0dHBzOi8vcGVubmF1dG8udXMifQ.wlBY5J11fSNcImuA3v7Ijoa-2s8hfr9RScrZyPEuTvRMGTuq5mtb9BWHUtaGPd227QbgWQ_7ziXtuaIL8D2fZQ",
    lat: 40.4044461,
    lng: -79.9146862,
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
