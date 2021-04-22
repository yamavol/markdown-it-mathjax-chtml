const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MarkdownIt = require('markdown-it');
const MathjaxPlugin = require('../src/index');

function fp(_file) {
  return path.join(__dirname, _file);
}

function file_output(html, css, basename) {
  const htmlpath = basename + '.html'
  const csspath = basename + '.css'
  let dom =
    `<head>
        <style>body { font-size: 20px; }</style>
        <link rel="stylesheet" href="./${csspath}">
        </head>
        <body>
        ${html}
        </body>`;
  fs.writeFileSync(fp(htmlpath), dom);
  fs.writeFileSync(fp(csspath), css);
}

describe('markdown-it no-config conversion', function () {
  it('[A0] conversion', function () {
    const md = MarkdownIt();
    const mj = MathjaxPlugin();
    md.use(mj.plugin());
    const text = fs.readFileSync(fp('test1.md'), 'utf-8');
    const html = md.render(text);
    const css = mj.getCSS();
    file_output(html, css, 'result_A0');
  });
})


describe('markdown-it basic conversion', function () {
  const opts = {
    throwOnError: true
  };
  opts.mathjax = {
    fontURL: 'https://cdn.jsdelivr.net/npm/mathjax-full@3.1.2/es5/output/chtml/fonts/woff-v2'
  }

  const md = MarkdownIt();
  const mj = MathjaxPlugin(opts);
  md.use(mj.plugin());

  it('[B0] conversion', function () {
    const text = fs.readFileSync(fp('test1.md'), 'utf-8');
    const html = md.render(text);
    const css = mj.getCSS();
    file_output(html, css, 'result_B0');
  });
})