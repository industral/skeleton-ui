/**
 * Header widget.
 */



/**
 * @constructor
 * @export
 */
UI.widget.Header = function() {
  'use strict';

  /**
   * Renders component
   * @param {Element} srcNode Container.
   */
  this.render = function(srcNode) {
    srcNode.appendChild(dom_);

  };

  var dom_ = Utils.createDOM('components/widget/header/templates/index');
};
