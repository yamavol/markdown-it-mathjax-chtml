const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tex2html = require('../src/tex2html');

function fp(_file) {
    return path.join(__dirname, _file);
}

describe('mathjax basic conversion', function(){
    const result = tex2html('1+a');
    it('conversion succeed', function(){
        assert.notEqual(typeof result, 'undefined');
    });
});


describe('markdown-it conversion', function(){
    const md = require('markdown-it')();
    const mj = require('../src/index');

    const opts = { // options for markdown-it plugin

    }; 
    opts.mathjax = { // options for mathjax conversion
        fontURL: '/js/mathjax/css'
    }; 
    md.use(mj, opts);

    it('markdown conversion sample', function() {
        const mdcontent = fs.readFileSync(fp('test1.md'), 'utf-8');
        const htmlcontent = md.render(mdcontent);
        let html = 
            `<head>
            <style>body { font-size: 20px; }</style>
            <link rel="stylesheet" href="./mathjax.css">
            </head>
            <body>
            ${htmlcontent}
            </body>`;
        fs.writeFileSync(fp('result1.html'), html);
    });
})

