import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { parseHTML } from "linkedom";
import { MathjaxEngine } from "../lib/mathjax.js";
const __dirname = import.meta.dirname;

function fp(_file) {
  return path.join(__dirname, _file);
}

describe("basic conversion test", () => {
  it("conversion succeeds", function () {
    const converter = new MathjaxEngine();
    const result = converter.convert("1+a");
    assert.strictEqual(typeof result, "string");
  });
  it("check converted output", function () {
    const converter = new MathjaxEngine();
    const result = converter.convert("1+a");
    console.log(result);
    assert.strictEqual(result.startsWith("<mjx-container"), true);
    assert.strictEqual(result.endsWith("</mjx-container>"), true);
  });
  it("get css", function () {
    const converter = new MathjaxEngine();
    const css = converter.stylesheet();
    assert.strictEqual(css.length > 0, true);
  });
});


describe("tex2html output test ", () => {
  const converter = new MathjaxEngine();

  const dom = parseHTML("<!DOCTYPE><html><head></head><body></body></html>");
  const window = dom.window;
  const document = window.document;
  const styleNode = document.createElement("link");
  styleNode.setAttribute("rel", "stylesheet");
  styleNode.setAttribute("href", "tex2html_page_test.css");
  document.head.appendChild(styleNode);

  const createMathNode = tex => {
    const node = document.createElement("p");
    node.innerHTML = converter.convert(tex);
    return node;
  };

  document.body.appendChild(createMathNode("ax^2 + bx + c"));
  document.body.appendChild(createMathNode("\\frac{a}{b}"));

  fs.writeFileSync(fp("tex2html_page_test.html"), document.toString());
  fs.writeFileSync(fp("tex2html_page_test.css"), converter.stylesheet());
});