export = tex2html;

declare namespace tex2html {

  interface OptionList {
    [name: string]: any
  }

  /// http://docs.mathjax.org/en/latest/options/input/tex.html
  interface TexConfig extends OptionList {
    packages: string | [string] | OptionList
    inlineMath: [[string,string]],
    displayMath: [[string,string]],
    processEscapes: boolean,
    processEnvironments: boolean,
    processRefs: boolean,
    digits: RegExp,
    tags: string,
    tagSide: string,
    tagIndent: string,
    useLabelIds: boolean,
    multlineWidth: string,
    maxMacros: number,
    maxBuffer: number,
    baseURL: string,
    formatError: Function,

    // TeX Extension Options
    macros: OptionList,
  }

  /// http://docs.mathjax.org/en/latest/options/output/index.html
  interface CHTMLConfig extends OptionList {
    // Common options for all output
    scale: number,
    minScale: number,
    matchFontHeight: boolean,
    mtextInheritFont: boolean,
    merrorInheritFont: boolean,
    mtextFont: string,
    merrorFont: string,
    mathmlspacing: boolean,
    skipAttributes: OptionList,
    exFactor: number,
    displayAlign: string,
    displayIndent: number|string,

    // CHTML Options
    fontURL: string
    adaptiveCSS: boolean
  }

  interface Tex2HtmlConfig {
    inline: boolean
    em: number
    ex: number
    width: number
    tex: Partial<TexConfig>
    chtml: Partial<CHTMLConfig>
  }
}

declare function tex2html(opts?: Partial<tex2html.Tex2HtmlConfig>): {
    convert(tex: string, param?: Partial<tex2html.Tex2HtmlConfig>): string;
    getCSS(): string;
};
