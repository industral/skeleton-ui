/**
 * @typedef {{
 *            dom:Node,
 *            transparent:boolean
 *          }} LoaderShowOptions
 *
 *  dom: DOM
 *  transparent: background
 */



/**
 * Loader component.
 * @constructor
 * @export
 */
UI.component.Loader = function() {
  'use strict';

  /**
   * Shows loading spinner over the component or over the page
   *
   * @param {LoaderShowOptions} options
   */
  this.show = function(options) {
    options = options || {};

    dom_ = options.dom;

    if (dom_) {
      div.style.top = dom_.offsetTop - 1 + 'px';
      div.style.left = dom_.offsetLeft - 1 + 'px';
      div.style.width = dom_.offsetWidth + 1 + 'px';
      div.style.height = dom_.offsetHeight + 1 + 'px';

      if (options.transparent) {
        div.style.backgroundColor = 'transparent';
      }

      dom_.parentNode.appendChild(div);
    } else {
      div.className = 'cmp-general-loader';
      document.body.appendChild(div);

      var span = document.createElement('span');
      span.innerHTML = 'Loading...';

      div.appendChild(span);
    }
  };

  /**
   * Hiding loading spinner
   */
  this.hide = function() {
    if (dom_) {
      dom_.parentNode.removeChild(div);
    } else {
      document.body.removeChild(div);
    }
  };

  var div = document.createElement('div');
  div.className = 'cmp-loader';

  var dom_ = null;
};
