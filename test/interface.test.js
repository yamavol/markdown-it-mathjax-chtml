import assert from "node:assert";
import { describe, it } from "node:test";
import MathjaxPlugin from "../lib/index.js";

describe("plugin initialization", function () {
  it("plugin is defined", function () {
    const mj = new MathjaxPlugin();
    assert.strictEqual(typeof mj.plugin(), "function");
  });
  it("getCSS is callable", function () {
    const mj = new MathjaxPlugin();
    assert.strictEqual(typeof mj.stylesheet(), "string");
  });
});
