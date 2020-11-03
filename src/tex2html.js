/**
 * The original work is distributed by the Mathjax (apache-2.0)
 * https://github.com/mathjax/mathjax-v3
 * https://github.com/mathjax/mj3-demos-node/blob/master/mj3-tex2html
 * 
 */
const {TeX} = require('mathjax-full/js/input/tex');
const {CHTML} = require('mathjax-full/js/output/chtml');
const {HTMLMathItem} = require('mathjax-full/js/handlers/html/HTMLMathItem');
const {HTMLDocument} = require('mathjax-full/js/handlers/html/HTMLDocument');
const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor');
const {LiteDocument} = require('mathjax-full/js/adaptors/lite/Document.js');
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages');

module.exports = function(input, opts) {

    // set default conversion parameters
    opts        = opts            || {};
    opts.inline = opts.inline     || false;
    opts.em     = opts.em         || 16;
    opts.ex     = opts.ex         || 8;
    opts.width  = opts.width      || 80*16;
    opts.fontURL= opts.fontURL    || 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2';
    opts.packages = opts.packages || AllPackages.sort().join(', ');

    // set up mathjax and conversion function
    const my_packages = opts.packages.split(/\s*,\s*/);
    const tex = new TeX({ packages: my_packages});
    const chtml = new CHTML({fontURL: opts.fontURL});
    
    const adaptor = liteAdaptor();
    let html = new HTMLDocument(new LiteDocument(), adaptor, {
        InputJax: tex,
        OutputJax: chtml
    });

    const Typeset = (string, display, em, ex, cwidth) => {
        const math = new HTMLMathItem(string, tex, display);
        math.setMetrics(em, ex, cwidth, 100000, 1.21); // value 1.21 renders nicely(?)
        math.compile();
        math.typeset(html);
        return adaptor.outerHTML(math.typesetRoot);
    }
    
    return {
        html: Typeset(input, !opts.inline, opts.em, opts.ex, opts.width),
        css: adaptor.textContent(chtml.styleSheet(html))
    };
}