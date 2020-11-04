const assert = require('assert');
const MathjaxPlugin = require('../src/index');

describe('plugin initialization (classic style)', function() {
    it('plugin is defined', function() {
        const mj = new MathjaxPlugin();
        assert.strictEqual(typeof mj.plugin(), 'function')
    })
    it('getCSS is callable', function() {
        const mj = new MathjaxPlugin();
        assert.strictEqual(typeof mj.getCSS(), 'string')
    })
})

describe('plugin initialization (function style)', function() {
    
    it('plugin is defined', function() {
        const mj = MathjaxPlugin();
        assert.strictEqual(typeof mj.plugin(), 'function')
    })
    it('getCSS is callable', function() {
        const mj = MathjaxPlugin();
        assert.strictEqual(typeof mj.getCSS(), 'string')
    })
})