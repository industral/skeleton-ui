/**
 * Login page.
 */



/**
 * @constructor
 */
UI.page.Login = function() {
  'use strict';

  this.render = function(srcNode) {
    srcNode.getElementsByClassName('login-container')[0].appendChild(dom_);
  };

  this.destroy = function() {
    dom_.remove();
  };

  function init_() {
    var widget = new UI.widget.Login();
    widget.render(dom_.getElementsByClassName('container')[0]);
  }

  var dom_ = Utils.createDOM('components/page/login/templates/index');

  init_();
};
