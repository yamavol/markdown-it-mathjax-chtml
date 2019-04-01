const assert = require('assert');
const MathjaxPlugin = require('../src/index');

describe('plugin initialization (classic style)', function() {
    const mj = new MathjaxPlugin();
    it('plugin is defined', function() {
        assert.equal(typeof mj.plugin(), 'function')
    })
    it('css is defined', function() {
        assert.equal(typeof mj.css, 'string')
    })
})

describe('plugin initialization (function style)', function() {
    const mj = MathjaxPlugin();
    it('plugin is defined', function() {
        assert.equal(typeof mj.plugin(), 'function')
    })
    it('css is defined', function() {
        assert.equal(typeof mj.css, 'string')
    })
})