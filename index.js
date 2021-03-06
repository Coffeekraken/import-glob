var glob = require("glob");
var path = require("path");

module.exports = function(source) {
  this.cacheable();
  var regex = /.?(import|require)\s?\(?((\w+) +from )?([\'\"])(.*?)\4/gm;
  var regexRequire = /.+?require\([\'\"](.+)[\'\"]\)/gm
  var importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  var importFiles = /import +([\'\"])(.*?)\1/gm;
  var requireFiles = /require\([\'\"](.*?)\1/gm;
  var importSass = /@import +([\'\"])(.*?)\1/gm;
  var resourceDir = path.dirname(this.resourcePath);
  function replacer(match, statement, fromStatement, obj, quote, filename) {
    var modules = [];
    var withModules = false;
    if (!glob.hasMagic(filename)) return match;
    var files = glob.sync(filename, {
      cwd: resourceDir
    });
    var result = files.map(function(file, index) {
      var fileName = quote + file + quote;
      if (match.match(importSass)) {
        return '@import ' + fileName;
      } else if (match.match(importModules)) {
        var moduleName = obj + index;
        modules.push(moduleName);
        withModules = true;
        return 'import * as ' + moduleName + ' from ' + fileName;
      } else if (match.match(importFiles)) {
        return 'import ' + fileName;
      } else if (match.match(requireFiles)) {
        var endParenthese = (index < files.length-1) ? ')' : '';
        return 'require(' + fileName + endParenthese;
      }
    })
    .join('; ');
    if (result && withModules) {
      result += '; let ' + obj + ' = [' + modules.join(', ') + ']';
    }
    return result;
  }
  var res = source.replace(regex, replacer);
  return res;
};
