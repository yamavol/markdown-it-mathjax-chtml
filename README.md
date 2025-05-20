# markdown-it-mathjax-chtml

This markdown-it plugin converts mathematics equation (TeX) into MathJax CommonHTML output. It uses MathJax's server-side rendering feature. 

## Usage

```js
import markdownIt from 'markdown-it';
import mdMathJax from 'markdown-it-mathjax-chtml';

const md = markdownIt();
const mj = new mdMathJax({
  // customize mathjax here
});

markdownIt.use(mj.plugin());
const html = markdownIt.render('#Markdown \n $$\\sqrt{1+2x}$$');
```

After all rendering has completed, get the math stylesheet.
```js
const css = mj.stylesheet();
```

Save this stylesheet somewhere and load it from your html file.

```html
<link rel="stylesheet" href="/js/math.css">
```
