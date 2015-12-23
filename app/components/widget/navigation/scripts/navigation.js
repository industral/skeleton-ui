/**
 * Navigation widget.
 */



/**
 * @constructor
 * @export
 */
UI.widget.Navigation = function() {
  'use strict';

  Emitter(this);

  /**
   * Renders component
   * @param {Element} srcNode Container.
   */
  this.render = function(srcNode) {
    srcNode.appendChild(dom_);

  };

  var dom_ = Utils.createDOM('components/widget/navigation/templates/index');
};
