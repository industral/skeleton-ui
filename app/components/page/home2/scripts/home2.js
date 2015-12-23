/**
 * Home2 page.
 */



/**
 * Home page.
 * @constructor
 */
UI.page.Home2 = function() {
  'use strict';

  this.render = function(srcNode) {
    srcNode.getElementsByTagName('section')[0].appendChild(dom_);
  };

  this.destroy = function() {
    dom_.remove();
  };

  function init_() {
  }

  var dom_ = Utils.createDOM('components/page/home2/templates/index');

  init_();
};
