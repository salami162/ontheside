(function ($) {

    // need to pass in parameterized arguments and options
    // could use some production style error handling
    // maybe better bool parse logic for collapsedInitially
    // that would allow for an override of the link title and other nifty things
    $.fn.togglify = function (toggleContent, collapsedInitially) {
        var uiIconTriangleRightArrowCss = 'ui-icon-triangle-1-e';
        var uiIconTriangleDownArrowCss = 'ui-icon-triangle-1-s';
        var isCollapsedInitially = collapsedInitially.toString() == 'true';
        var togglingRoot = $(this);

        function toggleExpansion(triangle, content) {
            triangle.toggleClass(uiIconTriangleRightArrowCss);
            triangle.toggleClass(uiIconTriangleDownArrowCss);
            content.toggle();
        }

        // create triangle element
        var createdTriangle = $('<div style="float: left; margin-left: 5px;" class="ui-icon ' + uiIconTriangleDownArrowCss + '">&nbsp;</div>').insertBefore(togglingRoot);

        // linkify the element
        var contentTitle = togglingRoot.html();
        var toggleLink = $('<a class="control_link" href="javascript:void(0)">' + contentTitle + '</a>');
        togglingRoot.replaceWith(toggleLink);

        // choose initial state
        // we create it as expanded so if needs to start collapsed, toggle
        if (isCollapsedInitially)
            toggleExpansion(createdTriangle, toggleContent);

        // assign event
        toggleLink.click(function (event) {
            event.preventDefault();
            toggleExpansion(createdTriangle, toggleContent);
        });

        return this;
    };

})(jQuery);