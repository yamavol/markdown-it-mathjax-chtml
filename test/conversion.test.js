import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import markdownIt from "markdown-it";
import MdMjPlugin from "../lib/index.js";
import { trimIndent as t } from "./test-utils.test.js";
const __dirname = import.meta.dirname;

function fp(filepath) {
  return path.join(__dirname, filepath);
}

function writeToFile(html, css, basename) {
  const htmlpath = basename + ".html";
  const csspath = basename + ".css";
  let dom = t(`
    <head>
      <style>body { font-size: 20px; }</style>
      <link rel="stylesheet" href="./${csspath}">
    </head>
    <body>
      ${html}
    </body>`);
  fs.writeFileSync(fp(htmlpath), dom);
  fs.writeFileSync(fp(csspath), css);
}

describe("markdown-it no-config conversion", function () {
  it("[A0] conversion", function () {
    const md = markdownIt();
    const mj = new MdMjPlugin();
    md.use(mj.plugin());
    const text = fs.readFileSync(fp("test1.md"), "utf-8");
    const html = md.render(text);
    const css = mj.stylesheet();
    writeToFile(html, css, "result_A0");
  });
});


describe("markdown-it basic conversion", function () {
  const opts = {
    throwOnError: true,
    mathjax: {
      tex: {
        macros: {
          bm: ["\\boldsymbol{#1}", 1]
        }
      },
      chtml: {
        // note: url must not suffixed with slash. That's how mathjax works.
        fontURL: "https://cdn.jsdelivr.net/npm/mathjax-full@3.2.2/es5/output/chtml/fonts/woff-v2"
      }
    }
  };

  const md = markdownIt();
  const mj = new MdMjPlugin(opts);
  md.use(mj.plugin());

  it("[B0] conversion", function () {
    const text = fs.readFileSync(fp("test1.md"), "utf-8");
    const html = md.render(text);
    const css = mj.stylesheet();
    writeToFile(html, css, "result_B0");
  });
});