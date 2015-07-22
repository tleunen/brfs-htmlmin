'use strict';
var staticModule = require('static-module');
var quote = require('quote-stream');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var minify = require('html-minifier').minify;
var defaults = require('lodash.defaults');

var regexps = [
    'ignoreCustomComments',
    'customAttrAssign',
    'customAttrSurround',
    'customAttrCollapse'
];

module.exports = function(file, opts) {
    if(/\.json$/.test(file)) return through();

    opts = opts || {};

    var optsMinify = defaults(opts.minify || {}, {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true
    });

    Object.keys(optsMinify).forEach(function(key) {
        if(~regexps.indexOf(key)) {
            var value = optsMinify[key];
            optsMinify[key] = Array.isArray(value) ?
                value.map(asRegExp) :
                asRegExp(value);
        }
    });

    var vars = {
        __filename: file,
        __dirname: path.dirname(file)
    };

    if(opts.vars) {
        Object.keys(opts.vars).forEach(function(key) {
            vars[key] = opts.vars[key];
        });
    }

    var sm = staticModule(
        {
            fs: {
                readFileSync: readFileSync,
                readFile: readFileSync
            }
        },
        { vars: vars }
    );
    return sm;

    function readFileSync(fileRead, encoding) {
        encoding = encoding || 'utf8';

        var bufArr = [];

        return fs.createReadStream(fileRead, { encoding: encoding })
            .pipe(through(write, end))
            .pipe(quote());

        function write(buf, enc, next) {
            bufArr.push(buf);
            next();
        }
        function end(next) {
            if(/\.html$/.test(fileRead)) {
                this.push(minify(bufArr.toString('utf8'), optsMinify));
            }
            else {
                this.push(bufArr.toString('utf8'));
            }
            this.push(null);
            sm.emit('file', fileRead);
            next();
        }
    }

    function asRegExp(val) {
        return (val instanceof RegExp) ? val : new RegExp(val);
    }
};
