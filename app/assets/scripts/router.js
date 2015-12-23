/**
 * Router.
 */
UI.common.Router = (new function() {
  Emitter(this);

  this.set = function(params) {
    params = params || {};

    params = Utils.merge(params.clear_ ? {} : this_.get(), params);

    delete params.clear_;

    params.page = params.page || UI.settings.defaultPage;

    window.location.hash = generateHash_(params);
  };

  /**
   * Get params.
   * @param {String} hash url hash
   * @param {Boolean} withoutSubstitute should avoid params substitute
   * @return {Object} params
   * @private
   */
  this.get = function(hash, withoutSubstitute) {
    hash = hash || location.hash;

    var output = {};

    if (hash) {
      var params = hash.split('&'),
          i = 0, length = params.length;

      for (; i < length; ++i) {
        var paramString = params[i].replace(/^#/, '');

        var splitParam = paramString.split('=');
        output[splitParam[0]] = splitParam[1];
      }

    }

    return output;
  };

  window.onhashchange = function() {
    this_.emit('change', this_.get());
  };

  function generateHash_(params) {
    var arrayParams = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        arrayParams.push(key + '=' + params[key]);
      }
    }

    return '#' + arrayParams.join('&');
  }

  var this_ = this;
});
