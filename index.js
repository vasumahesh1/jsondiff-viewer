(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jsondiffpatch'], factory);
  } else if (typeof module === 'object' && module.exports) {
    var jsondiffpatch = require('jsondiffpatch');
    module.exports = factory(jsondiffpatch);
  } else {
    root.JSONDiffViewer = factory(root.jsondiffpatch);
  }
}(this, function (jsondiffpatch) {

  if (!jsondiffpatch) {
    throw new Error('JSONDiffViewer: Need `jsondiffpatch` to operate');
  }

  var lib = jsondiffpatch.create({
    objectHash: function(obj, index) {
      // try to find an id property, otherwise just use the index in the array
      return obj.name || obj.id || obj._id || '$$index:' + index;
    }
  });

  return JSONDiffViewer;

  function JSONDiffViewer(left, right, options) {
    options = options || {};

    var css = options.css !== undefined ? options.css : true;
    var light = options.light ? options.light : false;
    var tab = options.tab ? options.tab : 10;

    var mainDelta = lib.diff(left, right);

    var html = '';

    html += _getDiv('jdv-code-container ' + (light ? 'light' : ''));
    _parse(mainDelta, 1);

    return html;

    function _parse(delta, nestLevel) {
      for (var key in delta) {
        var keyDiff = delta[key];

        if (keyDiff.constructor === Array) {
          html += _parseDeltaHTML(key, keyDiff, nestLevel);
        } else {
          if (!keyDiff._t) {
            var marginNest = nestLevel * tab;

            // Start Object
            var row = _getDiv('jdv-code-row');
            row += _parseKey(key);
            row += _addDivider();
            html += row;
            var value = _getDiv('jdv-code-object');
            value += '{';
            value += _getDivEnd();
            html += value;
            html += _getDivEnd();

            var nestRow = _getDiv('jdv-code-nest', 'margin-left:' + marginNest + 'px;');
            html += nestRow;
            nestLevel++;
            _parse(keyDiff, nestLevel);
            html += _getDivEnd();

            // Close Object
            var row = _getDiv('jdv-code-row');
            var endBrace = _getDiv('jdv-code-object');
            endBrace += '}';
            endBrace += _getDivEnd();
            row += endBrace;
            html += row;
            html += _getDivEnd();
          } else {
            // Start Array
            var row = _getDiv('jdv-code-row');
            row += _parseKey(key);
            row += _addDivider();
            html += row;
            var value = _getDiv('jdv-code-object');
            value += '[';
            value += _getDivEnd();
            html += value;
            html += _getDivEnd();

            nestLevel++;
            var marginNest = nestLevel * tab;

            var nestRow = _getDiv('jdv-code-nest', 'margin-left:' + marginNest + 'px;');
            html += nestRow;

            for(var idx in keyDiff) {
              if (idx === '_t') {
                continue;
              }

              var arrayDelta = keyDiff[idx];

              var parsed = {};
              parsed[idx] = arrayDelta;
              _parse(parsed, nestLevel);
            }

            html += _getDivEnd();

            // Close Object
            var row = _getDiv('jdv-code-row');
            var endBrace = _getDiv('jdv-code-object');
            endBrace += ']';
            endBrace += _getDivEnd();
            row += endBrace;
            html += row;
            html += _getDivEnd();
          }
        }
      }
    }

    function _parseDeltaHTML(key, keyDiff, nestLevel) {
      var row;
      var valueClass = ['jdv-code-value'];
      var valueHtml = '';

      var closeObject = false;

      // New Element
      if (keyDiff.length === 1) {
        row = _getDiv('jdv-code-row new');

        if (typeof keyDiff[0] !== 'object' || keyDiff[0] === null) {
          row += _parseKey(key, 'new');
          row += _addDivider('new');

          valueClass.push('new');
          valueHtml += _getDiv('jdv-code-new-1') + keyDiff[0] + _getDivEnd();
        } else {
          // Start Object
          var value = _getDiv('jdv-code-row'); // row start
          value += _parseKey(key, 'new');
          value += _addDivider('new');

          value += _getDiv('jdv-code-object new');
          value += '{';
          value += _getDivEnd();
          valueHtml += value;

          valueHtml += _getDivEnd(); // Close the Value Row so we can start Nesting

          var marginNest = nestLevel * tab;
          var nestRow = _getDiv('jdv-code-nest', 'margin-left:' + marginNest + 'px;');
          valueHtml += nestRow; // nest start

          var opts = {};
          opts.type = 'new';
          valueHtml += _printObject(keyDiff[0], nestLevel, opts);

          valueHtml += _getDivEnd(); // nest end
          valueHtml += _getDivEnd(); // row end

          var endBrace = _getDiv('jdv-code-row');
          endBrace += _getDiv('jdv-code-object new');
          endBrace += '}';
          endBrace += _getDivEnd();
          valueHtml += endBrace;
        }
      }
      // Modified Value
      else if (keyDiff.length === 2) {
        row = _getDiv('jdv-code-row modified');
        row += _parseKey(key);
        row += _addDivider();

        valueClass.push('modified');

        var firstHtml = _getDiv('jdv-code-modified-1') + keyDiff[0] + _getDivEnd();
        var secondHtml = _getDiv('jdv-code-modified-2') + keyDiff[1] + _getDivEnd();
        var divider = _getDiv('jdv-code-modified-divider') + '=>' + _getDivEnd();

        valueHtml += firstHtml + divider + secondHtml;
      } else if (keyDiff.length === 3) {
        row = _getDiv('jdv-code-row deleted');
        // Deleted Element
        if (keyDiff[1] === 0 && keyDiff[2] === 0) {
          if (typeof keyDiff[0] !== 'object' || keyDiff[0] === null) {
            row += _parseKey(key, 'deleted');
            row += _addDivider('deleted');

            var firstHtml = _getDiv('jdv-code-deleted-1') + keyDiff[0] + _getDivEnd();
            var divider = _getDiv('jdv-code-deleted-divider') + '=>' + _getDivEnd();
            valueHtml += firstHtml + divider;
          } else {
            var obj = keyDiff[0];
            // Start Object
            var value = _getDiv('jdv-code-row'); // row start
            value += _parseKey(key, 'deleted');
            value += _addDivider('deleted');

            value += _getDiv('jdv-code-object deleted');
            value += '{';
            value += _getDivEnd();
            valueHtml += value;

            valueHtml += _getDivEnd(); // Close the Value Row so we can start Nesting

            var marginNest = nestLevel * tab;
            var nestRow = _getDiv('jdv-code-nest', 'margin-left:' + marginNest + 'px;');
            valueHtml += nestRow; // nest start

            var opts = {};
            opts.type = 'deleted';
            valueHtml += _printObject(obj, nestLevel, opts);

            valueHtml += _getDivEnd(); // nest end
            valueHtml += _getDivEnd(); // row end

            var endBrace = _getDiv('jdv-code-row');
            endBrace += _getDiv('jdv-code-object deleted');
            endBrace += '}';
            endBrace += _getDivEnd();
            valueHtml += endBrace;
          }
        }
      }

      var value = _getDiv(valueClass);
      value += valueHtml;
      value += _getDivEnd();

      row += value;

      row += _getDivEnd();
      return row;
    }

    function _printObject(obj, nestLevel, opts) {
      var type = opts.type || 'none';

      var dom = '';
      for (var key in obj) {
        var value = obj[key];

        if (typeof value === 'object' && value !== null) {
          // Start Object
          var row = _getDiv('jdv-code-row');
          row += _parseKey(key, type);
          row += _addDivider(type);
          dom += row;
          var openBrace = _getDiv('jdv-code-object ' + type);
          openBrace += '{';
          openBrace += _getDivEnd();
          dom += openBrace;
          dom += _getDivEnd();

          nestLevel++;

          var marginNest = nestLevel * tab;
          var nestRow = _getDiv('jdv-code-nest', 'margin-left:' + marginNest + 'px;');
          dom += nestRow;
          dom += _printObject(value, nestLevel, opts);
          dom += _getDivEnd();

          // Close Object
          var row = _getDiv('jdv-code-row');
          var closeBrace = _getDiv('jdv-code-object ' + type);
          closeBrace += '}';
          closeBrace += _getDivEnd();
          row += closeBrace;
          dom += row;
          dom += _getDivEnd();
        } else if (value.constructor === Array) {

        } else {

          var row = _getDiv('jdv-code-row');
          row += _parseKey(key, type);
          row += _addDivider(type);
          var valueHtml = _getDiv('jdv-code-value ' + type);
          valueHtml += value;
          valueHtml += _getDivEnd();
          row += valueHtml;
          row += _getDivEnd();

          dom += row;
        }
      }

      return dom;
    }

    function _addDivider(cssClass) {
      cssClass = cssClass || '';
      return _getDiv('jdv-code-divider ' + cssClass) + ':' + _getDivEnd();
    }

    function _parseKey(key, cssClass) {
      cssClass = cssClass || '';
      return _getDiv('jdv-code-key ' + cssClass) + key + _getDivEnd();
    }

    function _getDiv(cssClass, cssStyles) {
      if (cssClass.constructor === Array) {
        cssClass = cssClass.join(' ');
      }

      var val = '<div class="' + cssClass + '"';

      if (cssStyles) {
        val += ' style="' + cssStyles + '"';
      }

      val += '>';

      return val;
    }

    function _getDivEnd() {
      return '</div>';
    }
  }

}));
