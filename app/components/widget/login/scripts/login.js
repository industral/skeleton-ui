/**
 * Login widget.
 */



/**
 * @constructor
 * @export
 */
UI.widget.Login = function() {
  'use strict';

  this.render = function(srcNode) {
    srcNode.appendChild(dom_);
  };

  var dom_ = Utils.createDOM('components/widget/login/templates/index');
};
