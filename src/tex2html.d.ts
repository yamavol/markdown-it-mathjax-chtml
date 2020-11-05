export = tex2html;

declare namespace tex2html {
  interface MathjaxConfig {
    inline: boolean
    em: number
    ex: number
    width: number
    scale: number
    fontURL: string
    packages: string
    adaptiveCSS: boolean
  }
}

declare function tex2html(opts?: Partial<tex2html.MathjaxConfig>): {
    convert(tex: string, param?: Partial<tex2html.MathjaxConfig>): string;
    getCSS(): string;
};
