/**
 * Home layout.
 */



/**
 * @constructor
 * @export
 */
UI.layout.DEFAULT = function() {
  'use strict';

  /**
   * Renders layout (page and components: header, navigation)
   */
  this.render = function() {
    initComponents_();

    var routerData = UI.common.Router.get();

    renderPage_(routerData.page);
  };

  function init_() {
    addEventsHandler_();
  }

  function addEventsHandler_() {
    UI.common.Router.on('change', function(data) {
      renderPage_(data.page);
    });
  }

  /**
   * Initialize components: header and navigation.
   * @private
   */
  function initComponents_() {
    var header = new UI.widget.Header();
    header.render(dom_.getElementsByTagName('header')[0]);

    var navigation = new UI.widget.Navigation();
    navigation.render(dom_.getElementsByTagName('aside')[0]);

    navigation.on('change', function(data) {
      UI.common.Router.set({
        page: data.id
      });
    });

    document.body.appendChild(dom_);
  }

  /**
   * Render page
   * @param {string} pageName
   * @private
   */
  function renderPage_(pageName) {
    if (pageName && currentPageName_ !== pageName) {
      currentPageName_ = pageName;

      if (currentPage_) {
        currentPage_.destroy();
      }

      currentPage_ = new UI.page[pageName]();
      currentPage_.render(dom_);
    }
  }

  var dom_ = Utils.createDOM('components/layout/home/templates/index');

  var currentPage_ = null;

  var currentPageName_ = '';

  init_();
};
