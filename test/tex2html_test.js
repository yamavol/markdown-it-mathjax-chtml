const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const assert = require('assert')
const tex2html = require('../src/tex2html');


function fp(_file) {
  return path.join(__dirname, _file);
}

describe('basic conversion test', () => {
  it('conversion succeeds', function () {
    const converter = tex2html();
    const result = converter.convert('1+a');
    assert.notStrictEqual(typeof result, 'undefined');
  });
  it('check converted output', function () {
    const converter = tex2html();
    const result = converter.convert('1+a');
    console.log(result);
  });
  it('get css', function () {
    const converter = tex2html();
    const css = converter.getCSS();
    assert.strictEqual(css.length > 0, true);
  });
})


describe('tex2html output test ', () => {
  const converter = tex2html();

  const dom = new jsdom.JSDOM('<!DOCTYPE><html><head></head><body></body></html>');
  const window = dom.window;
  const document = window.document;
  const styleNode = document.createElement('link');
  styleNode.setAttribute('rel', 'stylesheet');
  styleNode.setAttribute('href', 'tex2html_page_test.css');
  document.head.appendChild(styleNode);

  const createMathNode = tex => {
    const node = document.createElement('p');
    node.innerHTML = converter.convert(tex);
    return node;
  }

  document.body.appendChild(createMathNode(`ax^2 + bx + c`));
  document.body.appendChild(createMathNode(`\\frac{a}{b}`));

  fs.writeFileSync(fp('tex2html_page_test.html'), dom.serialize());
  fs.writeFileSync(fp('tex2html_page_test.css'), converter.getCSS());
})