/**
 * @typedef { import('./index') }                   MathjaxPlugin
 * @typedef { import('./index').PluginOptions }     PluginOptions
 * 
 * @typedef { import('./tex2html') }                Tex2HTML
 * @typedef { import('./tex2html').MathjaxConfig}   MathjaxConfig
 * 
 * @typedef { import('markdown-it').PluginWithOptions<Partial<MathjaxConfig>> }  Plugin
 * @typedef { import('markdown-it/lib/parser_inline').RuleInline }      RuleInline
 * @typedef { import('markdown-it/lib/parser_block').RuleBlock }        RuleBlock
 * @typedef { import('markdown-it/lib/renderer').RenderRule }           RenderRule
 * @typedef { import('markdown-it/lib/rules_core/state_core')}          StateCore
 */


/** } */
const createTEX2HTML = require('./tex2html');

createTEX2HTML()

// workaround for mathjax3 beta3
top = true;

const DEFAULT_OPTIONS = {
  throwOnError: true
};

/**
 * Test if potential opening or closing delimieter
 * Assumes that there is a "$" at state.src[pos]
 * @param {StateCore} state 
 * @param {number} pos 
 */
function isValidDelim(state, pos) {
  var prevChar, nextChar,
    max = state.posMax,
    can_open = true,
    can_close = true;

  prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

  // Check non-whitespace conditions for opening and closing, and
  // check that closing delimeter isn't followed by a number
  if (prevChar === 0x20/* " " */ || prevChar === 0x09/* \t */ ||
    (nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
    can_close = false;
  }
  if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
    can_open = false;
  }

  return {
    can_open: can_open,
    can_close: can_close
  };
}

/**
 * @param {StateCore} state 
 * @param {boolean} silent 
 */
function math_inline(state, silent) {
  var start, match, token, res, pos, esc_count;

  if (state.src[state.pos] !== "$") { return false; }

  res = isValidDelim(state, state.pos);
  if (!res.can_open) {
    if (!silent) { state.pending += "$"; }
    state.pos += 1;
    return true;
  }

  // First check for and bypass all properly escaped delimieters
  // This loop will assume that the first leading backtick can not
  // be the first character in state.src, which is known since
  // we have found an opening delimieter already.
  start = state.pos + 1;
  match = start;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    // Found potential $, look for escapes, pos will point to
    // first non escape when complete
    pos = match - 1;
    while (state.src[pos] === "\\") { pos -= 1; }

    // Even number of escapes, potential closing delimiter found
    if (((match - pos) % 2) == 1) { break; }
    match += 1;
  }

  // No closing delimter found.  Consume $ and continue.
  if (match === -1) {
    if (!silent) { state.pending += "$"; }
    state.pos = start;
    return true;
  }

  // Check if we have empty content, ie: $$.  Do not parse.
  if (match - start === 0) {
    if (!silent) { state.pending += "$$"; }
    state.pos = start + 1;
    return true;
  }

  // Check for valid closing delimiter
  res = isValidDelim(state, match);
  if (!res.can_close) {
    if (!silent) { state.pending += "$"; }
    state.pos = start;
    return true;
  }

  if (!silent) {
    token = state.push('math_inline', 'math', 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

/**
 * 
 * @param {StateCore} state 
 * @param {number} start 
 * @param {number} end 
 * @param {boolean} silent 
 */
function math_block(state, start, end, silent) {
  var firstLine, lastLine, next, lastPos, found = false, token,
    pos = state.bMarks[start] + state.tShift[start],
    max = state.eMarks[start]

  if (pos + 2 > max) { return false; }
  if (state.src.slice(pos, pos + 2) !== '$$') { return false; }

  pos += 2;
  firstLine = state.src.slice(pos, max);

  if (silent) { return true; }
  if (firstLine.trim().slice(-2) === '$$') {
    // Single line expression
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }

  for (next = start; !found;) {

    next++;

    if (next >= end) { break; }

    pos = state.bMarks[next] + state.tShift[next];
    max = state.eMarks[next];

    if (pos < max && state.tShift[next] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      break;
    }

    if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
      lastPos = state.src.slice(0, max).lastIndexOf('$$');
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    }

  }

  state.line = next + 1;

  token = state.push('math_block', 'math', 0);
  token.block = true;
  token.content = (firstLine && firstLine.trim() ? firstLine + '\n' : '')
    + state.getLines(start + 1, next, state.tShift[start], true)
    + (lastLine && lastLine.trim() ? lastLine : '');
  token.map = [start, state.line];
  token.markup = '$$';
  return true;
}


/**
 * 
 * @param {MathjaxPlugin} instance 
 * @param {Partial<PluginOptions>} options 
 */
function InitPlugin(instance, options) {
  options = Object.assign({}, options, DEFAULT_OPTIONS);
  options.mathjax = options.mathjax || {};

  instance.options = options;
  instance.tex2html = createTEX2HTML(options.mathjax);
}

/**
 * @class MathjaxPlugin
 * @param {Partial<PluginOptions>} options 
 */
function MathjaxPlugin(options) {
  if (!(this instanceof MathjaxPlugin)) {
    return new MathjaxPlugin(options);
  }
  options = Object.assign({}, options, DEFAULT_OPTIONS);
  options.mathjax = options.mathjax || {};

  /** @name MathjaxPlugin#options */
  this.options = options;

  /** @name MathjaxPlugin#tex2html */
  this.tex2html = createTEX2HTML(options.mathjax);
}

/**
 * @param {Partial<PluginOptions>} options
 */
MathjaxPlugin.prototype.init = function (options) {
  InitPlugin(this, options);
}


/**
 * Returns a markdown-it plugin
 * @return { Plugin }
 */
MathjaxPlugin.prototype.plugin = function () {
  const self = this;
  return (md, options) => {
    if (options !== undefined) {
      InitPlugin(self, options);
    }
    /**
     * Inline RenderRule Implementation
     * @param {string} tex  equation
     */
    var mathjaxInline = function (tex) {
      self.options.displayMode = false;
      self.options.mathjax.inline = !self.options.displayMode;
      try {
        var math = self.tex2html.convert(tex, self.options.mathjax);
        return math;
      }
      catch (error) {
        if (self.options.throwOnError) { console.log(error); }
        return tex;
      }
    };

    /**
     * @type {RenderRule}
     */
    var inlineRenderer = function (tokens, idx) {
      return mathjaxInline(tokens[idx].content);
    };

    /**
     * Block RenderRule Implementation
     * @param {string} tex 
     */
    var mathjaxBlock = function (tex) {
      self.options.displayMode = true;
      self.options.mathjax.inline = !self.options.displayMode;
      try {
        var math = self.tex2html.convert(tex, self.options.mathjax);
        return "<p>" + math + "</p>";
      }
      catch (error) {
        if (self.options.throwOnError) { console.log(error); }
        return tex;
      }
    }

    /**
     * @type {RenderRule}
     */
    var blockRenderer = function (tokens, idx) {
      return mathjaxBlock(tokens[idx].content) + '\n';
    }

    md.inline.ruler.after('escape', 'math_inline', math_inline);
    md.block.ruler.after('blockquote', 'math_block', math_block, {
      alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.renderer.rules.math_inline = inlineRenderer;
    md.renderer.rules.math_block = blockRenderer;
  }
};

MathjaxPlugin.prototype.getCSS = function () {
  return this.tex2html.getCSS();
}

module.exports = MathjaxPlugin;