(function ($) {
    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this);

                $this.addClass('ui-state-default').addClass('ui-corner-all');
                $this.css({ padding: '2px', 'padding-right': '4px', cursor: 'pointer', position: 'relative' });

                var link_text = $this.html();
                $this.html($('<span style="position:absolute; left:0;" class="ui-icon ' + options.icon + '">'));
                if (link_text != '') {
                    $this.append('</span><span style="padding-left:18px">' + link_text + '</span>');
                }
                $this.attr('title', options.tooltip);

                $this.hover(
		   function () { $(this).addClass('ui-state-hover'); },
		   function () { $(this).removeClass('ui-state-hover'); }
 		);
            });
        }
    };

    $.fn.tiny_button = function (method) {
        return methods.init.apply(this, arguments);
    };
})(jQuery);
