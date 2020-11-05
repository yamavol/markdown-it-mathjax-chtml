# markdown-it-mathjax-chtml

This markdown-it plugin converts mathematics equation (TeX) into MathJax CommonHTML output. It uses MathJax's server-side rendering feature. Since all equations are converted and embedded into the document, the page should show up much faster than when dynamic processing is used. 

If you are looking for a more standard usage, other plugins such as [`markdown-it-mathjax`](https://github.com/classeur/markdown-it-mathjax) are probably recommended.

Current library provides limited feature to satisfy author's requirement. We welcome any kind of support. APIs are subjective to change without extra care during the development phase (0.x.x).

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

- TBD (see type definitions file)

## License
- ISC