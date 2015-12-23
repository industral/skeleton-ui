var $fs = require('fs');
var $exec = require('child_process').exec;
var $mime = require('mime');
var CONFIG = require('optimist').argv;
var includes = require('./build.json');

var PATH = '../out/';

var BUFFER = 5120000; //5000 * 1024

var components = {};

var processedComponentSpace = {};

var profiles = Object.keys(includes);

function init() {
  if (profiles.length) {
    processProfile(profiles[profiles.length - 1]);
  }
}

function processProfile(profileId) {
  components = {
    css: [],
    html: [],
    js: [],
    data: []
  };

  processedComponentSpace = {
    css: ''
  };

  var includeFiles = includes[profileId];

  includeFiles.forEach(function(value, key) {
    if (value.match(/file#/)) {
      var file = value.replace(/file#/, '');
      var fileType = file.match(/.(js|css|html)/);

      components[fileType[1]].push(file);
    } else if (value.match(/component#/)) {
      var component = value.replace(/component#/, '');

      findAllFiles('../app/components/' + component);
    }
  });

  processJS(function() {
    processOtherComponents('css');

    processOtherComponents('data');
    processOtherComponents('html');

    if (!CONFIG['no-base64']) {
      transformToBase64('css');
    }

    writeFiles(profileId);
  });
}


function findAllFiles(path) {

  (function process(dir) {
    var dirList = $fs.readdirSync(dir);

    dirList.forEach(function(value) {
      if (!value.match(/^\.|tests/)) {
        var fileName = dir + '/' + value;

        var stat = $fs.statSync(fileName);
        if (stat.isDirectory()) {
          process(fileName);
        } else if (stat.isFile()) {
          var match = fileName.match(/js|json|xml|html|svg|css/);

          if (match) {
            var ext = match[0];

            var fileKey = fileName.replace('../', '');

            var container = null;

            switch (ext) {
              case 'js':
                container = components.js;

                break;
              case 'json':
                container = components.data;

                break;
              case 'css':
                container = components.css;

                break;
              case 'xml':
              case 'html':
              case 'svg':
                container = components.html;

                break;
              default:
                container = components.data;
            }

            if (container.indexOf(fileKey) === -1) {
              container.push(fileKey);
            }

          }
        }
      }
    });
  })(path);

}

function processJS(callback) {
  // FAST
  if (!CONFIG['js-source-map'] && (!CONFIG['js-optimization'] ||
                                   CONFIG['js-optimization'] ===
                                   'whitespace')) {
    var output = '';

    components.js.forEach(function(value, key) {
      output += $fs.readFileSync('../' + value).toString();
    });

    processedComponentSpace.js = output;

    callback();
  } else {
    // SLOW
    var compileLineString = '';
    var options = '';

    components.js.forEach(function(value, key) {
      compileLineString += ' --js=' + value;
    });

    if (CONFIG['js-source-map']) {
      options += ' --create_source_map=source.map --source_map_format=V3 ';
    }

    if (CONFIG['js-optimization']) {
      switch (CONFIG['js-optimization']) {
        case 'simple':
          options += ' --compilation_level=SIMPLE_OPTIMIZATIONS ';

          break;
        case 'advanced':
          options += ' --compilation_level=ADVANCED_OPTIMIZATIONS ';

          break;
      }
    } else {
      options += ' --compilation_level=WHITESPACE_ONLY ';
    }

    $exec('cd ../ && java -jar build/closure.jar --jscomp_off=internetExplorerChecks --warning_level=QUIET ' +
          options + compileLineString, {maxBuffer: BUFFER},
      function(error, stdout, stderr) {
        if (error || stderr) {
          console.error(error, stderr);
        } else {
          processedComponentSpace.js = stdout;

          callback();
        }
      });
  }
}

function processOtherComponents(componentName) {
  if (componentName === 'data') {
    processedComponentSpace[componentName] = {};

    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync('../' + value).toString();

      if (CONFIG['data-optimization']) {
        content = content.replace(/\s+/g, ' ').replace(/\n/g, ' ');
      }

      processedComponentSpace[componentName][value.replace('app/', '')] =
        content;
    });
  } else if (componentName === 'html') {
    processedComponentSpace[componentName] = {};

    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync('../' + value).toString();

      content =
        content.replace(/\s+/g, ' ').replace(/\n/g, ' ').replace(/> </g, '><');

      processedComponentSpace[componentName][value.replace('app/',
        '').replace(/\/(NLI|LI)\//, '/')] = content;
    });

    if (!CONFIG['no-base64']) {
      transformToBase64(componentName);
    }

    //TODO: XML JSON OPTIMIZATION
  } else if (componentName === 'css') {
    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync('../' + value).toString();

      processedComponentSpace[componentName] += content;
    });

    if (!CONFIG['no-base64']) {
      transformToBase64(componentName);
    }
  }
}

function transformToBase64(componentName) {
  var regex = null;
  var data = null;

  switch (componentName) {
    case 'css':
      data = processedComponentSpace.css;
      regex = '(url)\\("?\([^)]+)"?\\)';

      break;
    case 'html':
      data = JSON.stringify(processedComponentSpace.html);
      regex = '(src|xlink\:href)=."([^\\\\"]+)';

      break;
  }

  var match = data.match(new RegExp(regex, 'g'));

  if (match) {
    var foundCount = match.length;

    for (var i = 0; i < foundCount; ++i) {
      var _match = match[i].match(new RegExp(regex));
      var fileName = _match[2].replace('/app/', '../app/');
      fileName = fileName.replace(/#.+/, '');

      if (!fileName.match(/^#|^data:|\.webm$/)) {
        try {
          var buffer = $fs.readFileSync(fileName);
          var dataURI;
          var mime = $mime.lookup(fileName);
          var dataURIBase64Data = buffer.toString('base64');

          if (componentName === 'css') {
            if (mime === 'image/svg+xml') {
              var hash = _match[2].match(/#.+/);
              var filteredData = buffer.toString().replace(/\n/g,
                '').replace(/\s+/g, ' ');
              dataURI =
                'url(\"data:' + mime + ',' + encodeURIComponent(filteredData) +
                (hash && hash.length ? hash[0] : '') + '\")';
            } else {
              dataURI =
                'url(data:' + mime + ';base64,' + dataURIBase64Data + ')';
            }
          } else if (componentName === 'html') {
            dataURI =
              _match[1] + '=\\\"data:' + mime + ';base64,' + dataURIBase64Data;
          }

          data = data.replace(match[i], dataURI);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  processedComponentSpace[componentName] = data;
}

function writeFiles(profileId) {
  //if (!CONFIG['separate-files']) {
  //  processedComponentSpace.js =
  //  'var __dom__ = ' + processedComponentSpace.xml + '; var __json__ = ' +
  //  JSON.stringify(processedComponentSpace.data) + '; ' +
  //  processedComponentSpace.js;
  //}

  if (CONFIG['js-source-map']) {
    processedComponentSpace.js += '//@ sourceMappingURL=/source.map';
  }

  if (CONFIG['no-base64']) {
    var out = 'var __dom__ = {\n\n';

    for (var i in processedComponentSpace.html) {
      out += '"' + i + '"' + ': ' + "\n'" +
             processedComponentSpace.html[i].replace(/\n/g,
               '\\\n').replace(/</g, '<') + "',\n\n";
    }

    out += '}';

    $fs.writeFileSync(PATH + 'javascripts/' + profileId + '-templates.js',
      out);
  } else {
    $fs.writeFileSync(PATH + 'javascripts/' + profileId + '-templates.js',
      'var __dom__ = ' + processedComponentSpace.html + ';\n\n');
  }

  $fs.writeFileSync(PATH + 'javascripts/' + profileId + '-scripts.js',
    processedComponentSpace.js);
  $fs.writeFileSync(PATH + 'stylesheets/' + profileId + '-styles.css',
    processedComponentSpace.css);

  profiles.pop();
  init();
}

init();
