/**
 * mathjax.ts
 *
 * Server-Side Mathjax converter from TeX input to CommonHTML.
 *
 * see official examples for more information
 * https://github.com/mathjax/mathjax-v3
 * https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2chtml
*/
import { merge } from "lodash-es";
import { type LiteDocument } from "mathjax-full/js/adaptors/lite/Document.js"; /* D */
import { LiteElement } from "mathjax-full/js/adaptors/lite/Element.js"; /* N */
import { type LiteText } from "mathjax-full/js/adaptors/lite/Text.js"; /* T */
import { type LiteAdaptor, liteAdaptor} from "mathjax-full/js/adaptors/liteAdaptor.js";
import { DOMAdaptor } from "mathjax-full/js/core/DOMAdaptor.js";
import { type MathDocument } from "mathjax-full/js/core/MathDocument.js";
import { type MathItem } from "mathjax-full/js/core/MathItem.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { CHTML } from "mathjax-full/js/output/chtml.js";

type N = LiteElement;
type T = LiteText;
type D = LiteDocument;

const MATHJAX_DEFAULT_FONT_URL =
  "https://cdn.jsdelivr.net/npm/mathjax-full@3/es5/output/chtml/fonts/woff-v2";

// --- AllPackages will be removed in Mathjax v4. 
// --- Currently no success. Dynamic loading mechanism might be necessary.
// 
// // @ts-expect-error: no d.ts file
// import { source } from "mathjax-full/components/mjs/source.js";
// const AllPackages = Object.keys(source)
//   .filter(name => name.substring(0,6) === "[tex]/")
//   .map(name => name.substring(6))
//   .sort();


interface AnyObject {
  [x: string]: any;
}

/// http://docs.mathjax.org/en/latest/options/input/tex.html
interface TexConfig {
  packages: string | [string] | AnyObject;
  inlineMath: [[string, string]];
  displayMath: [[string, string]];
  processEscapes: boolean;
  processEnvironments: boolean;
  processRefs: boolean;
  digits: RegExp;
  tags: string;
  tagSide: string;
  tagIndent: string;
  useLabelIds: boolean;
  multlineWidth: string;
  maxMacros: number;
  maxBuffer: number;
  baseURL: string;
  formatError: (jax: object, err: Error) => void;

  // TeX Extension Options
  macros: AnyObject;
}

/// http://docs.mathjax.org/en/latest/options/output/index.html
interface CHTMLConfig {
  // Common options for all output
  scale: number;
  minScale: number;
  matchFontHeight: boolean;
  mtextInheritFont: boolean;
  merrorInheritFont: boolean;
  mtextFont: string;
  merrorFont: string;
  mathmlspacing: boolean;
  skipAttributes: AnyObject;
  exFactor: number;
  displayAlign: string;
  displayIndent: number | string;

  // CHTML Options
  fontURL: string;
  adaptiveCSS: boolean;
}

export interface Options {
  inline: boolean;
  em: number;
  ex: number;
  width: number;
  tex?: Partial<TexConfig>;
  chtml?: Partial<CHTMLConfig>;
}

const defaultOption: Options = {
  inline: false,
  em: 16,
  ex: 8,
  width: 80 * 16,
  tex: {
    packages: AllPackages,
  },
  chtml: {
    scale: 1.21, // magic # chosen which look nice for me
    fontURL: MATHJAX_DEFAULT_FONT_URL,
    adaptiveCSS: true,
    exFactor: 5,
  },
};

/**
 * Initialize and encapsulates mathjax instances to generate
 * CommonHTML from TeX input.
 *
 * There are 2 important methods. One converts the input.
 * The other returns a stylesheet document. The stylesheet must be included
 * in your HTML document to render the equation properly.
 */
export class MathjaxEngine {
  option: Options;
  adaptor: LiteAdaptor;
  tex: TeX<N, T, D>;
  chtml: CHTML<N, T, D>;
  html: MathDocument<N, T, D>;

  constructor(option?: Partial<Options>) {
    this.option = merge({}, defaultOption, option);

    if (typeof this.option.tex?.packages === "string") {
      this.option.tex.packages = this.option.tex.packages.split(/\s*,\s*/);
    }

    this.adaptor = liteAdaptor();
    RegisterHTMLHandler(this.adaptor as DOMAdaptor<N, T, D>);

    const tex = new TeX<N, T, D>(this.option.tex);
    const chtml = new CHTML<N, T, D>(this.option.chtml);
    const html = mathjax.document("", {
      InputJax: tex,
      OutputJax: chtml,
    });

    html.addRenderAction("typeset", 155, renderDoc, renderMath);

    this.tex = tex;
    this.chtml = chtml;
    this.html = html;

    function renderDoc(_doc: MathDocument<N, T, D>) {}
    function renderMath(math: MathItem<N, T, D>, doc: MathDocument<N, T, D>) {
      const adaptor = doc.adaptor;
      const text = adaptor.node("mjx-copytext", { "aria-hidden": true }, [
        adaptor.text(math.math),
      ]);
      adaptor.setStyle(text, "position", "absolute");
      adaptor.setStyle(text, "display", "none");
      adaptor.setStyle(text, "width", "0");
      adaptor.setStyle(math.typesetRoot, "position", "relative");
      adaptor.append(math.typesetRoot, text);
    }
  }

  /**
   * convert TeX input to CHTML.
   *
   * @param tex       input string
   * @param override  parameter to override the defaults, if you wish to
   * @returns
   */
  convert(tex: string, override?: Partial<Options>): string {
    const node = this.html.convert(tex, {
      display: !(override?.inline ?? this.option.inline),
      em: override?.em ?? this.option.em,
      ex: override?.ex ?? this.option.ex,
      containerWidth: override?.width ?? this.option.width,
      scale: 1.0,
    });
    if (node instanceof LiteElement) {
      return this.adaptor.outerHTML(node);
    } else {
      return "ERROR";
    }
  }

  /**
   * returns adaptive css (stylesheet for the processed equations only),
   * or the full mathjax css (if configured)
   *
   * @returns css content
   */
  stylesheet(): string {
    return this.adaptor.textContent(this.chtml.styleSheet(this.html));
  }
}
