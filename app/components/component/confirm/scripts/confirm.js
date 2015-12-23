/**
 * @typedef {{
 *            title:string,
 *            content:string
 *          }} ConfirmOptions
 *
 *  title: title
 *  content: content
 */



/**
 * Confirm dialog.
 *
 * @param {ConfirmOptions=} opt_params
 * @constructor
 * @export
 */
UI.component.Confirm = function(opt_params) {
  'use strict';

  Emitter(this);

  opt_params = opt_params || {};

  UI.component.Modal.show({
    noClose: true,
    width: 300,
    height: 130,
    title: opt_params.title,
    content: opt_params.content,
    buttons: [
      {
        title: 'Cancel',
        'class': 'secondary',
        action: function() {
          UI.component.Modal.hide();

          this_.emit('cancel');
        }
      },
      {
        title: 'OK',
        type: 'submit',
        action: function() {
          UI.component.Modal.hide();

          this_.emit('ok');
        }
      }
    ]
  });

  document.getElementsByClassName('cmp-component-modal')[0]
  .classList.add('cmp-confirm');

  var this_ = this;
};
