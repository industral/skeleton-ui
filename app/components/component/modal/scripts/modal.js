/**
 * @typedef {{
 *            width:number,
 *            height:number,
 *            title:string,
 *            content:string
 *          }} ModalShowOptions
 *
 *  width: width
 *  height: height,
 *  title: title,
 *  content: content
 */



/**
 * Modal component.
 *
 * @constructor
 */
UI.component.Modal = (new function() {
  'use strict';

  /**
   * Show modal window in page.
   *
   * @param {ModalShowOptions} options
   * @this {UI.component.Modal} instance
   */
  this.show = function(options) {
    this.hide();

    document.body.classList.add('disabled');

    options = options || {};

    options_ = options;

    var width = (options.width || 530) + 'px';
    var height = (options.height || 100) + 'px';

    //TODO: add maxHeight check

    dom_ = Utils.createDOM('components/component/modal/templates/index');

    dom_.style.width = width;
    dom_.style.height = height;

    dom_.querySelector('.title').innerHTML = options.title || '';

    var content = options.content;
    var contentEl = dom_.querySelector('.content');
    contentEl.style.height = ((options.height || 100) - 95) + 'px';

    if (typeof content === 'object') {
      contentEl.appendChild(content);
    } else {
      contentEl.innerHTML = content || '';
    }

    mask_ = document.createElement('div');
    mask_.id = 'mask';
    document.body.appendChild(mask_);

    createButtons(options);

    document.body.appendChild(dom_);

    positionModal_();
    closeModal_();
    addEventsListeners_();

  };

  /**
   * Hide modal window and delete DOM.
   */
  this.hide = function() {
    document.body.classList.remove('disabled');
    if (dom_) {
      document.body.removeChild(mask_);
      dom_.parentNode.removeChild(dom_);

      dom_ = null;

    }

    window.removeEventListener('resize', positionModal_);
  };

  /**
   * @typedef {{
 *               buttons:Array<{{type:String, callback:Function}}>,
 *            }} ModalHideOptions
   *
   *  buttons: buttons array of buttons
   */

  /**
   * Create buttons with actions.
   *
   * @param {ModalHideOptions} options object of components for Modal windows.
   */
  function createButtons(options) {
    var buttons = options.buttons || [];

    var actions = dom_.querySelector('.actions');
    for (var i = 0; i < buttons.length; ++i) {
      var button = buttons[i];

      var buttonEl = document.createElement('button');

      if (button.type) {
        buttonEl.setAttribute('data-type', button.type);
      }

      if (button.class) {
        buttonEl.className = button.class;
      }

      buttonEl.classList.add('sg-button');

      buttonEl.innerHTML = button.title || '';

      if (button.action) {
        buttonEl.onclick = button.action;
      }
      actions.appendChild(buttonEl);
    }
  }

  /**
   * @private
   */
  function positionModal_() {
    var documentWidth = document.documentElement.offsetWidth,
        documentHeight = document.documentElement.offsetHeight,
        modalWidth = dom_.offsetWidth,
        modalHeight = dom_.offsetHeight;

    if (modalHeight > documentHeight) {
      modalHeight = documentHeight - 20;
    }

    dom_.style.left = (documentWidth - modalWidth) / 2 + 'px';
    dom_.style.top = (documentHeight - modalHeight) / 2 + 'px';
  }

  /**
   * @private
   */
  function closeModal_() {
    var actionClose = dom_.querySelector('.close-modal');

    if (options_.noClose) {
      actionClose.parentNode.removeChild(actionClose);
    } else {
      actionClose.onclick = this_.hide;
    }
  }

  /**
   * Add Events Listeners.
   * @private
   */
  function addEventsListeners_() {
    window.addEventListener('resize', positionModal_);
  }

  var this_ = this;

  var options_ = null;

  var mask_ = null;

  var dom_ = null;
});
