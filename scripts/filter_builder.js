//     filter_builder.js 0.1.0
//     (c) [2012 - current] Weston Sewell, Limin Shen.
//     This plugin is a joined effort between me and Weston.  

(function ($) {

    var DATA_NAMESPACE = 'filterBuilder';

    var methods = {
        init: function (options) {
            return this.each(function () {
                var self = $(this);

                // In the future, either pass these is, or pass in a URL to get them
                options.filter_types = [
                    { safe_name: 'LIKE', text: 'like', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','discreteset'] },
                    { safe_name: 'NOT_LIKE', text: 'not like', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','discreteset'] },
                    { safe_name: 'EQUAL', text: 'equal to', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','number','boolean','discreteset'] },
                    { safe_name: 'NOT_EQUAL', text: 'not equal to', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','number','boolean','discreteset'] },
                    { safe_name: 'LESS_THAN', text: 'less than', parameters: [{ type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'GREATER_THAN', text: 'greater than', parameters: [{ type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'IN', text: 'in', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','number','discreteset'] },
                    { safe_name: 'NOT_IN', text: 'not in', parameters: [{ type: 'value'}], support_types: ['string','text','date','time','datetime','number','discreteset'] },
                    { safe_name: 'BETWEEN', text: 'between', parameters: [{ type: 'value' }, { type: 'label', text: 'and' }, { type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'NOT_BETWEEN', text: 'not between', parameters: [{ type: 'value' }, { type: 'label', text: 'and' }, { type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'GREATER_THAN_OR_EQUAL', text: 'greater than or equal to', parameters: [{ type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'LESS_THAN_OR_EQUAL', text: 'less than or equal to', parameters: [{ type: 'value'}], support_types: ['date','time','datetime','number'] },
                    { safe_name: 'IS_NULL', text: 'null', parameters: [], support_types: ['string','text','date','time','datetime','number','boolean','discreteset'] },
                    { safe_name: 'IS_NOT_NULL', text: 'not null', parameters: [], support_types: ['string','text','date','time','datetime','number','boolean','discreteset'] },
                    { safe_name: 'CURRENT_USER', text: 'current user', parameters: [] },
                    { safe_name: 'CURRENT_GROUP', text: 'current group', parameters: [] },
                    { safe_name: 'LAST_N_HOURS', text: 'last N hours', parameters: [{ type: 'value' }, { type: 'label', text: 'hours'}], support_types: ['date','time','datetime',] }
                ];
                options.ui_input_types = [
                    { data_type: 'string', ui_type: '<input type="text"></input>' },
                    { data_type: 'text', ui_type: '<input type="text"></input>' },
                    { data_type: 'date', ui_type: '<input type="text"></input>' },
                    { data_type: 'time', ui_type: '<input type="text"></input>' },
                    { data_type: 'datetime', ui_type: '<input type="text" ></input>' },
                    { data_type: 'number', ui_type: '<input type="text"></input>' },
                    { data_type: 'boolean', ui_type: '<input type="checkbox"></input>' },
                    { data_type: 'discreteset', ui_type: '<input type="text"></input>' }
                ];
                options.ui_regex = [
                    { format: 'YYYY-MM-DD', indicator: 'YYYY-MM-DD', regex: /^\d{4}-\d{2}-\d{2}$/gi},
                    { format: 'hh:mm:ss.ms', indicator: 'hh:mm:ss.ms', regex: /^\d{2}:\d{2}:\d{2}{\.\d+}*$/gi},
                    { format: 'YYYY-MM-DD hh:mm:ss.ms', indicator: 'YYYY-MM-DD hh:mm:ss.ms', regex: /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}[\.\d+]*/gi},
                    { format: 'double', indicator: '0.00', regex: /^\d+\.\d+$/gi},
                    { format: 'int', indicator: '0', regex: /^\d+$/gi},
                    { format: 'discreteset', indicator: '', regex: /\*/}
                ];
                
                var settings = self.data(DATA_NAMESPACE);

                if (!settings) {
                    settings = {
                        filterables: [],
                        filter_types: []
                    };
                    $.extend(settings, options);

                    if (!settings.filterables) { $.error('filterBuilder: missing required option "filterables"'); }
                    if (!settings.filter_types) { $.error('filterBuilder: missing required option "filter_types"'); }

                    self.data(DATA_NAMESPACE, settings);
                }


                self.html('<span class="filterBuilder"></span>');
                
                if (settings.filter_definition) {
                    build_filter_ui_from_definition(self, settings.filter_definition);
                }
                else if (settings.auto_define_simple_filter) {
                    add_group(self, null, { add_simple_filter: true });
                }
                else {
                    add_initial_placeholder(self);
                }
            });
        },

        get_filter_data: function (options) {
            var definition = build_definition(this);
            return definition;
        },
        
        get_inventory_constrain_attributes: function(options) {
            var definition = build_definition(this);
            return stringfy_filter_attributes(definition);
        },
        
        get_inventory_constrain_data: function(options) {
            var definition = build_definition(this);
            return stringfy(definition);
        },
        
        validate_filters: function () {
            var valid = validate_filters_inputs(this);
            return valid;
        }
    };

    function add_initial_placeholder(self) {
        self.find('span.filterBuilder').html('<div class="initial_filter_placeholder"><div class="no_filters_text">No filters defined</div><button class="create_filter">Create Filter</button><div style="clear:both;"></div></div>');

        self.find('button.create_filter').button().click(function () {
            self.find('.initial_filter_placeholder').remove();
            add_group(self, null, { add_simple_filter: true });
        });
    }

    function add_group(self, to_group, options) {
        if (!options) { options = {}; }
        if (!options.operator_value) { options.operator_value = 'AND'; }

        var group = get_group_html();
        var group_control_row = get_group_control_row_html();
        var filters_row = get_filters_row_html();
        var subgroups_row = get_subgroups_row_html();
        var add_group_items_row = get_add_group_items_row_html();

        group.append(group_control_row);
        group.append(filters_row);
        group.append(subgroups_row);
        group.append(add_group_items_row);

        group.find('.operator select').val(options.operator_value);

        group_control_row.find('.trash_button').tiny_button({ icon: 'ui-icon-minus', tooltip: 'Delete Group' });

        group_control_row.find('.trash_button').click(function () { remove_group(self, group); });
        add_group_items_row.find('.new_filter_clickable').click(function () { add_filter(self, group); });
        add_group_items_row.find('.new_subgroup_clickable').click(function () { add_group(self, group); });

        group.find('li .new_group_item_clickable').hover(
            function () { $(this).addClass('new_group_item_clickable_highlight'); },
            function () { $(this).removeClass('new_group_item_clickable_highlight'); }
        );

        group.hide(); // Hide group so we can animate it's arrival

        if (to_group) {
            to_group.find('.subgroups:first').append(group);
        }
        else {
            // Special case because the toplevel group is added with to_group=undefined and should have no "control buttons"
            // TODO: The special case for the buttons should be that removing the toplevel group goes back to "no filter defined" state.
            group.find('.row_control_buttons').hide();
            self.find('span.filterBuilder').html(group);
        }

        group.show('blind', function () {
            if (options.add_simple_filter) { add_filter(self, group); }
        });

        return group;
    }

    function remove_group(self, group) {
        group.hide('blind');
        group.remove();
    }

    function add_filter(self, group, options) {
        if (!options) { options = {}; }

        var filter = get_filter_html();

        configure_filter_target(self, filter, options);

        filter.find('.trash_button').tiny_button({ icon: 'ui-icon-minus', tooltip: 'Delete Filter' });
        filter.find('.add_filter_button').tiny_button({ icon: 'ui-icon-plus', tooltip: 'Add New Filter' });

        filter.find('.entity_type_and_attribute').click(function () { start_target_selection(self, filter, $(this)); });
        filter.find('td.filter_type select').change(function () { 
            var entity_type_name = filter.find('.entity_type_and_attribute').attr('data-entity_type_name');
            var attribute_name = filter.find('.entity_type_and_attribute').attr('data-attribute_name');
            var attribute_data_type = filter.find('.entity_type_and_attribute').data('data-attribute_data_type');
            configure_filter_parameters(self, filter,  { entity_type_name: entity_type_name, attribute_name: attribute_name, attribute_data_type: attribute_data_type }); 
        });
        filter.find('.trash_button').click(function () { remove_filter(self, filter); });
        filter.find('.add_filter_button').click(function () { add_filter(self, group); });

        $(filter).hover(
            function () { $(this).addClass('highlight'); },
            function () { $(this).removeClass('highlight'); }
        );

        filter.find('.entity_type_and_attribute').hover(
            function () {
                $(this).addClass('entity_type_and_attribute_highlight');
                $(this).find('.arrow').addClass('ui-state-hover');
                $(this).find('.arrow').addClass('arrow_highlight');
            },
            function () {
                $(this).removeClass('entity_type_and_attribute_highlight');
                $(this).find('.arrow').removeClass('ui-state-hover');
                $(this).find('.arrow').removeClass('arrow_highlight');
            }
        );

        filter.hide();
        group.find('li.filters ul.filter_list:first').append(filter);
        filter.show('blind');
    }

    function remove_filter(self, filter) {
        filter.hide('blind');
        filter.remove();
    }

    function configure_filter_target(self, filter, options) {
        if (!options) { options = {} }

        var settings = self.data(DATA_NAMESPACE);

        if (!options.entity_type_name || !options.attribute_name) {
            options.entity_type_name = settings.filterables[0].name;
            options.attribute_name = settings.filterables[0].attribute_defs[0].name;
            options.attribute_data_type = settings.filterables[0].attribute_defs[0].data_type;
        }
        var entity_type = _.find(settings.filterables, function (entity_type) { return entity_type.name == options.entity_type_name; });
        if (entity_type) {
            if (!entity_type.display_name) {entity_type.display_name = entity_type.name;}
            var attribute = _.find(entity_type.attribute_defs, function (attribute) { return attribute.name == options.attribute_name; });
            if (attribute) {
                if (!attribute.display_name) {attribute.display_name = attribute.name;}
                // TODO: Do error checking here with entity_type_name and options.entity_type_name?
                //       We don't want to error out on mismatch... not sure what to do if match fails (same for attribute_name)

                var target = filter.find('.entity_type_and_attribute');

                target.attr('data-entity_type_name', entity_type.name);
                target.attr('data-entity_type_display_name', entity_type.display_name);
                target.attr('data-attribute_name', attribute.name);
                target.attr('data-attribute_display_name', attribute.display_name);
                target.data('data-attribute_data_type', attribute.data_type); // use data because we need to save a hash, not just a single value

                target.find('.attribute').html(attribute.display_name);
                target.find('.entity_type').html(entity_type.display_name);
            }
            else {
                alert('Filter definition contains a target of ' + options.entity_type_name + ':' + options.attribute_name + ' which is not in the available filterable set. Saving may corrupt your data or it may already be corrupted.');
            }
        }
        else {
            alert('Filter definition contains a target of ' + options.entity_type_name + ' which is not in the available filterable set. Saving may corrupt your data or it may already be corrupted.');
        }

        configure_filter_type(self, filter, options);
    }

    function configure_filter_type(self, filter, options) {
        if (!options) { options = {}; }

        var settings = self.data(DATA_NAMESPACE);

        var filter_type_selector = filter.find('td.filter_type select');

        filter_type_selector.html("");
        
        // TODO: we need to add logic of filter certain type of filter_types

        $.each(settings.filter_types, function (index, filter_type) {
            if (_.indexOf(filter_type.support_types, options.attribute_data_type.type) > -1) {
                filter_type_selector.append('<option value="' + filter_type.safe_name + '">' + filter_type.text + '</option>');
            }
        });

        // TODO: Error checking here to see if filter_type is in filter_type_selector?
        //       What would we do on failure?
        if (options.filter_type) {
            filter_type_selector.val(options.filter_type);
        }

        configure_filter_parameters(self, filter, options);
    }

    function configure_filter_parameters(self, filter, options) {
        if (!options) { options = {}; }

        var settings = self.data(DATA_NAMESPACE);

        var parameters = filter.find('td.parameters');
        var filter_type_selector = filter.find('td.filter_type select');

        var filter_type = _.find(settings.filter_types, function (filter_type) { return filter_type.safe_name == filter_type_selector.val(); });

        if (!filter_type) {
            filter_type = settings.filter_types[0];
        }

        parameters.html("");
        // find <input> type from settings
        var ui_input = _.find(settings.ui_input_types, function(uitype) {
            return uitype.data_type == options.attribute_data_type.type;
        });
        // find <input placeholder> from settings
        var ui_validator = _.find(settings.ui_regex, function(uiregex) {
            return uiregex.format == options.attribute_data_type.format;
        });
        
        if (options.attribute_data_type.type == "discreteset") {
            ui_validator.indicator = options.attribute_data_type.allowedvalues.join(", ");
            var values = "(" + options.attribute_data_type.allowedvalues.join("|") + ")";
//            ui_validator.regex = /\b + values + \b/gi;
            ui_validator.regex = new RegExp("\\b("+options.attribute_data_type.allowedvalues.join("|")+")\\b","gi");
        }
        // TODO: Have to use a separate index for the values b/c we call the labels
        // "parameters" too. Maybe a different design here makes sense.
        var value_index = 0;
        $.each(filter_type.parameters, function (index, parameter) {
            switch (parameter.type) {
                case 'value':
                    var input = $(ui_input.ui_type);
                    // add placeholder
                    if (ui_validator) {                       
                        input.attr("placeholder", ui_validator.indicator);
                        input.data("validate-regex", ui_validator.regex);
                    }

                    parameters.append(input);
                    
                    // TODO: Error checking here if filter_values is missing a value (too many or too few)?
                    if (options.filter_values && options.filter_values[value_index]) {
                        if ($(input).is(':checkbox')) {
                            $(input).attr("checked", options.filter_values[value_index]?"checked":"");
                        }
                        else {
                            input.val(options.filter_values[value_index]);
                        }
                        ++value_index;
                    }

                    break;
                case 'label':
                    parameters.append(parameter.text);
                    break;
            }
            parameters.append(' ');
        });
        
        // add label field to display error message
        parameters.append('<br /><label class="error"></label>');
        
        parameters.find("input:text").keyup(function(event) {
           // validate the input only when the user types "Enter"
            if (event.which == 13) {
                validate_input (this);
            }   
            else {
                if ($(this).parent().find('label.error').html() != "") {$(this).parent().find('label.error').html("");}
            }                  
            event.preventDefault();
        });        
    }

    function start_target_selection(self, filter, target_selection_control) {
        var settings = self.data(DATA_NAMESPACE);
        var target_selection_panel = get_target_selection_panel_html();

        target_selection_panel.css('left', target_selection_control.position().left);
        target_selection_panel.css('top', target_selection_control.position().top);

        var entity_type_selector = get_entity_type_selector_html();
        var attribute_selector = get_attribute_selector_html();
        var ok_button = get_ok_button_html();
        var cancel_button = get_cancel_button_html();

        target_selection_panel.append(entity_type_selector);
        target_selection_panel.append(attribute_selector);
        target_selection_panel.append(get_button_group_html());
        target_selection_panel.find('.buttons').append(cancel_button.button());
        target_selection_panel.find('.buttons').append(ok_button.button());

        target_selection_panel.hide();
        self.find('.filters:first').append(target_selection_panel);

        var initial_entity_type_name = target_selection_control.attr('data-entity_type_name');
        var initial_attribute_name = target_selection_control.attr('data-attribute_name');
        var initial_attribute_data_type = target_selection_control.data('data-attribute_data_type');

        $.each(settings.filterables, function (index, filterable) {
            var selected = (filterable.name == initial_entity_type_name) ? 'selected="selected"' : '';
            entity_type_selector.append('<option ' + selected + ' value="' + filterable.name + '">' + filterable.display_name + '</option>');
        });

        load_target_selection_attribute_list(self, target_selection_panel, initial_attribute_name);

        entity_type_selector.change(function () { load_target_selection_attribute_list(self, target_selection_panel); });

        cancel_button.click(function () { target_selection_panel.remove(); });
        ok_button.click(function () {
            var entity_type_name = entity_type_selector.val();
            var attribute_name = attribute_selector.val();
            var attribute_data_type = attribute_selector.find("option:selected").data("data-attribute_data_type");
            target_selection_panel.remove();
            configure_filter_target(self, filter, { entity_type_name: entity_type_name, attribute_name: attribute_name, attribute_data_type: attribute_data_type });
        });

        target_selection_panel.show();
    }

    function load_target_selection_attribute_list(self, target_selection_panel, initial_attribute_name) {
        var settings = self.data(DATA_NAMESPACE);
        var attribute_selector = target_selection_panel.find('select.attribute');
        attribute_selector.html("");

        var filterable = _.find(settings.filterables, function (filterable) { return filterable.name == target_selection_panel.find('select.entity_type').val(); });

        $.each(filterable.attribute_defs, function (index, attribute) {
            var selected = (attribute.name == initial_attribute_name) ? 'selected="selected"' : '';
            var option = $('<option ' + selected + ' value="' + attribute.name + '">' + attribute.display_name + '</option>');
            option.data("data-attribute_data_type", attribute.data_type);
            attribute_selector.append(option);
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    // HTML generators. These methods construct HTML blocks and return them.
    // These blocks have been modified to use templates. The templates can be found
    // in the file Static/Pages/FilterEdit.htm
    ///////////////////////////////////////////////////////////////////////////
    function get_filter_html() {
        return $('<li class="filter"><div class="description"><table><tbody><tr><td>' + get_entity_attribute_div() + '</td>  <td class="filter_type">is&nbsp;&nbsp;&nbsp;<select></select></td>      <td class="parameters"></td>       </tr></tbody></table>   </div>  <div class="row_control_buttons">    <a class="trash_button" title="Delete"></a> <a class="add_filter_button title="Add Filter"></a><div style="clear:both;"></div></div><div style="clear:both;"></div></li>');
    }

    function get_entity_attribute_div() {
        return '<div class="entity_type_and_attribute"><div class="text"><div class="attribute" style="font-size:1.1em; font-weight:bold;"></div><div class="entity_type" style="font-size:0.8em; color:#777;"></div></div><div class="arrow"><span class="ui-icon ui-icon-triangle-1-s"></span></div><div style="clear:both;"></div></div>';
    }

    function get_target_selection_panel_html() {
        return $('<div class="target_selection_panel"></div>');
    }

    function get_button_group_html() {
        return $('<div class="buttons"></div>');
    }

    function get_entity_type_selector_html() {
        return $('<select class="entity_type"></select>');
    }
    
    function get_attribute_selector_html() {
        return $('<select class="attribute"></select>');
    }

    function get_ok_button_html() {
        return $('<button class="ok">Ok</button>');
    }

    function get_cancel_button_html() {
        return $('<button class="cancel">Cancel</button>');
    }

    function get_group_html() {
        return $('<ul class="filter_group"></ul>');
    }

    function get_group_control_row_html() {
        return $('<li class="operator"><select><option value="AND">All</option><option value="OR">Any</option></select> of the following are true<div class="row_control_buttons">           <a class="trash_button" title="Delete"></a>         <div style="clear:both;"></div>          </div><div style="clear:both;"></div></li>');
    }

    function get_filters_row_html() {
        return $('<li class="filters"><ul class="filter_list"></ul></li>');
    }

    function get_subgroups_row_html() {
        return $('<li class="subgroups"></li>');
    }

    function get_add_group_items_row_html() {
        return $('<li class="add_group_items"><table><tr><td><div class="new_group_item_clickable new_filter_clickable"><span class="ui-icon ui-icon-plus" style="float:left;"></span><div class="text">New Filter</div><div style="clear:both;"></div></div></td><td><div class="new_group_item_clickable new_subgroup_clickable"><span class="ui-icon ui-icon-plus" style="float:left;"></span><div class="text">New Subgroup</div><div style="clear:both;"></div></div></td></tr></table></li>');
    }



    //////////////////////////////////////////////////////////////////////////////////////////////
    // Data Conversion Methods
    //////////////////////////////////////////////////////////////////////////////////////////////

    function build_definition(self, group) {

        if (!group) { group = self.find('.filter_group:first'); }
        if (!group) { $.error("No toplevel group found in filter"); }

        var operator = group.find('.operator:first select').val();

        var filters = _.map(group.find('.filter_list:first').find('.filter'), function (filter) {
            var target = {
                entity_type_name: $(filter).find('.entity_type_and_attribute').attr('data-entity_type_name'),
                entity_type_display_name: $(filter).find('.entity_type_and_attribute').attr('data-entity_type_display_name'),
                attribute_name: $(filter).find('.entity_type_and_attribute').attr('data-attribute_name'),
                attribute_display_name: $(filter).find('.entity_type_and_attribute').attr('data-attribute_display_name'),
                attribute_data_type: $(filter).find('.entity_type_and_attribute').data('data-attribute_data_type')
            };

            var type = $(filter).find('.filter_type select').val();
            var values = _.map($(filter).find('.parameters :input'), function (input) { 
                if ($(input).is(':checkbox')) {
                    return $(input).attr("checked") == "checked";
                }
                return $(input).val(); 
            });

            return { target: target, type: type, values: values };
        });

        var subgroups = _.map(group.find('.subgroups:first > .filter_group'), function (subgroup) {
            return build_definition(self, $(subgroup));
        });

        // TODO: Need 'FilterCombination' here?
        return { group_operator: operator, filters: filters, subgroups: subgroups };
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // TODO: Custom Data Conversion Methods (these should be moved _OUT_ of the plugin)
    //////////////////////////////////////////////////////////////////////////////////////////////

    function build_filter_ui_from_definition(self, group_definition, to_group) {
        if (group_definition) {
            var group = add_group(self, to_group, { operator_value: group_definition.group_operator });
            $.each(group_definition.filters, function (index, filter) {
                // TODO: INCOMPLETE, needs to be done.
                add_filter(self, group, {
                    attribute_name: filter.target.attribute_name,
                    attribute_display_name: filter.target.attribute_display_name,
                    attribute_data_type: filter.target.attribute_data_type,
                    entity_type_name: filter.target.entity_type_name,
                    entity_type_display_name: filter.target.entity_type_display_name,
                    filter_type: filter.type,
                    filter_values: filter.values
                });
            });
            if (group_definition.subgroups) {
                // TODO: need to call this function recursively for every subgroup.
                $.each(group_definition.subgroups, function (index, subgroup) {
                    build_filter_ui_from_definition(self, subgroup, group);
                });
            }
        }
        else {
            // This is the case where a new filter is being created.
            var group = add_group(self, to_group, { operator_value: 'AND' });
            add_filter(self, group);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Stringfy methods <-- for inventory
    //////////////////////////////////////////////////////////////////////////////////////////////
    function stringfy_filter_attributes(group_definition) {
        var output = "{";
        if (group_definition.filters.length > 0) {
            var filterString = "";
            for(var ifilter = 0; ifilter < group_definition.filters.length; ifilter ++ ) {
                filterString += group_definition.filters[ifilter].target.attribute_name + ";";
            }
            output += filterString;
        }
        
        if (group_definition.subgroups.length > 0) {
            var groupString = "";
            for(var igroup = 0; igroup < group_definition.subgroups.length; igroup ++ ) {
                groupString += stringfy_filter_attributes(group_definition.subgroups[igroup]);
            }
            output += groupString;
        }
        return output += "}";
    }

    function stringfy(group_definition) {
        var output = "";
        if (group_definition.filters.length > 0) {
            var filterString = "";
            for(var ifilter = 0; ifilter < group_definition.filters.length; ifilter ++ ) {
                filterString += "(" + stringfy_filter(group_definition.filters[ifilter]) + ")";
                if (ifilter < group_definition.filters.length -1) {
                    filterString += " " + group_definition.group_operator + " ";
                }              
            }
            output += filterString;
        }
        else {
            output = "(TRUE)";            
        }
        
        if (group_definition.subgroups.length > 0) {
            var groupString = "{";
            for(var igroup = 0; igroup < group_definition.subgroups.length; igroup ++ ) {
                groupString += stringfy(group_definition.subgroups[igroup]);
            }

            groupString += "}";
            output += " " + group_definition.group_operator + " " + groupString;
        }
        return output;
    }

    function stringfy_filter(filter){
        var filterString = filter.target.attribute_name + " " + filter.type + " " + JSON.stringify(filter.values);  
        return filterString;
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Validate all INPUT fields against format regex
    //////////////////////////////////////////////////////////////////////////////////////////////
    function validate_filters_inputs (self) {
        var succeed = true;
        self.find('td.parameters :input').each(function(index, value) {
            succeed = succeed && validate_input(this);
            if (!succeed) { return succeed; }
        });
        return succeed;
    }
    
    function validate_input (input) {
        var filter_type = $(input).parent('td.parameters').prev('td.filter_type').find('select').val();
        if (filter_type == "IN" || filter_type == "NOT_IN" ) {
            return true;
        }
        var input_value = $(input).val();
        var input_indicator = $(input).attr("placeholder");
        var input_regex = $(input).data("validate-regex"); //we want regex object, thus using data instead of attribute.
        
        if (!input_regex) {return true;}
        var match_result = input_value.match(input_regex);
        if (!match_result || match_result.length > 1) {
            $(input).parent().find('label.error').html("[" + input_value + "] doesn't match require format:[" + input_indicator + "].");
            return false;
        }
        return true;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Plugin main()
    //////////////////////////////////////////////////////////////////////////////////////////////

    $.fn.filter_builder = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.filterBuilder');
        }
    };
})(jQuery);
