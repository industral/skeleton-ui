/**
 * @typedef {{
 *            status:string,
 *            timeout:number,
 *            title: string,
 *            message: string
 *          }} NotificationShowOptions
 *
 *  status: status
 *  timeout: timeout to hide notification,
 *  title: title,
 *  message: message
 */



/**
 * Notification.
 *
 * @constructor
 * @export
 */
UI.component.Notification = function() {
  'use strict';

  // --------------------------------------------------------------------
  // Public methods/variables
  // --------------------------------------------------------------------

  /**
   * Show notification.
   *
   * @param  {NotificationShowOptions} params
   * @return {Node}
   */
  this.show = function(params) {
    var status = params.status || 'error';

    if (status === 'error') {
      TIMEOUT = -1;
    }

    TIMEOUT = params.timeout || TIMEOUT;

    var el = Utils.createDOM(
        'components/component/notification/templates/index');

    el.setAttribute('data-status', status);

    el.querySelector('h1').innerHTML = params.title;
    el.querySelector('p').innerHTML = params.message;


    var root = null;
    if (document.querySelector('#notifications')) {
      root = document.querySelector('#notifications');
    } else {
      var notification = document.createElement('div');
      notification.setAttribute('id', 'notifications');

      document.body.appendChild(notification);

      root = notification;
    }

    root.appendChild(el);

    el.classList.add('show');

    function fadeOut() {
      el.parentNode.removeChild(el);
    }

    if (TIMEOUT !== -1) {
      var t = setTimeout(fadeOut, TIMEOUT);
    }

    el.querySelector('button').addEventListener('click', function() {
      if (t) {
        clearTimeout(t);
      }

      fadeOut();
    });

    return el;
  };

  // --------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------


  // --------------------------------------------------------------------
  // Private variables
  // --------------------------------------------------------------------

  var TIMEOUT = 5000;
};
