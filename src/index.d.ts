import MarkdownIt from 'markdown-it'



declare class MathjaxPlugin {
    private _options: MathjaxPlugin.PluginOptions
    constructor(options: MathjaxPlugin.PluginOptions);
    plugin(md: MarkdownIt, options: MathjaxPlugin.PluginOptions): void
    getCSS(): string
}

export = MathjaxPlugin;

declare namespace MathjaxPlugin {

    interface TypedMathJaxConfig {
        inline?: boolean,
        em?: number,
        ex?: number,
        width?: number,
        fontURL?: string,
        packages?: string,
        scale?: number,
        adaptiveCSS?: boolean,
    }
    
    interface PluginOptions {
        mathjax?: TypedMathJaxConfig,
        throwOnError?: boolean,
    }
}