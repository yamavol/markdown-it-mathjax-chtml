/**
 * The original work is distributed by the Mathjax (apache-2.0)
 * https://github.com/mathjax/mathjax-v3
 * https://github.com/mathjax/mj3-demos-node/blob/master/mj3-tex2html
 * 
 */
const TeX = require('mathjax3/mathjax3/input/tex').TeX;
const CHTML = require('mathjax3/mathjax3/output/chtml').CHTML;
const HTMLMathItem = require('mathjax3/mathjax3/handlers/html/HTMLMathItem').HTMLMathItem;
const HTMLDocument = require('mathjax3/mathjax3/handlers/html/HTMLDocument').HTMLDocument;
const liteAdaptor = require('mathjax3/mathjax3/adaptors/liteAdaptor').liteAdaptor;
const LiteDocument = require('mathjax3/mathjax3/adaptors/lite/Document.js').LiteDocument;
const AllPackages = require('mathjax3/mathjax3/input/tex/AllPackages').AllPackages;

module.exports = function(input, opts) {

    // set default conversion parameters
    opts        = opts            || {};
    opts.inline = opts.inline     || false;
    opts.em     = opts.em         || 16;
    opts.ex     = opts.ex         || 8;
    opts.width  = opts.width      || 80*16;
    opts.fontURL= opts.fontURL    || 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.1/mathjax2/css';
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