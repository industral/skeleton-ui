function Utils() {
}

(function() {
  /**
   * @typedef {{
 *            method: string,
 *            url: string,
 *            data: object,
 *            form: {Element}
 *            success: function,
 *            error: function
 *          }} AjaxOptions
   *
   *  method: HTTP request method
   *  url: URL,
   *  data: parameters,
   *  form: form Element,
   *  success: callback function for success response,
   *  error: callback function for error response
   */



  /**
   * Ajax util class.
   * @param {AjaxOptions} options
   * @return {Promise}
   * @constructor
   * @export
   */
  Utils.Ajax = function(options) {
    return new Promise(function(resolve, reject) {
      options = options || {};
      options.dataType = options.dataType || 'json';
      options.success = options.success || function() {
      };
      options.error = options.error || function() {
      };

      var request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          var data = null;

          if (options.dataType === 'json') {
            try {
              data = JSON.parse(request.responseText);
            } catch (e) {
              new UI.component.Notification().show({
                title: 'Error',
                message: e.message
              });
            }
          } else {
            data = request.responseText;
          }

          if (request.status === 200) {
            if (data !== null) {
              options.success(data);
              resolve(data);
            } else {
              options.error(request.responseText);
              reject(request.responseText);
            }
          } else {
            new UI.component.Notification().show({
              title: 'Error',
              message: (data && data.message) || request.responseText
            });

            if (options.error) {
              options.error(request.responseText);
              reject(request.responseText);
            }
          }
        }
      };

      options.method = (options.method ||
          (options.form && options.form.method) || 'GET').toUpperCase();

      options.url = options.url || (options.form && options.form.action);
      var formData;
      if (options.jsonType) {
        formData = JSON.stringify(options.data);
      } else if (options.method !== 'GET') {
        if (options.form) {
          formData = new FormData(options.form);
        }

        if (options.data) {
          if (!formData) {
            formData = new FormData();
          }

          Object.keys(options.data).forEach(function(key) {
            var value = options.data[key];

            if (value instanceof Object && !(value instanceof Node) &&
                !(value instanceof File)) {
              value = JSON.stringify(value);
            }

            formData.append(key, value);
          });
        }
      } else {
        if (options.data) {
          var output = [];

          Object.keys(options.data).forEach(function(key) {
            var value = options.data[key];

            if (value instanceof Object) {
              value = JSON.stringify(value);
            }

            output.push(encodeURIComponent(key) + '=' +
                encodeURIComponent(value));
          });

          var qs = output.join('&');

          if (qs) {
            options.url += '?' + qs;
          }
        }
      }

      request.open(options.method, options.url, true);

      var authorization = Cookie.getItem('token');
      if (authorization) {
        request.setRequestHeader('Authorization', 'Token token=' +
            authorization);
      }

      if (options.jsonType) {
        request.setRequestHeader('Content-Type', 'application/json');
      }

      if (options.isFileUpload && navigator.appVersion.match('MSIE 8.0')) {
        Object.keys(options.data).forEach(function(key) {
          var el = document.createElement('input');
          el.setAttribute('name', key);
          el.setAttribute('value', options.data[key]);
          el.setAttribute('type', 'hidden');

          options.form.appendChild(el);
        });

        options.form.setAttribute('target', 'upload-form');
        options.form.setAttribute('action', options.url);
        options.form.setAttribute('enctype', 'multipart/form-data');
        options.form.setAttribute('encoding', 'multipart/form-data');

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'upload-form');
        iframe.setAttribute('name', 'upload-form');
        iframe.style.display = 'none';

        iframe.addEventListener('readystatechange', function(e) {
          if (iframe.readyState === 'interactive') {
            iframe.contentWindow.document.execCommand('Stop');
            options.success();
            resolve();
          }
        });

        document.body.appendChild(iframe);

        options.form.submit();
      } else {
        request.send(formData);
      }
    });
  };


  /**
   * Return DOM from file path.
   *
   * @param {String} path path to file
   * @return {Node} DOM element
   */
  Utils.createDOM = function(path) {
    var a = document.createElement('div');
    var string = __dom__[path + '.html'];

    if (string) {
      a.innerHTML = string;

      return a.firstChild;
    } else {
      console.error('`' + path + '`', 'was not found');
    }
  };


  /**
   * Merge two objects.
   *
   * @param {Object} obj1 source object
   * @param {Object} obj2 mixing object
   * @return {Object}
   */
  Utils.merge = function(obj1, obj2) {
    if (obj2) {
      return JSON.parse((JSON.stringify(obj1) + JSON.stringify(obj2))
        .replace(/\}\{/g, ',').replace(/,\}/g, '}').replace(/\{,/g, '{'));
    }
    return obj1;
  };


  /**
   * @param {Element} el
   */
  Utils.empty = function(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };


  /**
   * Return form as an object.
   * @param {Node} form
   * @return {Object} form object
   */
  Utils.getFormAsObject = function(form) {
    var i = 0,
        length = form.elements.length,
        output = {},
        ignoreTypes = {
          submit: 1,
          reset: 1
        };

    for (; i < length; ++i) {
      var el = form.elements[i];

      if (!ignoreTypes[el.type]) {

        if (el.type === 'checkbox') {
          output[el.name] = el.checked;
        } else {
          var itemEl = form[el.name];

          if (form[el.name] && form[el.name].length &&
              !(form[el.name] instanceof Node)) {
            output[el.name] = Array.prototype.map.call(form[el.name],
                function(value) {
                  return value.value;
                });
          } else if (el.name) {
            output[el.name] = el.value;
          }
        }
      }
    }

    return output;
  };


  /**
   * Data parameter description.
   * @typedef {Object} GetFormData
   * @property {Node} form node form
   * @property {Array} keys names nodes from form
   * @property {Object} params additional data for form
   */


  /**
   * Return data as an object.
   * @param {GetFormData} data from form object that need to be sorted
   * @return {Object} data object from form
   */
  Utils.getFormData = function(data) {
    var output = {};

    if (data.form && data.keys) {
      var i = 0,
          length = data.keys.length;

      for (; i < length; ++i) {
        var name = data.keys[i],
            el = data.form[name];

        if (!!el.value) {
          if (el.type === 'checkbox') {
            output[name] = el.checked;
          } else {
            output[name] = el.value;
          }
        }
      }
    }

    if (data.params) {
      for (var key in data.params) {
        output[key] = data.params[key];
      }
    }

    return output;
  };

  /**
   * Hyphens to Upper Case a string
   * @param {String} string a string
   * @param {Boolean} firstLetterToUpperCase string to upper case 1-st letter
   * @param {Boolean} useAsTitle use whitespaces for delimiters
   * @return {String}
   */
  Utils.hyphensToCamelCase = function(string, firstLetterToUpperCase,
                                      useAsTitle) {
    string = string.replace(/[-_]([a-z])/g, function(g) {
      return (useAsTitle ? ' ' : '') + g[1].toUpperCase();
    });

    if (firstLetterToUpperCase) {
      return Utils.firstLetterToUpperCase(string);
    }

    return string;
  };


  /**
   * Upper case 1-st letter
   * @param {String} string a string
   * @return {String}
   */
  Utils.firstLetterToUpperCase = function(string) {
    return string[0].toUpperCase() + string.slice(1);
  };


  /**
   * @typedef {Object} SetFormDataOptions
   * @property {Object} data data that used to populate a form
   * @property {Array} [keys] keys from object that should be used to populate
   */

  /**
   * Populate a form with a data
   * @param {SetFormDataOptions} options to be added in form
   */

  Utils.setFormData = function(options) {
    var i = 0,
        keys = options.keys || Object.keys(options.data),
        length = keys.length,
        form = options.form;

    for (; i < length; ++i) {
      var key = keys[i];
      if (options.data[key] && form[key]) {
        var valueKey = 'value';

        if (form[key].type === 'checkbox') {
          valueKey = 'checked';
        }

        form[key][valueKey] = options.data[key];
      }
    }
  };


  /**
   * Return a value from object by string namespace.
   * @param {Object} data data where value should be searched be namespace
   * @param {String} ns namespace
   * @return {*}
   */
  Utils.getValueByNS = function(data, ns) {
    if (ns) {
      var keys = ns.split(/\./g);
      var output = data,
          key;
      while (key = keys.shift()) {
        output = output[key];
      }

      return output;
    } else if (ns) {
      return data[ns];
    }

    return null;
  };


  /**
   * Params object with form node, names form fields and button node.
   * @typedef {Object} CompareFieldOptions
   * @property {Node} form node form
   * @property {String} defaults.first - First name element with standard
   * value or the default name is password
   * @property {String} defaults.second - Second name node an element which we
   * will compare with basic element or the default name is confirm_password
   * @property {Node} button (not necessary) node button that need disabled
   */


  /**
   * Check correct password and set class if confirm password is incorrect
   * @param {CompareFieldOptions} params object with data
   * @return {Boolean} comparison result fields
   */
  Utils.compareFields = function(params) {
    params.first = params.first || form_.first;
    params.second = params.second || form_.second;

    var form = params.form,
        isPass = form[params.first].value === form[params.second].value;

    form[params.second].classList.toggle(form_.invalid, !isPass);

    if (params.button) {
      params.button.disabled = !isPass;
    }

    return isPass;
  };


  /**
   * @typedef {Object} ResetFormOptions
   * @property {Node} form node form
   */


  /**
   * Reset form and invalid elements
   * @param {ResetFormOptions} params
   */
  Utils.resetForm = function(params) {
    params.form.reset();

    var elements = params.form.getElementsByClassName(form_.invalid);

    while (elements.length) {
      elements[elements.length - 1].classList.remove(form_.invalid);
    }
  };

  /**
   * Generate appropriate URL for image, due to local and production difference
   * in images storage.
   * @param {String} url image URL
   * @return {String} correct URL
   */
  Utils.imgURL = function(url) {
    if (url.split('/')[0] === 'images') {
      return '/' + url;
    }

    return url;
  };

  /**
   * Get item by property value from array
   * @param {Array<Object>} arr
   * @param {string} prop
   * @param {string|number} val
   * @return {Object}
   */
  Utils.find = function(arr, prop, val) {
    if (!arr) return null;

    /**@type {number}*/ var i = 0;
    for (; i < arr.length; i++) {
      if (arr[i][prop] === val) {
        return arr[i];
      }
    }
  };

  var form_ = {
    invalid: 'invalid',
    first: 'password',
    second: 'confirm_password'
  };

})();
