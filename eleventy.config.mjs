import markdownIt from "markdown-it";

const md = markdownIt({ typographer: false });

export default function (eleventyConfig) {
  ["styles.css", "script.js", "assets", "admin"].forEach((path) =>
    eleventyConfig.addPassthroughCopy(path)
  );

  // **bold** and *italic* in content fields
  eleventyConfig.addFilter("md", (text) => (text ? md.renderInline(String(text)) : ""));

  // When the site was built: the counters' fallback date (the backup numbers are as of this publish)
  eleventyConfig.addGlobalData("buildDate", () => new Date());
  eleventyConfig.addFilter("longDate", (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Jerusalem" })
  );

  return {
    dir: { input: ".", output: "_site", data: "_data" }
  };
}
