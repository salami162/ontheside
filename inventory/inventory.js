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


var sampleFilter1 = {
    "@xsi:type": "OntologyFilterCombination",
    "Operator": "AND",
    "Filters": {
        "BaseFilters": null,
        "FilterCombination": [
          {
              "@xsi:type": "OntologyFilterCombination",
              "Operator": "OR",
              "Filters": {
                  "BaseFilters": [
                {
                    "@xsi:type": "OntologyFilter",
                    "Attribute": {
                        "AttributeId": "00000000-0000-0000-0000-000000000002",
                        "AttributeName": "DateCreated",
                        "EntityTypeId": "7e865164-4ff3-4e10-ba7e-5344e2796f03",
                        "EntityTypeName": "CPU-Model"
                    },
                    "FilterType": "EQUAL",
                    "FilterValues": ["12/18/2011 4:10:07 AM"],
                    "Enabled": "True",
                    "IsNotInCheckDynamicAttributeFilter": "False",
                    "IsDynamicFilter": "False"
                },
                {
                    "@xsi:type": "OntologyFilter",
                    "Attribute": {
                        "AttributeId": "00000000-0000-0000-0000-000000000001",
                        "AttributeName": "Number of Cores",
                        "EntityTypeId": "7e865164-4ff3-4e10-ba7e-5344e2796f03",
                        "EntityTypeName": "CPU-Model"
                    },
                    "FilterType": "GREATER_THAN",
                    "FilterValues": ["2"],
                    "Enabled": "True",
                    "IsNotInCheckDynamicAttributeFilter": "False",
                    "IsDynamicFilter": "False"
                }
                  ],
                  "FilterCombination": null
              }
          }
        ]
    }
}
  
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

   
$(function() {
    // backbone
    var title = this.title;
    var section = $("div.dynamic");
    var platform_name = "Dracham";
    
    var platform_model = new SkynetWeb.Platform({
        entity_type_name: "Platform",
        entity_name: platform_name,
    });

    var def = {
        pcie: $("#pcie-template").html(),
        sata: $("#sata-template").html(),
        socket: $("#socket-template").html(),
        dimm: $("#dimm-template").html()
    };
    
    var platform_view = new SkynetWeb.EntityView({
        model: platform_model,
        el: section,
        model_template: $("#platform-template").html(),
        template_def: def
    });    

    platform_model.fetch({
        url: site_root() + "/data/inventory_platform.json",
        success: function(response, xhr) {
            // compile the source template to html
            if (title == "Inventory Mockup - m") {
                init_style_m(section);
            }
            else {
                init_style_t(section);
            }
        }     
    });    
    // doT template
        
});

function init_style_m(section){
    init_common(section);
    init_constrain_m(section);
}

function init_common(section){
    
    $(section).find(".filetree").treeview({
        toggle: function() {
            console.log("%s was toggled.", $(this).find(">span").text());
        }
    });  
          
    $("button").button();
    
    // define existing constrain for the first
    $(section).find("span.constrain:first").data(sampleFilter);
    $(section).find("span.constrain:first").addClass("hasFilters");
    $(section).find("span.constrain:first").addClass("ui-state-active");

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
}

function init_constrain_m(section) {    
    // initialize tool tip for "barcode is required".
    $(section).find("input:checkbox[name='barcode']").each(function (index, obj) {
        if (index == 0) {
            $(obj).qtip({
                position: {
                    my: "bottom center", // Use the corner...
                    at: "top center", // ...and opposite corner
                    adjust: {
                        y: -6
                    }
                },
                show: {
                   event: false, // Don't specify a show event...
                   ready: true // ... but show the tooltip when ready
                },
                hide: false,
                style: {
                    classes: 'ui-tooltip-shadow ui-tooltip-green'
                }                                
            }); 
        }
/*        else {
            $(obj).qtip({
                position: {
                    my: "top left", // Use the corner...
                    at: "bottom right" // ...and opposite corner
                },
                style: {
                    classes: 'ui-tooltip-shadow ui-tooltip-green'
                }                                
            }); 
        }*/
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

function init_style_t(section) {
    init_common(section);
    init_constrain_t(section);
}

function init_constrain_t(section) {
    // initialize tool tip for "barcode is required".
    $(section).find("input:text[name='barcode']").each(function (index, obj) {
        if (index == 0) {
            $(obj).qtip({
                position: {
                    my: "bottom center", // Use the corner...
                    at: "top center" // ...and opposite corner
                },
                show: {
//                   event: false, // Don't specify a show event...
                   ready: true // ... but show the tooltip when ready
                },
                hide: {
                    event: 'click'
                },
                style: {
                    classes: 'ui-tooltip-shadow ui-tooltip-green'
                }                                
            }); 
        }
    });
    $(section).find("span.required").qtip({
        position: {
            my: "top center", // Use the corner...
            at: "bottom center" // ...and opposite corner
        },
        style: {
            classes: 'ui-tooltip-shadow ui-tooltip-green'
        }                                
    }); 
}

function site_root() {
    return /*document.location.host + */'/AptanaJQuery/inventory';
}
