/**
 * Login layout.
 */



/**
 * @constructor
 * @export
 */
UI.layout.DEFAULT = function() {
  'use strict';

  this.render = function() {
    window.location.hash = '#page=Login';

    new UI.page.Login().render(dom_);

    document.body.appendChild(dom_);
  };

  var dom_ = Utils.createDOM('components/layout/login/templates/index');
};
