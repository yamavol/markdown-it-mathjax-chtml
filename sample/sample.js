const fs = require('fs');
const path = require('path');
const markdownit = require('markdown-it');
const MDMathjax = require('../src/index');

const FONT_URL_CDN = 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
const FONT_URL_REL = '../node_modules/mathjax3/mathjax2/css'
const FONT_URL_ABS = '/js/mathjax/css'

function fp(_file) {
    return path.join(__dirname, _file);
}

// options for the markdown-it plugin
const opts = { 

}; 
// options for the mathjax configuration.
// this object is pass-throughed to mathjax3 library
opts.mathjax = { 
    fontURL: FONT_URL_CDN
}; 

const mj = MDMathjax(opts);

// setup markdown-it to use this plugin
// 
const md = markdownit();
md.use(mj.plugin(), opts); // 2nd arg is optional

// convert the markdown to html
const sample_markdown = fs.readFileSync(fp('sample.md'), 'utf-8');
const htmlcontent = md.render(sample_markdown);
let html = 
    `<head>
    <style>body { font-size: 20px; }</style>
    <link rel="stylesheet" href="./mathjax.css">
    </head>
    <body>
    ${htmlcontent}
    </body>`;
fs.writeFileSync(fp('result.html'), html);

// create the css file.
fs.writeFileSync(fp('mathjax.css'), mj.css);

console.log('sample completed');