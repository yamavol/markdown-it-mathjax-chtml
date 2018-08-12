const fs = require('fs');
const path = require('path');
const markdownit = require('markdown-it');

function fp(_file) {
    return path.join(__dirname, _file);
}

// setup plugin to markdown-it
const md = markdownit();
const mj = require('../src/index');
const opts = { // options for the markdown-it plugin

}; 
opts.mathjax = { // options for the mathjax configuration
    fontURL: '/js/mathjax/css'
}; 
md.use(mj, opts);

const mdcontent = fs.readFileSync(fp('sample.md'), 'utf-8');
const htmlcontent = md.render(mdcontent);
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
const tex2html = require('../src/tex2html');
fs.writeFileSync(fp('mathjax.css'), tex2html('', opts.mathjax).css);

console.log('sample completed');