# brfs-htmlmin

`brfs-htmlmin` is kind of a fork of [brfs](https://github.com/substack/brfs).
It's a transform for browserify that allows you to use `fs.readFileSync()`
in your code and will statically inline the content in your bundle.

The difference is that with `brfs-htmlmin`, it will minify the html output.

## install

- Install `brfs-htmlmin` in your project: `npm install brfs-htmlmin`
- Use it as a transform, in the command line or with the API:
```
$ browserify -t brfs-htmlmin example/main.js > bundle.js
```
``` js
var browserify = require('browserify');
var fs = require('fs');

var b = browserify('example/main.js');
b.transform('brfs-htmlmin');

b.bundle().pipe(fs.createWriteStream('bundle.js'));
```

## example

for a main.js:

``` js
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/doc.html', 'utf8');
console.log(html);
```

and a doc.html:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>A RMScreenprint</title>
</head>
<body>
  <h1>Main heading in my document</h1>
  <!-- Note that it is "h" + "1", not "h" + the letters "one" -->
  <p>Look Ma, I am coding <abbr title="Hyper Text Markup Language">HTML</abbr>.</p>
</body>
</html>
```

## options

#### minify
Type: `Object`

Hash of options sent to the [html-minifier](https://github.com/kangax/html-minifier). See [github html-minifier by Kangax](https://github.com/kangax/html-minifier#options-quick-reference).

By defaults, these options are already `true`:
```
removeComments: true,
collapseWhitespace: true,
collapseBooleanAttributes: true,
removeAttributeQuotes: true,
removeRedundantAttributes: true,
removeEmptyAttributes: true
```