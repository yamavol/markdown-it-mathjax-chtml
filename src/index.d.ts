import { PluginSimple, PluginWithOptions } from 'markdown-it'
import tex2html, { MathjaxConfig } from './tex2html'

export = MathjaxPlugin

declare namespace MathjaxPlugin {
  interface PluginOptions {
    mathjax: Partial<MathjaxConfig>
  }
}


declare function MathjaxPlugin(options?: Partial<MathjaxPlugin.PluginOptions>): MathjaxPlugin;
declare class MathjaxPlugin {
  constructor(options?: Partial<MathjaxPlugin.PluginOptions>);
  options: MathjaxPlugin.PluginOptions;
  tex2html: ReturnType<typeof tex2html>;
  init(options?: Partial<MathjaxPlugin.PluginOptions>): void;
  plugin(): PluginWithOptions<Partial<MathjaxPlugin.PluginOptions>>;
  getCSS(): string;
}

