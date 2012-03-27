$(function(){
   'use strict';	   
	
	var view_id = "d442f749-261c-4d32-8542-f932cc12224b";


    init_view_edit(view_id);

});

function init_view_edit(view_id) {

    var section = $("div.view_edit");

// model    
    var currentView = new OnTheSide.DataView({
        id: view_id,
        ResourceMode: "Description"
    });

// views
    var pivotLayout = new OnTheSide.PivotLayout({
        model: currentView.pivot_hierarchy,
        el: $(section).find("div.pivot_type"),
        model_template: $("#pivot-type-template").html(),
        partial_templates: [{name: "related_partial", html: $("#entity-type-partial-template").html()}]
    });

    var groupbyAttrLayout = new OnTheSide.AttrLayout({
        model: OnTheSide.GroupByAttribute,
        collection: currentView.groupby_attributes,
        tagName:  "ul",
        el: $(section).find("ul.sortable_groupby"),
        model_template: $("#groupby-attribute-template").html()
    });
    
    var displayAttrLayout = new OnTheSide.AttrLayout({
        model: OnTheSide.DisplayAttribute,
        collection: currentView.display_attributes,
        tagName:  "ul",
        el: $(section).find("ul.sortable_display"),
        model_template: $("#display-attribute-template").html()
    });

    var aggregateAttrLayout = new OnTheSide.AttrLayout({
        model: OnTheSide.AggregateAttribute,
        collection: currentView.aggregate_attributes,
        tagName:  "ul",
        el: $(section).find("ul.sortable_aggregate"),
        model_template: $("#aggregate-attribute-template").html()
    });
    
    var sortAttrLayout = new OnTheSide.AttrLayout({
        model: OnTheSide.SortAttribute,
        collection: currentView.sort_attributes,
        tagName:  "ul",
        el: $(section).find("ul.sortable_sort"),
        model_template: $("#sort-attribute-template").html()
    });

    var viewLayout = new OnTheSide.DataViewLayout({
        model: currentView,
        el: $(section),
        model_template: $("#base-info-template").html(),
        pivot_hierarchy_layout: pivotLayout,
        groupby_attributes_layout: groupbyAttrLayout,
        aggregate_attributes_Layout: aggregateAttrLayout,
        display_attributes_layout: displayAttrLayout,
        sort_attributes_layout: sortAttrLayout           
    });

// smart wizard
    $(section).find(".swMain").smartWizard({
        transitionEffect:'slide',
        enableAllSteps: true,
        enableFinishButton: true, 
        labelFinish:'Save',
        labelExit:'Cancel',
        onFinish: function() {
            viewLayout.saveDataView();
        },  // triggers when Finish button is clicked
        onExit: function() {
            viewLayout.cancelEditing();
        }   
    });

//    show_busy_indicator($("html"));
    currentView.fetch({
        url: site_root() + "/data/DataView.json",
        success: function(response, status, xhr) {
//            hide_busy_indicator($("html"));
        }
    });

} 

function site_root() {
	return /*document.location.host + */'/AptanaJQuery/viewedit';
}


 
