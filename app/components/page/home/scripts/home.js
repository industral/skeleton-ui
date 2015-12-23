/**
 * Home page.
 */



/**
 * Home page.
 * @constructor
 */
UI.page.Home = function() {
  'use strict';

  this.render = function(srcNode) {
    srcNode.getElementsByTagName('section')[0].appendChild(dom_);
  };

  this.destroy = function() {
    dom_.remove();
  };

  function init_() {
  }

  var dom_ = Utils.createDOM('components/page/home/templates/index');

  init_();
};
