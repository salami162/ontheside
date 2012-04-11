// define FILTERABLES for filter plugin 
var cpuFilterables = [
        {   name: 'CPU_Model',
            display_name: 'CPU Model', 
            id: '7e865164-4ff3-4e10-ba7e-5344e2796f03', 
            attribute_defs: [
                { name: 'DateCreated', display_name:'Date Created', data_type:{type:'datetime',format:'YYYY-MM-DD hh:mm:ss.ms', multivalue:false}, id: '00000000-0000-0000-0000-000000000002' }, 
                { name: 'LastUpdated', display_name:'Last Updated', data_type:{type:'time',format:'hh:mm:ss.ms', multivalue:false}, id: '00000000-0000-0000-0000-000000000001' }, 
                { name: 'Name', display_name:'Name', data_type:{type:'string', format:'text', multivalue:false}, id: '734aefd4-3aab-41ac-8eeb-3729e449e9ee' }, 
                { name: 'Corner Silicon Type', display_name:'Corner Silicon Type', data_type:{type:'string', format:'textile', multivalue:false}, id: '81b1d6c8-ab98-4d1e-b6e3-00940d2c3dd0'},
                { name: 'CPU Boost Frequency (MHz)', display_name:'CPU Boost Frequency (MHz)', data_type:{type:'number', format:'double', multivalue:false}, id: '00000000-0000-0000-0000-000000000003' }, 
                { name: 'Number of Cores', display_name:'Number of Cores', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000004' }, 
                { name: 'CPU Family', display_name:'CPU Family', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000004' }, 
                { name: 'CPU Frequency', display_name:'CPU Frequency', data_type:{type:'number', format:'double', multivalue:false}, id: '00000000-0000-0000-0000-000000000005' }, 
                { name: 'CPU Package Material', display_name:'CPU Package Material', data_type:{type:'discreteset', format:'discreteset', multivalue:false, allowedvalues:['high','medium','low']}, id: '00000000-0000-0000-0000-000000000007' }, 
                { name: 'CPU Package Pin-out', display_name:'CPU Package Pin-out', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000008' }, 
                { name: 'CPU Package Stack', display_name:'CPU Package Stack', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000009' }, 
                { name: 'L2 Cache Size (KB)', display_name:'L2 Cache Size (KB)', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000010' }, 
                { name: 'L3 Cache Size (MB)', display_name:'L3 Cache Size (MB)', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000011' }, 
                { name: 'Lidded', display_name:'Lidded', data_type:{type:'boolean', format:'', multivalue:false}, id: '00000000-0000-0000-0000-000000000012' }
            ] 
        },
        {   name: 'InventoryItem', 
            display_name: 'Inventory Item', 
            id: '11F88778-E615-43C0-8983-60FF95E40C38', 
            attribute_defs: [
                {attribute_defsname: 'Name', display_name:'Name', data_type:{type:'string', format:'text', multivalue:false}, id: 'A00F178F-157A-468F-8CB2-30F808094AE5' }, 
                { name: 'UserCreated', display_name:'User Created', data_type:{type:'string', format:'text', multivalue:false}, id: '98E7A16C-3140-4244-A0F4-25743EE0B0AB' }, 
                { name: 'DateCreated', display_name:'Date Created', data_type:{type:'date', format:'YYYY-MM-DD', multivalue:false}, id: '840A1EC7-CAF0-4780-BFDA-8381F324CB1C' }, 
                { name: 'LastUpdated', display_name:'Last Updated', data_type:{type:'date', format:'YYYY-MM-DD', multivalue:false}, id: 'FACA56D3-600F-47B8-80B1-8BA96121103C' }, 
                { name: 'Source System', display_name:'Source System', data_type:{type:'string', format:'text', multivalue:false}, id: '8B60A07C-09CB-45B7-9579-A3622158F614'},
                { name: 'Target Inventory Model', display_name:'Target Inventory Model', data_type:{type:'string', format:'text', multivalue:false}, id: '8B08EF58-E7C5-4ED1-B1B6-3BD0F7E0EAE9' }
            ] 
        }
];

var dimmFilterables = [
        {   name: 'DIMM_Model', 
            display_name: 'DIMM Model', 
            id: '7e865164-4ff3-4e10-ba7e-5344e2796f03', 
            attribute_defs: [
                { name: 'DateCreated', display_name:'Date Created', data_type:{type:'date',format:'YYYY-MM-DD', multivalue:false}, id: '00000000-0000-0000-0000-000000000002' }, 
                { name: 'LastUpdated', display_name:'Last Updated', data_type:{type:'datetime',format:'YYYY-MM-DD hh:mm:ss.ms', multivalue:false}, id: '00000000-0000-0000-0000-000000000001' }, 
                { name: 'Name', display_name:'Name', data_type:{type:'string', format:'text', multivalue:false}, id: '734aefd4-3aab-41ac-8eeb-3729e449e9ee' }, 
                { name: 'Memory Technology', display_name:'Memory Technology', data_type:{type:'string', format:'text', multivalue:false}, id: '81b1d6c8-ab98-4d1e-b6e3-00940d2c3dd0'},
                { name: 'Capacity (MB)', display_name:'Capacity (MB)', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000003' }, 
                { name: 'Number of External Ranks', display_name:'Number of External Ranks', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000004' }, 
                { name: 'CAS Latency', display_name:'CAS Latency', data_type:{type:'number', format:'double', multivalue:false}, id: '00000000-0000-0000-0000-0000000000013' }, 
                { name: 'Address Integrity', display_name:'Address Integrity', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000005' }, 
                { name: 'Data Integrity', display_name:'Data Integrity', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-0000000000006' }, 
                { name: 'DRAM Stacked', display_name:'DRAM Stacked', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000007' }, 
                { name: 'IC Capacity (Mb)', display_name:'IC Capacity (Mb)', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000008' }, 
                { name: 'IC width (Bits)', display_name:'IC width (Bits)', data_type:{type:'number', format:'int', multivalue:false}, id: '00000000-0000-0000-0000-000000000009' }, 
                { name: 'Memory Form Factor', display_name:'Memory Form Factor', data_type:{type:'string', format:'text', multivalue:false}, id: '00000000-0000-0000-0000-000000000010' }, 
                { name: 'Memory Speed (MT/s)', display_name:'Memory Speed (MT/s)', data_type:{type:'number', format:'double', multivalue:false}, id: '00000000-0000-0000-0000-000000000011' }, 
                { name: 'Module Height (in.)', display_name:'Module Height (in.)', data_type:{type:'number', format:'double', multivalue:false}, id: '00000000-0000-0000-0000-000000000012' }, 
            ] 
        },
        {   name: 'InventoryItem', 
            display_name: 'Inventory Item', 
            id: '11F88778-E615-43C0-8983-60FF95E40C38', 
            attribute_defs: [
                { name: 'Name', display_name:'Name', data_type:{type:'string', format:'text', multivalue:false}, id: 'A00F178F-157A-468F-8CB2-30F808094AE5' }, 
                { name: 'UserCreated', display_name:'User Created', data_type:{type:'string', format:'text', multivalue:false}, id: '98E7A16C-3140-4244-A0F4-25743EE0B0AB' }, 
                { name: 'DateCreated', display_name:'Date Created', data_type:{type:'date',format:'YYYY-MM-DD', multivalue:false}, id: '840A1EC7-CAF0-4780-BFDA-8381F324CB1C' }, 
                { name: 'LastUpdated', display_name:'Last Updated', data_type:{type:'date',format:'YYYY-MM-DD', multivalue:false}, id: 'FACA56D3-600F-47B8-80B1-8BA96121103C' }, 
                { name: 'Source System', display_name:'Source System', data_type:{type:'string', format:'text', multivalue:false}, id: '8B60A07C-09CB-45B7-9579-A3622158F614'},
                { name: 'Target Inventory Model', display_name:'Target Inventory Model', data_type:{type:'string', format:'text', multivalue:false}, id: '8B08EF58-E7C5-4ED1-B1B6-3BD0F7E0EAE9' }
            ] 
        },
        {   name: 'DIMM_Item', 
            display_name: 'DIMM Item', 
            id: 'DC7B1C52-FEE1-48E4-AF92-401F6ED35995', 
            attribute_defs: [
                { name: 'IC Manufacturer', display_name:'IC Manufacturer', data_type:{type:'string', format:'text', multivalue:false}, id: '91AFFF7B-FC69-4FE2-ADB5-773765632EFE' }, 
                { name: 'IC Die Revision', display_name:'IC Die Revision', data_type:{type:'string', format:'text', multivalue:false}, id: '2982A215-B3C1-4D6B-A1A4-533A38F11DA4' }, 
                { name: 'IC Part Number', display_name:'IC Part Number', data_type:{type:'string', format:'text', multivalue:false}, id: 'FBF7682D-AAD6-4531-946D-994B1404E2B6' }, 
                { name: 'Register Manufacturer', display_name:'Register Manufacturer', data_type:{type:'string', format:'text', multivalue:false}, id: '85D66C0C-EFFA-41E4-8A6D-DBBBF423262E' }
            ] 
        }

];
  
var sampleFilter = {
    "@xsi:type": "OntologyFilterCombination",
    "group_operator": "AND",
    "filters": [
      {
        "@xsi:type": "OntologyFilter",
        "target": {
            "attribute_display_name": "Date Created",
            "attribute_id": "00000000-0000-0000-0000-000000000002",
            "attribute_name": "DateCreated",
            "attribute_data_type": {"type":"datetime", "format":"YYYY-MM-DD hh:mm:ss.ms","multivalues":false},
            "entity_type_id": "7e865164-4ff3-4e10-ba7e-5344e2796f03",
            "entity_type_name": "CPU_Model",
            "entity_type_display_name": "CPU Model"
        },
        "type": "EQUAL",
        "values": ["2011-12-18 04:10:07"],
        "enabled": "True",
        "is_not_in_check_dynamic_attribute_filter": "False",
        "is_dynamic_filter": "False"
      },
      {
        "@xsi:type": "OntologyFilter",
        "target": {
            "attribute_id": "00000000-0000-0000-0000-000000000001",
            "attribute_name": "Number of Cores",
            "attribute_display_name": "Number of Cores",
            "attribute_data_type": {"type":"number", "format":"int", "multivalues":false },
            "entity_type_id": "7e865164-4ff3-4e10-ba7e-5344e2796f03",
            "entity_type_name": "CPU_Model",
            "entity_type_display_name": "CPU Model"
        },
        "type": "GREATER_THAN",
        "values": ["2"],
        "enabled": "True",
        "is_not_in_check_dynamic_attribute_filter": "False",
        "is_dynamic_filter": "False"
      }
    ],
    "subgroups": null
}

var platform_data = {
    entity_name: "Drachma",
    id: "d442f749-261c-4d32-8542-f932cc12224b",
    num_of_sockets: 2,
    num_of_pcies: 5,
    num_of_satas: 4,
    num_of_dcts: 2,
    num_of_dimms: 4 
};

$(function() {
    
    // "Add" button
    $("table tbody").on("click", ".btn-add", function(event) {
        var insert_row = $("#new_row_template").html();
        $(insert_row).insertBefore($(this).parents("tr"));
        $(this).parents("tr").prev().find(":input").focus();
    });
    // "Delete" button
    $("table tbody").on("click", ".btn-delete", function(event) {
        $(this).parents("tr").remove();
    });
    // "Edit" button
    $("table tbody").on("click", ".btn-edit", function(event) {
        var input_value = $(this).parents("tr").find("td.description > span").text();
        var td_el = $(this).parent("td").prev();
        td_el.html('<input type="text" style="margin-bottom:0px;" value="' + input_value + '"></input>');
        $(this).parents("tr").find(":input").focus();
        $(this).hide();            
    });
    // "INPUT" <-- key "enter" 
    $("table tbody").on("keypress", "input", function(event) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if(code == 13) { //Enter keycode
            update_config_value(this);
            return false;
        }
    });
    // INPUT <-- lose focus
    $("table tbody").on("focusout", "input", function(event) {
        update_config_value(this);
    });
    
    // render "Constraints" in step 3
    populate_constraints($("div.constraints"));

    // initialize smartWizard
    $(".swMain").smartWizard({
        transitionEffect:'slide',
        enableAllSteps: true,
        enableFinishButton: true, 
        labelFinish:'Save',
        labelExit:'Cancel',
        onShowStep: function(obj) {
            var step_num= obj.attr('rel'); // get the current step number
            if (step_num == 2) {
                // repopulate the grid if step 1 changes.
                populate_permutation($("div.permutation"));
            }
        },
        onFinish: function() {
        },  // triggers when Finish button is clicked
        onExit: function() {
        }   
    });
}); 

// functions for event
function update_config_value(input_control) {
    $(input_control).parents("tr").find("a.btn-edit").show();   
    var input_value = $(input_control).val();
    var td_el = $(input_control).parent("td");
    //$(input_control).remove();
    td_el.html('<span>' + input_value + '</span>');
    td_el.attr("data-config", input_value);
}

// function for populate STEP-3 "Constraints"
function populate_constraints(section) {
    
    // register Handlebar Partial
    Handlebars.registerPartial("socket", $("#socket-template").html());
    Handlebars.registerPartial("dimm", $("#dimm-template").html());
    Handlebars.registerPartial("constraint", $("#constraint-item-template").html());

    // create Handlerbar Helper
    Handlebars.registerHelper("socket_rendition", function (num_of_sockets, num_of_dimms, socket_configs, dimm_configs, options) {
        var ret = "";
        var socket_number = parseInt(num_of_sockets);
        for (var i_socket = 0; i_socket < socket_number; i_socket ++) {
            var data = {"i":i_socket, "num_of_dimms":num_of_dimms};
            if ($.isArray(socket_configs)) {
                data["socket_configs"] = socket_configs;
            }
            if ($.isArray(dimm_configs)) {
                data["dimm_configs"] = dimm_configs;
            }
            if ($.isArray(socket_configs) || $.isArray(dimm_configs)) {
                data["num_of_dimms"] = undefined;
            }
            ret = ret + options.fn(data);
        }
        return ret;
    });
    
    Handlebars.registerHelper("dimm_rendition", function (num_of_dimms, options) {
        var ret = "";
        var dimm_number = parseInt(num_of_dimms);
        for (var i_dimm = 0; i_dimm < dimm_number; i_dimm ++) {
            ret = ret + options.fn({"i":i_dimm});
        }
        return ret;
    });

    var source   = $("#constraints-template").html();
    var template = Handlebars.compile(source);
    var template_html = template(platform_data);
    
    $(section).html(template_html);
    $(section).find(".filetree").treeview({
        toggle: function() {
            console.log("%s was toggled.", $(this).find("span").text());
        }
    });  
    
    // define existing constrain for the first
    $(section).find("span.constrain:first").data(sampleFilter);
    $(section).find("span.constrain:first").addClass("hasFilters");
    $(section).find("span.constrain:first").addClass("ui-state-active");
    
    // build filters
    var dialog_content = $('<div></div>');
    dialog_content.filter_builder({
        filterables: cpuFilterables,
        filter_definition: sampleFilter
    });
    var defAttrString = $(dialog_content).filter_builder('get_inventory_constrain_attributes');
    var orghtml = $(section).find("span.constrain:first").find(".filter-value").html();
    $(section).find("span.constrain:first").find(".filter-value").html(defAttrString + orghtml);
    $(section).find("span.constrain:first").addClass("hasFilters");
    
    // build tooltip
    var constrainString = $(dialog_content).filter_builder('get_inventory_constrain_data');
    $(section).find("span.constrain:first").find("span.filter-value").attr("title", constrainString);
    $(section).find("span.constrain:first").find("span.filter-value[title]").qtip({
        position: {
            my: "top right", // Use the corner...
            at: "bottom left" // ...and opposite corner
        },
        style: {
            classes: 'ui-tooltip-shadow ui-tooltip-green'
        }                                
    }); 
    
        // initialize the filter click event   
    $(section).find("span.filter").click(function(event) {
        var self = this;
        var type = $(self).parents().attr("data-model");
        
        var dialog_content = $('<div></div>');
        var existingConstrain = $(self).parent().data();        
        $('body').append(dialog_content);
        
        dialog_content.filter_builder({
            filterables: type=="CPU_Model" ? cpuFilterables : dimmFilterables,
            filter_definition: existingConstrain
        });                

        dialog_content.dialog({
            width: 900,
            height: 650,
            modal:true,
            buttons: {
                'Ok': function() {
                    // display constrain attributes on the UI.
                    var valid = $(dialog_content).filter_builder('validate_filters');
                    if (!valid) {return;}
                    var attrString = $(dialog_content).filter_builder('get_inventory_constrain_attributes');
                    var constrainObj = $(dialog_content).filter_builder('get_filter_data');
                    $(self).parent().data(constrainObj);
                    
                    $(self).parent().find("span.filter-value").html(attrString);
                    $(self).parent().addClass("hasFilters");
                    $(self).parent().addClass("ui-state-active");
                    
                    // build tooltip for the constrain values.
                    var constrainString = $(dialog_content).filter_builder('get_inventory_constrain_data');
                    $(self).parent().find("span.filter-value").attr("title", constrainString);
                    $(self).parent().find("span.filter-value[title]").qtip({
                        position: {
                            my: "top right", // Use the corner...
                            at: "bottom left" // ...and opposite corner
                        },
                        style: {
                            classes: 'ui-tooltip-shadow ui-tooltip-green'
                        }                                
                    }); 
                                        
                    $(this).dialog('close');
                },
                'Cancel': function() {
                    $(this).dialog('close');
                }
            },
            close: function() { dialog_content.remove(); }
        });

        event.preventDefault();
        return false;            
    });

}

    
// function for populate STEP-3 "Constraints"
function populate_permutation(section) {
    var socket_configs = _.map($("div.node > table").find("td.description"), function(td) { return $(td).attr("data-config"); });
    console.log(socket_configs);
    var dimm_configs = _.map($("div.dimm > table").find("td.description"), function(td) { return $(td).attr("data-config"); });
    console.log(dimm_configs);
    
    platform_data["socket_configs"] = socket_configs;
    platform_data["dimm_configs"] = dimm_configs;
    
    // register Handlebar Partial
    Handlebars.registerPartial("dimm_config", $("#dimm-config-template").html());
    Handlebars.registerPartial("config", $("#config-item-template").html());

    var source   = $("#configs-template").html();
    var template = Handlebars.compile(source);
    var template_html = template(platform_data);
    
    $(section).html(template_html);
    $(section).find(".filetree").treeview({
        toggle: function() {
            console.log("%s was toggled.", $(this).find("span").text());
        }
    });  
    
}