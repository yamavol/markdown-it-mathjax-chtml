/**
 * The original work is distributed by the Mathjax (apache-2.0)
 * https://github.com/mathjax/mathjax-v3
 * https://github.com/mathjax/mj3-demos-node/blob/master/mj3-tex2html
 * 
 */
const { mathjax } = require('mathjax-full/js/mathjax');
const { TeX } = require('mathjax-full/js/input/tex');
const { CHTML } = require('mathjax-full/js/output/chtml');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');

/**
 * @template T
 * @param  {T|undefined} param 
 * @param  {T}           defaultParam 
 * @return {T}
 */
function useParam(param, defaultParam) {
  return param !== undefined ? param : defaultParam;
}

/**
 * @typedef { import('./tex2html').Tex2HtmlConfig } Tex2HtmlConfig
 */

const MATHJAX_DEFAULT_FONT_URL = 'https://cdn.jsdelivr.net/npm/mathjax-full@3/es5/output/chtml/fonts/woff-v2';

/**
 * tex2html is a module which converts tex string into Common HTML format.
 * The exported function initializes the engine and returns two functions.
 * One converts the input. Another function creates CSS content.
 * 
 * The initial parameters are used to configure the engine. 
 * You can also pass parameters when converting. This parameters are used over
 * initial parameters, but some parameters are ignored.
 * 
 * @param {Partial<Tex2HtmlConfig>=} opts 
 */
module.exports = function (opts) {
  // set default parameters
  opts = opts || {};
  opts.inline = opts.inline || false;
  opts.em = opts.em || 16;
  opts.ex = opts.ex || 8;
  opts.width = opts.width || 80 * 16;
  opts.tex = opts.tex || {};
  opts.tex.packages = opts.tex.packages || AllPackages.sort().join(', ');
  opts.chtml = opts.chtml || {};
  opts.chtml.scale = opts.chtml.scale || 1.21; // magic # chosen which looks better.
  opts.chtml.fontURL = opts.chtml.fontURL || MATHJAX_DEFAULT_FONT_URL;
  opts.chtml.adaptiveCSS = opts.chtml.adaptiveCSS || true;
  opts.chtml.exFactor = opts.chtml.exFactor || (opts.ex / opts.em);

  // derive some parameters
  if (typeof opts.tex.packages == 'string') {
    opts.tex.packages = opts.tex.packages.split(/\s*,\s*/);
  }

  //
  // set up mathjax and conversion function
  //
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const tex = new TeX(opts.tex);
  const chtml = new CHTML(opts.chtml);
  const html = mathjax.document('', {
    InputJax: tex,
    OutputJax: chtml
  });

  /**
   * Function which converts input 
   * @param {string}          tex      TeX equation
   * @param {Tex2HtmlConfig}   param    conversion parameters
   */
  const Convert = (tex, param) => {
    param = param || opts;
    const node = html.convert(tex || '', {
      display: !useParam(param.inline, opts.inline),
      em: useParam(param.em, opts.em),
      ex: useParam(param.ex, opts.ex),
      containerWidth: useParam(param.width, opts.width),
      scale: 1.0,
    })
    return adaptor.outerHTML(node);
  }

  const GetCSS = () => {
    return adaptor.textContent(chtml.styleSheet(html));
  }

  return {
    convert: Convert,
    getCSS: GetCSS,
  }
};