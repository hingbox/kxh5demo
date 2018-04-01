(function(Zepto){
  var elab = window.elab = window.elab ||{};
  elab.ajax = elab.ajax || {};
  elab.util = elab.util || {};
  var $ = Zepto;

  if(!$){
    throw new Error("$ is undefined");
  }

  function empty() {}

  $.extend($.ajaxSettings,{
    dataType: 'json',
    timeout: 3000,
    traditional:true,
    contentType: 'application/json'
  });

})(window.$||Zepto);

;
(function(_, elab){
  var exports = {};
  /**
   * Object#toString() ref for stringify().
   */

  var toString = Object.prototype.toString;

  /**
   * Object#hasOwnProperty ref
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Array#indexOf shim.
   */

  var indexOf = typeof Array.prototype.indexOf === 'function'
    ? function(arr, el) { return arr.indexOf(el); }
    : function(arr, el) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === el) return i;
        }
        return -1;
      };

  /**
   * Array.isArray shim.
   */

  var isArray = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
  };

  /**
   * Object.keys shim.
   */

  var objectKeys = Object.keys || function(obj) {
    var ret = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        ret.push(key);
      }
    }
    return ret;
  };

  /**
   * Array#forEach shim.
   */

  var forEach = typeof Array.prototype.forEach === 'function'
    ? function(arr, fn) { return arr.forEach(fn); }
    : function(arr, fn) {
        for (var i = 0; i < arr.length; i++) fn(arr[i]);
      };

  /**
   * Array#reduce shim.
   */

  var reduce = function(arr, fn, initial) {
    if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
    var res = initial;
    for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
    return res;
  };

  /**
   * Cache non-integer test regexp.
   */

  var isint = /^[0-9]+$/;

  function promote(parent, key) {
    if (parent[key].length == 0) return parent[key] = {}
    var t = {};
    for (var i in parent[key]) {
      if (hasOwnProperty.call(parent[key], i)) {
        t[i] = parent[key][i];
      }
    }
    parent[key] = t;
    return t;
  }

  function parse(parts, parent, key, val) {
    var part = parts.shift();

    // illegal
    if (hasOwnProperty.call(Object.prototype, key)) return;

    // end
    if (!part) {
      if (isArray(parent[key])) {
        parent[key].push(val);
      } else if ('object' == typeof parent[key]) {
        parent[key] = val;
      } else if ('undefined' == typeof parent[key]) {
        parent[key] = val;
      } else {
        parent[key] = [parent[key], val];
      }
      // array
    } else {
      var obj = parent[key] = parent[key] || [];
      if (']' == part) {
        if (isArray(obj)) {
          if ('' != val) obj.push(val);
        } else if ('object' == typeof obj) {
          obj[objectKeys(obj).length] = val;
        } else {
          obj = parent[key] = [parent[key], val];
        }
        // prop
      } else if (~indexOf(part, ']')) {
        part = part.substr(0, part.length - 1);
        if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
        parse(parts, obj, part, val);
        // key
      } else {
        if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
        parse(parts, obj, part, val);
      }
    }
  }

  /**
   * Merge parent key/val pair.
   */

  function merge(parent, key, val){
    if (~indexOf(key, ']')) {
      var parts = key.split('[')
        , len = parts.length
        , last = len - 1;
      parse(parts, parent, 'base', val);
      // optimize
    } else {
      if (!isint.test(key) && isArray(parent.base)) {
        var t = {};
        for (var k in parent.base) t[k] = parent.base[k];
        parent.base = t;
      }
      set(parent.base, key, val);
    }

    return parent;
  }

  /**
   * Compact sparse arrays.
   */

  function compact(obj) {
    if ('object' != typeof obj) return obj;

    if (isArray(obj)) {
      var ret = [];

      for (var i in obj) {
        if (hasOwnProperty.call(obj, i)) {
          ret.push(obj[i]);
        }
      }

      return ret;
    }

    for (var key in obj) {
      obj[key] = compact(obj[key]);
    }

    return obj;
  }

  /**
   * Parse the given obj.
   */

  function parseObject(obj){
    var ret = { base: {} };

    forEach(objectKeys(obj), function(name){
      merge(ret, name, obj[name]);
    });

    return compact(ret.base);
  }

  /**
   * Parse the given str.
   */

  function parseString(str, options){
    var ret = reduce(String(str).split(options.separator), function(ret, pair){
      var eql = indexOf(pair, '=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql)
        , val = pair.substr(brace || eql, pair.length)
        , val = val.substr(indexOf(val, '=') + 1, val.length);

      // ?foo
      if ('' == key) key = pair, val = '';
      if ('' == key) return ret;

      return merge(ret, decode(key), decode(val));
    }, { base: {} }).base;

    return compact(ret);
  }

  /**
   * Parse the given query `str` or `obj`, returning an object.
   *
   * @param {String} str | {Object} obj
   * @return {Object}
   * @api public
   */

  exports.parse = function(str, options){
    if (null == str || '' == str) return {};
    options = options || {};
    options.separator = options.separator || '&';
    return 'object' == typeof str
      ? parseObject(str)
      : parseString(str, options);
  };

  /**
   * Turn the given `obj` into a query string
   *
   * @param {Object} obj
   * @return {String}
   * @api public
   */

  var stringify = exports.stringify = function(obj, prefix) {
    if (isArray(obj)) {
      return stringifyArray(obj, prefix);
    } else if ('[object Object]' == toString.call(obj)) {
      return stringifyObject(obj, prefix);
    } else if ('string' == typeof obj) {
      return stringifyString(obj, prefix);
    } else {
      return prefix + '=' + encodeURIComponent(String(obj));
      //return prefix + '=' + String(obj);
    }
  };

  /**
   * Stringify the given `str`.
   *
   * @param {String} str
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyString(str, prefix) {
    if (!prefix) throw new TypeError('stringify expects an object');
    return prefix + '=' + encodeURIComponent(str);
    //return prefix + '=' + str;
  }

  /**
   * Stringify the given `arr`.
   *
   * @param {Array} arr
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyArray(arr, prefix) {
    var ret = [];
    if (!prefix) throw new TypeError('stringify expects an object');
    for (var i = 0; i < arr.length; i++) {
      ret.push(stringify(arr[i], prefix + '[' + i + ']'));
    }
    return ret.join('&');
  }

  /**
   * Stringify the given `obj`.
   *
   * @param {Object} obj
   * @param {String} prefix
   * @return {String}
   * @api private
   */

  function stringifyObject(obj, prefix) {
    var ret = []
      , keys = objectKeys(obj)
      , key;

    // naturalSort.insensitive = true;
    // keys = keys.sort(naturalSort);

    for (var i = 0, len = keys.length; i < len; ++i) {
      key = keys[i];
      if ('' == key) continue;
      if (null == obj[key]) {
        ret.push(encodeURIComponent(key) + '=');
        // ret.push(key + '=');
      } else {
        ret.push(stringify(obj[key], prefix
          ? prefix + '[' + encodeURIComponent(key) + ']'
          : encodeURIComponent(key)));

        // ret.push(stringify(obj[key], prefix ? prefix + '[' + key + ']': key));
      }
    }

    return ret.join('&');
  }

  /**
   * Set `obj`'s `key` to `val` respecting
   * the weird and wonderful syntax of a qs,
   * where "foo=bar&foo=baz" becomes an array.
   *
   * @param {Object} obj
   * @param {String} key
   * @param {String} val
   * @api private
   */

  function set(obj, key, val) {
    var v = obj[key];
    if (hasOwnProperty.call(Object.prototype, key)) return;
    if (undefined === v) {
      obj[key] = val;
    } else if (isArray(v)) {
      v.push(val);
    } else {
      obj[key] = [v, val];
    }
  }

  /**
   * Locate last brace in `str` within the key.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function lastBraceInKey(str) {
    var len = str.length
      , brace
      , c;
    for (var i = 0; i < len; ++i) {
      c = str[i];
      if (']' == c) brace = false;
      if ('[' == c) brace = true;
      if ('=' == c && !brace) return i;
    }
  }

  /**
   * Decode `str`.
   *
   * @param {String} str
   * @return {String}
   * @api private
   */

  function decode(str) {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (err) {
      return str;
    }
  }

  elab.qs = exports;

})(window._||_, window.elab||elab);

(function(_, elab){
  /**
   * Expose `pathToRegexp`.
   */
  var util = elab.util = elab.util || {};
  elab.pathToRegexp = pathToRegexp;
  elab.pathToRegexp.parse = parse;
  elab.pathToRegexp.compile = compile;
  elab.pathToRegexp.tokensToFunction = tokensToFunction;
  elab.pathToRegexp.tokensToRegExp = tokensToRegExp;

  util.getQueryString = function(name){
    return _.isEmpty(name)
      ? null
      : elab.qs.parse(window.location.search.substr(1))[name];
  };

  util.buildurl = function(path, options){
    if(_.isEmpty(path) || !_.isString(path)){
      return;
    }

    var router = elab.config.routers[path];

    if(_.isEmpty(router)){
      return;
    }

    var toPathRegexp = elab.pathToRegexp.compile(router['url']);
    return toPathRegexp(options||{});
  };

  util.isMobile = function(mob){
    return MOBILE_REGEXP.test(mob);
  };

  util.isAuth = function(){
    var v = $.fn.cookie('isauth');
    return v && v === '1';
  };

  util.redirect = function(url, params){
    if(!_.isEmpty(url)){
      url = url.indexOf('?') == -1 ? (url+'?_='+ new Date().getTime()) : (url+'&_='+ new Date().getTime());
      if(params){
        params = elab.qs.stringify(params);
        url = url + "&"+ params;
      }
    }else{
      return;
    }
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || /MSIE(\d+\.\d+);/.test(navigator.userAgent)){
      var referLink = document.createElement('a');
      referLink.href = url;
      document.body.appendChild(referLink);
      referLink.click();
    } else{
      location.href = url;
    }
  };

  util.currencyFormat = function(act){
    if(typeof act === "number"){
      return act.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }else{
      try{
        return parseFloat(act).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      }catch(e){}
    }
  }

  util.back = function(){
    elab.history.back();
  };

  /**
   *Mobile matching regexp utility.
   *@type {RegExp}
   */
  var MOBILE_REGEXP = new RegExp('^0?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$');

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g')

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string} str
   * @return {!Array}
   */
  function parse (str) {
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var res

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0]
      var escaped = res[1]
      var offset = res.index
      path += str.slice(index, offset)
      index = offset + m.length

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1]
        continue
      }

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path)
        path = ''
      }

      var prefix = res[2]
      var name = res[3]
      var capture = res[4]
      var group = res[5]
      var suffix = res[6]
      var asterisk = res[7]

      var repeat = suffix === '+' || suffix === '*'
      var optional = suffix === '?' || suffix === '*'
      var delimiter = prefix || '/'
      var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: escapeGroup(pattern)
      })
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index)
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path)
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @return {!function(Object=)}
   */
  function compile (str) {
    return tokensToFunction(parse(str))
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length)

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^' + tokens[i].pattern + '$')
      }
    }

    return function (obj) {
      var path = ''
      var data = obj || {}

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
          path += token

          continue
        }

        var value = data[token.name]
        var segment

        if (value == null) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (_.isArray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encodeURIComponent(value[j])

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment
          }

          continue
        }

        segment = encodeURIComponent(value)

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g)

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          pattern: null
        })
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = []

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source)
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    var tokens = parse(path)
    var re = tokensToRegExp(tokens, options)

    // Attach keys back to the regexp.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] !== 'string') {
        keys.push(tokens[i])
      }
    }

    return attachKeys(re, keys)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}  tokens
   * @param  {Object=} options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, options) {
    options = options || {}

    var strict = options.strict
    var end = options.end !== false
    var route = ''
    var lastToken = tokens[tokens.length - 1]
    var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        route += escapeString(token)
      } else {
        var prefix = escapeString(token.prefix)
        var capture = token.pattern

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*'
        }

        if (token.optional) {
          if (prefix) {
            capture = '(?:' + prefix + '(' + capture + '))?'
          } else {
            capture = '(' + capture + ')?'
          }
        } else {
          capture = prefix + '(' + capture + ')'
        }

        route += capture
      }
    }

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
    }

    if (end) {
      route += '$'
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithSlash ? '' : '(?=\\/|$)'
    }

    return new RegExp('^' + route, flags(options))
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    keys = keys || []

    if (!_.isArray(keys)) {
      options = /** @type {!Object} */ (keys)
      keys = []
    } else if (!options) {
      options = {}
    }

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (_.isArray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }

})(window._||_, window.elab||elab);

;(function(_, $, elab){
  function noop() {
  }

  var iAlert = window.iAlert = {
    dom: function(f) {
      // Buttontype
      if (f.oButton.bType == 1) {
        var eventsList = '';
        for (var i in f.oButton.oSingle.aEvents) {
          eventsList += f.oButton.oSingle.aEvents[i];
        };
        var sButtonHtm = '<div class="iAlert-box-actions-button noChoice" ' + eventsList + '>' + f.oButton.oSingle.sText + '</div>';
      } else if (f.oButton.bType == 2) {
        var negativeEventsList = '';
        for (var i in f.oButton.oMarried.oNegative.aEvents) {
          negativeEventsList += f.oButton.oMarried.oNegative.aEvents[i];
        };
        var positiveEventsList = '';
        for (var i in f.oButton.oMarried.oPositive.aEvents) {
          positiveEventsList += f.oButton.oMarried.oPositive.aEvents[i];
        };
        var sButtonHtm = '<div class="iAlert-box-actions-button negative" ' + negativeEventsList + '>' + f.oButton.oMarried.oNegative.sText + '</div><div class="iAlert-box-actions-button positive" ' + positiveEventsList + '>' + f.oButton.oMarried.oPositive.sText + '</div>';
      } else {
        console.log("\"button.type\" values are not specification");
        var sButtonHtm = '<div class="iAlert-box-actions-button noChoice" onclick="iAlert.fnDel()">错误（关闭）！</div>';
      };
      // Content
      var contentList = '';
      for (var i in f.aContent) {
        contentList += '<p>' + f.aContent[i] + '</p>';
      };

      // Body
      return[
      '<div id="iAlert">',
        '<div class="iAlert-box transition">',
          '<div class="iAlert-box-content"><h2>',f.sTitle ,'</h2>',contentList,'</div>',
          '<div class="iAlert-box-actions">',sButtonHtm,'</div>',
        '</div>',
      '</div>'
      ].join('');
    },
    fnDel: function(callback) {
      $("#iAlert").remove();
      if (_.isFunction(callback)) {
        callback();
      };
    },
    fnAdd: function(f) {
      $(document).ready(function() {
        if (!document.getElementById("iAlert")) {
          $("body").append(iAlert.dom(f)).find("#iAlert").show();
        } else {
          iAlert.fnDel(function(){
            iAlert.fnAdd(f);
          });
        };
      });
    },
    cb:{
      close: function(){},
      cancel:function(){},
      confirm:function(){}
    }
  };

  var dialog = elab.dialog = {};

  dialog.alert = function(title, content, callback, closeTxt){
    var cArr = [];
    if(_.isArray(content)){
      cArr = content;
    }else{
      cArr.push(content);
    };

    iAlert.cb.close = _.isFunction(callback)? callback: function(){};

    iAlert.fnAdd({
      sTitle: title ||'提示',
      aContent: cArr,
      oButton: {
        bType: 1,
        oSingle: {sText: closeTxt || '关闭', aEvents: ['onclick="iAlert.fnDel();iAlert.cb.close()"'] }
      }
    });
  }

  dialog.close = function(){
    iAlert.fnDel();
  };

  dialog.confirm = function(title ,content, yesCB, noCB, yesTxt, noTxt){
    var cArr = [], oCall = {};
    if(_.isArray(content)){
      cArr = content;
    }else{
      cArr.push(content);
    };

    iAlert.cb.cancel = _.isFunction(noCB)? noCB: function(){};

    iAlert.cb.confirm = _.isFunction(yesCB)? yesCB : function(){
      iAlert.fnDel();
    };

    iAlert.fnAdd({
      sTitle: title ||'Title',
      aContent: cArr,
      oButton: {
        bType: 2,
        oMarried: {
          oNegative: {sText: noTxt || '取消', aEvents: ['onclick="iAlert.fnDel();iAlert.cb.cancel()"'] },
          oPositive: {sText: yesTxt|| '确定', aEvents: ['onclick="iAlert.cb.confirm()"'] }
        }
      }
    });
  };

  dialog.$modal = false;

  var modal = elab.modal = {
    $container: false,
    $mask:false,
    $modal:false,
    $content:false,
    isframe:false,
    cb: {
      cancel:noop,
      confirm: noop
    },
    messenger:{
      child: false,
      parent: false
    }
  };

  var isframe = elab.util.getQueryString('isframe');
  isframe = '1' === isframe;
  if(isframe){
    modal.messenger.child =  new Messenger('child');
    modal.messenger.child.addTarget(window.parent, 'parent');
    $(window).on("unload", function(){
      modal.messenger.child.targets['parent'].send('close');
    });

    modal.close = function(){
      modal.messenger.child.targets['parent'].send('close');
    }
  }

  modal.close = function(){
    modal.hide();
    if(modal.messenger.child){
      modal.messenger.child.targets['parent'].send('close');
    }
  }

  modal.hide = function(){
    if(elab.modal.$content){
      elab.modal.$content.html('');
    }

    if(elab.modal.$mask){
      elab.modal.$mask.addClass('elab-modal-mask-hidden');
    }

    if(elab.modal.$modal){
      elab.modal.$modal.addClass('elab-modal-hidden');
    }
  }

  modal.show = function(option){
    var options = typeof option === "object" ? option : {};
    options = Object.assign({
      title: '',
      yesCB: noop,
      noCB: noop,
      content: '',
      iframe: false,
      url: '',
      yesTxt:'确定',
      noTxt: '取消',
      noHead: false,
      noFoot: false
    }, options);

    modal.cb.cancel  = _.isFunction(options.noCB)? options.noCB: noop;

    modal.cb.confirm = _.isFunction(options.yesCB)? options.yesCB : noop;

    var $body= $('body');
    var bodyHeight = $body.height();

    if(!modal.$container){
      modal.$container = $([
        '<div class="elab-modal-container">',
          '<div class="elab-modal-wrap">',
            '<div class="elab-modal-mask elab-modal-mask-hidden"></div>',
            '<div class="elab-modal elab-modal-hidden" tabindex="0" role="dialog" style="left:0; top:0;">',
              '<div class="elab-modal-content"></div>',
              '<div tabindex="0" style="width:0;height:0;overflow:hidden;">hi</div>',
            '</div>',
          '</div>',
        '</div>'
      ].join(''));
      $body.append(modal.$container);

      modal.$mask =  modal.$container.find('div.elab-modal-mask');
      modal.$modal = modal.$container.find('div.elab-modal');
      modal.$content = modal.$modal.find('div.elab-modal-content');
    }

    modal.$content.html('');

    if(!options.noHead){
      modal.$content.append([
        '<div class="elab-modal-header">',
          '<a tabindex="0" class="elab-modal-close">',
            '<span class="elab-modal-close-x"></span>',
          '</a>',
          '<div class="elab-modal-title">',options.title,'</div>',
        '</div>'
      ].join(''));
    }

    elab.modal.isframe = options.iframe;

    if(options.iframe){
      modal.$container.addClass('elab-modal-container-iframe');
      var url = options.url;
      var t = new Date().getTime();
      url = url.indexOf('?') == -1 ? (url+'?isframe=1&t='+t) : (url+'&isframe=1&t='+t);
      modal.$content.append([
        '<div class="elab-modal-body" style="height:',bodyHeight ,'px;">',
          '<iframe id="elab-modal-iframe" name="elab-modal-iframe"  style="width:100%;height:100%;" scrolling="no" frameborder="no" src="',url,'"></iframe>',
        '</div>'
      ].join(''));

      modal.messenger.parent = new Messenger('parent');
      modal.messenger.parent.listen(function (msg) {
        if(msg === 'close' && elab.modal.isframe){
          elab.modal.hide();
        }
      });

      var iframe = document.getElementById('elab-modal-iframe');
      modal.messenger.parent.addTarget(iframe.contentWindow, 'child');
    }else{
      modal.$content.append(['<div class="elab-modal-body">',options.content,'</div>'].join(''));
      modal.$container.removeClass('elab-modal-container-iframe');
    }

    if(!options.noFoot){
      modal.$content.append([
        '<div class="elab-modal-footer">',
          '<button type="button" class="elab-btn elab-btn-ghost elab-btn-lg">',
            '<span>',options.noTxt,'</span>',
          '</button>',
          '<button type="button" class="elab-btn elab-btn-primary elab-btn-lg">',
            '<span>',options.yesTxt,'</span>',
          '</button>',
        '</div>'
      ].join(''));

      var buttons = modal.$content.children('div.elab-modal-footer').find('button');

      buttons.eq(0).one('click',function(){
        elab.modal.hide();
        elab.modal.cb.cancel();
      })

      buttons.eq(1).one('click',function(){
        elab.modal.hide();
        elab.modal.cb.confirm();
      })
    }

    elab.modal.$mask.removeClass('elab-modal-mask-hidden');
    elab.modal.$modal.removeClass('elab-modal-hidden');
  }

  var $mask = false;
  var mask = elab.mask = {};
  mask.show = function(){
    if($mask){
      $mask.css({'display' : 'block'});
    }else{
      $mask = $([
        '<div class="elab-mask">',
          '<img src="/img/loading/c.gif"></img>',
        '</div>'
      ].join(''));
      $('body').append($mask);
    }
  };

  mask.hide = function(){
    if($mask)$mask.hide();
  };

  var message = elab.message = {};

  message.hide = function(){
    if(elab.message.$e){
      elab.message.$box.removeAttr('style');
      elab.message.$e.addClass("elab-message-hide").hide();
    }
  };

  message.success = function(msg, period){
    message.show(msg, period||1000, "succee-icon");
  };

  message.error = function(msg, period){
    message.show(msg, period||1000, "error-icon");
  };

  message.show = function(msg, period,icon){
    period = period || 1000;
    icon = icon || 'succee-icon';

    if(elab.message.$e) {
      elab.message.$e.css('display','block');
    }else{
      elab.message.$e = $([
        '<div class="elab-message elab-message-hide">',
          '<div class="message-box">',
            '<div class="message-box-icon">',
              '<i class="bottom-focus-icon ', icon ,'"></i>',
            '</div>',
            '<div class="message-box-content"></div>',
          '</div>',
        '</div>'
      ].join(''));
      $('body').append(elab.message.$e);
      elab.message.$box = elab.message.$e.children("div.message-box").first();
      elab.message.$msg = elab.message.$box.children("div.message-box-content").first();
    }
    elab.message.$msg.html(msg);
    var offset = elab.message.$box.offset();
    elab.message.$box.css({
      'margin-left': -Math.round(offset.width/2),
      'margin-top':  -Math.round(offset.height/2),
    });
    elab.message.$e.removeClass("elab-message-hide");
    window.setTimeout(function () {elab.message.hide();}, period);
  };

  elab.history = {
    add : function (url) {
      var historyArray = elab.history.getLocal();
      if (!historyArray) {
        historyArray = [];
      }

      if(url){
        url=url.replace(/_=(\d)*&/gi,"").replace(/_=(\d)*/gi,"");
      }

      var currentPage = historyArray.pop();
      if (currentPage && currentPage == url) {
          //do nothing
      } else if (currentPage){
        historyArray.push(currentPage); //历史里面没有现在传入的url，在加回去
      }
      historyArray.push(url);
      elab.history.saveLocal(historyArray);
    },
    back : function() {
      var historyArray = elab.history.getLocal();
      var currentPage = false;
      var history = false;

      if(elab.history.skipCurrentPage){
        history = historyArray.pop();
      }else{
        //去掉当前页面，pop取最后，类似stack
        currentPage = historyArray.pop();
        history = historyArray.pop();
      }

      if (!history) {//没有历史页面
        if(!currentPage) elab.history.add(currentPage);//将当前页面加入回数组中
        return;
      }
      elab.history.saveLocal(historyArray);
      window.location.href = history;
      //elab.util.redirect(history);
    },
    length:function(){
      var historyArray = elab.history.getLocal() || [];
      return historyArray.length;
    },
    getLocal : function() {
      //var result = window.sessionStorage.getItem(elab.history.key);
      var result = store.get(elab.history.key);
      if (!result) {
        return null;
      }
      return JSON.parse(result);
    },
    saveLocal : function(data) {
      store.set(elab.history.key, JSON.stringify(data));
      //window.sessionStorage.setItem(elab.history.key, JSON.stringify(data));
    },
    init : function() {
      elab.history.saveLocal([]);
    },
    key : "_history_",
    skipCurrentPage: false
  };
})(window._||_, window.$||Zepto, window.elab||elab);
