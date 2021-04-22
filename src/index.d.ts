import { PluginSimple, PluginWithOptions } from 'markdown-it'
import tex2html, { Tex2HtmlConfig } from './tex2html'

export = MdMjPlugin

declare namespace MdMjPlugin {
  interface PluginOptions {
    // throwOnError: boolean
    mathjax: Partial<Tex2HtmlConfig>
  }
}


declare function MdMjPlugin(options?: Partial<MdMjPlugin.PluginOptions>): MdMjPlugin;
declare class MdMjPlugin {
  constructor(options?: Partial<MdMjPlugin.PluginOptions>);
  options: MdMjPlugin.PluginOptions;
  tex2html: ReturnType<typeof tex2html>;
  init(options?: Partial<MdMjPlugin.PluginOptions>): void;
  plugin(): PluginWithOptions<Partial<MdMjPlugin.PluginOptions>>;
  getCSS(): string;
}

