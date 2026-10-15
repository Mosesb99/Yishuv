import markdownIt from "markdown-it";

const md = markdownIt({ typographer: false });

export default function (eleventyConfig) {
  ["styles.css", "script.js", "assets", "admin"].forEach((path) =>
    eleventyConfig.addPassthroughCopy(path)
  );

  // **bold** and *italic* in content fields
  eleventyConfig.addFilter("md", (text) => (text ? md.renderInline(String(text)) : ""));

  return {
    dir: { input: ".", output: "_site", data: "_data" }
  };
}
