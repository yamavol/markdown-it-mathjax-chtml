import { merge } from "lodash-es";
import type MarkdownIt from "markdown-it";
import type { PluginSimple } from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";
import { MathjaxEngine, Options as Tex2HtmlOptions } from "./mathjax.js";
import { math_block, math_inline } from "./mdparser.js";

export type PluginOptions = {
  throwOnError: boolean,
  mathjax: Partial<Tex2HtmlOptions>
};

const defaultOptions: PluginOptions = {
  throwOnError: true,
  mathjax: {}
};

function getRenderers(engine: MathjaxEngine, option?: Partial<PluginOptions>) {

  const opt = merge({}, defaultOptions, option);

  function mathjaxInline(tex: string) {
    try {
      const math = engine.convert(tex, { inline: true });
      return math;
    }
    catch (error) {
      logError(error);
      return tex; 
    }
  };

  const mathjaxBlock = function (tex: string) {
    try {
      var math = engine.convert(tex, { inline: false });
      return "<p>" + math + "</p>";
    }
    catch (error) {
      logError(error);
      return tex; 
    }
  };

  function logError(err: unknown) {
    if (opt.throwOnError) { 
      throw err;
    } else {
      console.log(err);
    }
  }
  
  const inlineRenderer: RenderRule = (tokens: Token[], idx: number) => {
    return mathjaxInline(tokens[idx].content);
  };

  const blockRenderer: RenderRule = (tokens: Token[], idx: number) => {
    return mathjaxBlock(tokens[idx].content) + "\n";
  };

  return {
    inlineRenderer,
    blockRenderer,
  };
}

export class MdMjPlugin {

  engine: MathjaxEngine;
  option: PluginOptions;

  constructor(option?: Partial<PluginOptions>) {
    this.option = merge({}, defaultOptions, option);
    this.engine = new MathjaxEngine(this.option.mathjax);
  }

  plugin(): PluginSimple {
    return (md: MarkdownIt) => {
      const renderer = getRenderers(this.engine, this.option);
      md.inline.ruler.after("escape", "math_inline", math_inline);
      md.block.ruler.after("blockquote", "math_block", math_block, {
        alt: ["paragraph", "reference", "blockquote", "list"]
      });
      md.renderer.rules.math_inline = renderer.inlineRenderer;
      md.renderer.rules.math_block = renderer.blockRenderer;
    };
  }

  stylesheet(): string {
    return this.engine.stylesheet();
  }
}

export default MdMjPlugin;
