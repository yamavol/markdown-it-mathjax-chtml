# markdown-it-mathjax-chtml

This markdown-it plugin converts mathematics equation (TeX) into MathJax CommonHTML output. It uses MathJax's server-side rendering feature. 

Since all equations are pre-converted, the reader can view the equation even if javascript is disabled. The initial motivation to create this plugin was to speed up the math-rendering, but resulted not as fast as I expected. 

If you are looking for a more standard usage, other plugins such as [`markdown-it-mathjax`](https://github.com/classeur/markdown-it-mathjax) are probably recommended.

This library is currently under development. APIs are subjective to change for better usage. Any contributions are welcome.

## usage

```js
const markdownIt = require('markdown-it')();
const mdMathJax = require('markdown-it-mathjax-chtml');

// create instance
const mj = mdMathJax();

// create plugin
markdownIt.use(mj.plugin());

const result = markdownIt.render('#Markdown \n $$\\sqrt{1+2x}$$');
```

To configure the plugin, pass an object. 
```js
const mj = mdMathJax({});
// or 
markdownIt.use(mj.plugin(), {});
```

After rendering has completed, you need to get CSS contents.
```js
const css = mj.getCSS();
```
Save this CSS somewhere and load it from your html file.

```html
<link rel="stylesheet" href="/js/mathjax/mathjax.css">
```
## Options

Please see the definition files.

[index.d.ts](https://github.com/yamavol/markdown-it-mathjax-chtml/blob/master/src/index.d.ts)

[tex2html.d.ts](https://github.com/yamavol/markdown-it-mathjax-chtml/blob/master/src/tex2html.d.ts)

### Plugin configuration

| key          | type   | description                                     |
|--------------|--------|-------------------------------------------------|
| mathjax      | object | mathjax confugration with some extension        |

### Mathjax configuration

| key          | type    | description                                         |
|--------------|---------|-----------------------------------------------------|
| inline       | boolean | Reserved for plugin. Controls the display mode.     |
| em,ex,width  | number  | Used to configure the output. Seems not working?    |
| tex          | object  | Mathjax tex object. See official mathjax document.  |
| chtml        | object  | Mathjax chtml object. See official mathjax document.|

## License
- ISC