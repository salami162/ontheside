define([
  'vendor/underscore',
  'vendor/jquery'
], function (_, $) {

  var $loading = $('<div id="loading-overlay-id" class="loading-overlay"/></div><div title="loading" id="loading" role="alert"><div class="loading-spinner"/></div>');
  var hideLoadingDelay;

  var LoadingOverlay = {
    show : function (sticky) {
      this._clear();

      $loading.appendTo('body');

      if (!sticky) {
        // Hide the loading if it's not hidden in 20s
        hideLoadingDelay = _(this.hide).chain().bind(this).delay(20000);
      }
    },

    hide : function () {
      this._clear();
      $loading.remove();
    },

    _clear : function () {
      if (hideLoadingDelay) {
        window.clearTimeout(hideLoadingDelay);
      }
    }
  };

  return LoadingOverlay;
});