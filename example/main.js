var fs = require('fs');
var html = fs.readFileSync(__dirname + '/doc.html', 'utf8');
console.log(html);