// create OnTheSide namespace
   /*------------------------------- Models -------------------------------*/

// entity_type model
OnTheSide.EntityType = OnTheSide.BaseModel.extend({
    // Default entity type attributes
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "EntityTypes",
        entity_type_id : null,
        entity_type_name : null
    }),
    initialize : function(args) { 
        defaults: _.extend({}, this.defaults, args);
        this.attribute_defs = new OnTheSide.AttributeCollection;
        this.related_entity_types = new OnTheSide.EntityTypeCollection;
    },
    // compose URL.  Sample: /DataViews/id/Description/
    name : function() {
        return this.get("entity_type_name");
    }
});

// filter combination
OnTheSide.OntologyFilterCombination = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "OntologyFilterCombination",
        group_operator : "AND",
        filters : null, // instance of OnTheSide.Filter
        subgroups : null
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
    /*        set : function(attrs, options) {
     Backbone.Model.prototype.set.call(this, attrs, options);
     alert ("set FilterCombination");
     return this;
     }*/
});

// filter model
OnTheSide.OntologyFilter = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "OntologyFilter",
        target : null,
        type : "EQUAL",
        values : null,
        enabled : true,
        is_not_in_check_dynamic_attribute_filter : false,
        is_dynamic_filter : false
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    },
    parse : function(response, xhr) {
        console.log("parse OntologyFilter");
        return response;
    }
});

// pivot hierarchy
OnTheSide.PivotHierarchy = OnTheSide.BaseModel.extend({
    // Default entity type attributes
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "ChildHierarchy",
        child_entity_type : null,
        children : null,
        filter_defs : new OnTheSide.OntologyFilterCombination
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    },
    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    /*        set : function(attrs, options) {
     Backbone.Model.prototype.set.call(this, attrs, options);
     alert("Hierarchy Set");
     return this;
     },*/

    getUrl : function() {
        var fetchUrl = "PivotType=" + encodeURIComponent(this.get("child_entity_type").entity_type_id);
        var allEntityTypes = this.getAllChildrenEntityTypes();

        if(allEntityTypes.length > 0) {
            var params = [];
            for(var iType = 0; iType < allEntityTypes.length; iType++) {
                var param = "ChildType" + iType + "=" + encodeURIComponent(allEntityTypes[iType].entity_type_id);
                params.push(param);
            }
            fetchUrl = fetchUrl + "&" + params.join("&");
        }
        return fetchUrl;
    },
    /*        getAllChildrenEntityTypeIds: function() {
     var allEntityTypes = this.getAllChildrenEntityTypes();
     var allIds = [];
     for (var iType = 0; iType < allEntityTypes.length; iType ++) {
     allIds.push(allEntityTypes[iType].EntityTypeId);
     }
     return allIds;
     },*/
    getAllChildrenEntityTypes : function() {
        var currentChild = this.get("children");
        var allEntityTypes = this.getChildrenEntityTypes(currentChild);
        return allEntityTypes;
    },
    getChildrenEntityTypes : function(hierarchy) {
        var types = [];
        if(hierarchy != undefined && hierarchy != null && hierarchy.length > 0) {
            for(var iChild = 0; iChild < hierarchy.length; iChild++) {
                var child = hierarchy[iChild];
                types.push(child.child_entity_type);
                var childrenTypes = this.getChildrenEntityTypes(child.children);
                types = types.concat(childrenTypes);
            }
        }
        return types;
    },
    addChildEntityType : function(entityType, parentId) {
        console.log("Add [" + entityType.entity_type_name + "] -> PivotHierarchy. (Parent ID = '" + parentId + "')");

        var filterCombo = new OnTheSide.FilterCombination;
        var toAdd = {
            child_entity_type : entityType,
            children : null,
            filter_defs : filterCombo
        };

        var result = this.addChildEntityTypeToHierarchy(this.attributes, parentId, toAdd);
    },
    removeChildEntityType : function(entityType) {
        console.log("Remove [" + entityType.entity_type_name + "] <- PivotHierarchy.");

        var pivotEntityType = this.get("child_entity_type");
        if(pivotEntityType == null || pivotEntityType == undefined) {
            alert("No Pivot Type is defined!  You can't remove Entity Type with ID = '" + entityType.entity_type_id + "'.");
        } else if(pivotEntityType.entity_type_id == entityType.entity_type_id) {
            this.set({
                children : null
            });
        } else {
            var result = this.removeChildEntityTypeFromHierarchy(this.get("children"), entityType);
        }
    },
    addChildEntityTypeToHierarchy : function(hierarchy, lookupId, toAdd) {
        var done = false;
        var curEntityType = hierarchy.child_entity_type;
        if(curEntityType == undefined) {
            return done;
        }
        var curChildren = hierarchy.children;
        if(curEntityType.entity_type_id == lookupId) {
            if(curChildren == undefined || curChildren == null) {
                hierarchy.children = [];
            }
            var existed = false;
            for(var j = 0; j < hierarchy.children.length; j++) {
                if(hierarchy.children[j].child_entity_type.entity_type_id == toAdd.child_entity_type.entity_type_id) {
                    existed = true;
                }
            }

            if(!existed) {
                hierarchy.children.push(toAdd);
            }
            done = true;
            return done;
        } else {
            if(curChildren == null || curChildren.length == 0) {
                return done;
            } else {
                for(var i = 0; i < curChildren.length; i++) {
                    if(this.addChildEntityTypeToHierarchy(curChildren[i], lookupId, toAdd)) {
                        done = true;
                        return done;
                    };
                }
                return done;

            }
        }
    },
    removeChildEntityTypeFromHierarchy : function(curChildren, toRemove) {
        var done = false;
        if(curChildren == undefined || curChildren == null) {
            return done;
        }

        var found = -1;
        for(var i = 0; i < curChildren.length; i++) {
            var child = curChildren[i];
            if(child == undefined || child == null) {
                continue;
            }

            var curEntityType = child.child_entity_type;
            if(curEntityType.entity_type_id == toRemove.entity_type_id) {
                found = i;
                break;
            }
        }

        if(found != -1) {
            curChildren.splice(found, 1);
            if(curChildren.length == 0) {
                curChildren = null;
            }
            done = true;
            return done;
        } else {
            for(var i = 0; i < curChildren.length; i++) {
                if(this.removeChildEntityTypeFromHierarchy(curChildren[i].children, toRemove)) {
                    done = true;
                    return done;
                }
            }
            return done;
        }
    },
    updateFilterCombination : function(toFind, filterCombo) {
        console.log("Update [" + toFind.get("entity_type_name") + "] in PivotHierarchy.");
        var pivotEntityType = this.get("child_entity_type");
        if(pivotEntityType == null || pivotEntityType == undefined) {
            alert("No Pivot Type is defined!");
        } else if(pivotEntityType.entity_type_id == toFind.get("entity_type_id") && pivotEntityType.entity_type_name == toFind.get("entity_type_name")) {
            return this.set({
                filter_defs : filterCombo
            }, {
                silent : true
            });
        } else {
            var result = this.updateFilterCombinationInHierarchy(this.get("children"), toFind, filterCombo);
        }
    },
    updateFilterCombinationInHierarchy : function(curChildren, toFind, filterCombo) {
        var done = false;
        if(curChildren == undefined || curChildren == null) {
            return done;
        }

        var found = -1;
        for(var i = 0; i < curChildren.length; i++) {
            var child = curChildren[i];
            if(child == undefined || child == null) {
                continue;
            }

            var curEntityType = child.child_entity_type;
            if(curEntityType.entity_type_id == toFind.get("entity_type_id") && curEntityType.entity_type_name == toFind.get("entity_type_name")) {
                found = i;
                break;
            }
        }

        if(found != -1) {
            curChildren[found].filter_defs = filterCombo;
            done = true;
            return done;
        } else {
            for(var i = 0; i < curChildren.length; i++) {
                if(this.updateFilterCombinationInHierarchy(curChildren[i].children, toFind, filterCombo)) {
                    done = true;
                    return done;
                }
            }
            return done;
        }
    },
    getFilterCombination : function(toFind) {
        console.log("Lookup [" + toFind.get("entity_type_name") + "] in PivotHierarchy.");
        var pivotEntityType = this.get("child_entity_type");
        if(pivotEntityType == null || pivotEntityType == undefined) {
            alert("No Pivot Type is defined!");
        } else if(pivotEntityType.entity_type_id == toFind.get("entity_type_id") && pivotEntityType.entity_type_name == toFind.get("entity_type_name")) {
            return this.get("filter_defs");
        } else {
            return this.getFilterCombinationInHierarchy(this.get("children"), toFind);
        }
    },
    getFilterCombinationInHierarchy : function(curChildren, toFind) {
        if(curChildren == undefined || curChildren == null) {
            return null;
        }

        var found = -1;
        for(var i = 0; i < curChildren.length; i++) {
            var child = curChildren[i];
            if(child == undefined || child == null) {
                continue;
            }

            var curEntityType = child.child_entity_type;
            if(curEntityType.entity_type_id == toFind.get("entity_type_id") && curEntityType.entity_type_name == toFind.get("entity_type_name")) {
                found = i;
                break;
            }
        }

        if(found != -1) {
            return curChildren[found].filter_defs;
        } else {
            for(var i = 0; i < curChildren.length; i++) {
                var result = this.getFilterCombinationInHierarchy(curChildren[i].children, toFind);
                if(result != null) {
                    return result;
                }
            }
            return null;
        }
    }
});

// attribute model
OnTheSide.Attribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "Attributes",
        entity_type_id : null,
        entity_type_name : null,
        entity_type_display_name : null,
        attribute_id : null,
        attribute_name : null,
        attribute_display_name : null
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
});

// group_by_attribute model
OnTheSide.GroupByAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "GroupByAttributes",
        attribute : null,
        enable_percentage_on_aggregate : false
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
});

// display_attribute model
OnTheSide.DisplayAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "DisplayAttributes",
        attribute : null,
        fully_qualified_display_columnName : "",
        display_name : "",
        display_index : -1,
        visible : true,
        width : 0
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
});

// sort_attribute model
OnTheSide.SortAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "SortAttributes",
        attribute : null,
        sort_direction : "Ascending"
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
});

// aggregate_attribute model
OnTheSide.AggregateAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "SortAttributes",
        attribute : null,
        aggregate_function : null,
        apply_sort : false,
        sort_direction : "Ascending"
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    }
});

 // data_view model
OnTheSide.DataView = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "DataViews"
    }),

    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
        this.pivot_entity_type = new OnTheSide.EntityType;
        this.pivot_hierarchy = new OnTheSide.PivotHierarchy;
        this.groupby_attributes = new OnTheSide.AttributeCollection;
        this.aggregate_attributes = new OnTheSide.AttributeCollection;
        this.display_attributes = new OnTheSide.AttributeCollection;
        this.sort_attributes = new OnTheSide.AttributeCollection;

        this.groupby_attributes.url = "/" + this.get("resource_type") + "/AvailableGroupByAttributes";
        this.aggregate_attributes.url = "/" + this.get("resource_type") + "/AvailableAggregateAttributes";
        this.display_attributes.url = "/" + this.get("resource_type") + "/AvailableDisplayAttributes";
        this.sort_attributes.url = "/" + this.get("resource_type") + "/AvailableSortAttributes";
    },
    parse : function(response, xhr, options) {
        // manually convert "True"/"False"(string) to true/false(boolean)
        response.render_grouping_icons = response.render_grouping_icons.toLowerCase() == "true";
        response.auto_size = response.auto_size.toLowerCase() == "true";
        this.pivot_entity_type.set(response.pivot_entity_type, options);
        this.pivot_hierarchy.set(response.pivot_hierarchy, options);
        this.groupby_attributes.reset(response.groupby_attributes, options);
        this.aggregate_attributes.reset(response.aggregate_attributes, options);
        this.display_attributes.reset(response.display_attributes, options);
        this.sort_attributes.reset(response.sort_attributes, options);
        return response;
    },
    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
        options || ( options = {});
        if(attrs && !this.set(attrs, options))
            return false;
        var model = this;
        var success = options.success;
        options.success = function(resp, status, xhr) {
            if(!model.set(model.parse(resp, xhr, options), options))
                return false;
            if(success)
                success(model, resp, xhr);
        };
        options.error = OnTheSide.wrapError(options.error, model, options);
        var method = this.isNew() ? 'create' : 'update';
        return (this.sync || Backbone.sync).call(this, method, this, options);
    },
    updateAttributes : function() {
        console.log("update DataView Model attributes.")

        this.set({
            pivot_hierarchy : this.pivot_hierarchy.toJSON(),
            groupby_attributes : this.groupby_attributes.toJSON(),
            aggregate_attributes : this.aggregate_attributes.toJSON(),
            display_attributes : this.display_attributes.toJSON(),
            sort_attributes : this.sort_attributes.toJSON()
        });
    },
    getCollectionFetchUrl : function(collection) {
        return this.composeFetchUrl(collection.url);
    },
    getFilterAttributesFetchUrl : function(filterType) {
        var fetchUrl = this.composeFetchUrl("/DataViews/AvailableFilterAttributes");
        fetchUrl = fetchUrl + "&FilterType=" + encodeURIComponent(filterType.get("entity_type_id"));
        return fetchUrl;
    },
    composeFetchUrl : function(prefixUrl) {
        var pivotMode = this.get("pivot_mode");
        var pivotHierarchyUrl = this.pivot_hierarchy.getUrl();
        var fetchUrl = prefixUrl + "?PivotMode=" + encodeURIComponent(pivotMode) + "&" + pivotHierarchyUrl;
        return fetchUrl;
    }
});


/*------------------------------- Collection -------------------------------*/
OnTheSide.EntityTypeCollection = Backbone.Collection.extend({
    model : OnTheSide.EntityType
});

OnTheSide.AttributeCollection = Backbone.Collection.extend({
    initialize : function(args) {
    },
    moveItem : function(item, newIndex) {
        this.remove(item);
        this.add(item, {
            at : newIndex
        });
        return this;
    },
    removeItem : function(item) {
        this.remove(item);
        return this;
    },
    mergeCollection : function(newCollection) {
        console.log("merge 2 collections.");
        var toDelete = [];
        for(var i = 0; i < this.models.length; i++) {
            var item = this.models[i];
            var foundItem = _.find(newCollection, function(obj) {
                var found = false;
                if(obj.get("attribute") == undefined || obj.get("attribute") == null || item.get("attribute") == undefined || item.get("attribute") == null) {
                    return found;
                }
                return obj.get("attribute").attribute_id == item.get("attribute").attribute_id;
            });
            if(foundItem == undefined) {
                toDelete.push(item);
            } else {//found
                this.models[i] = foundItem;
                var index = -1;
                for(var j = 0; j < newCollection.length; j++) {
                    if(newCollection[j].get("attribute").attribute_id == foundItem.get("attribute").attribute_id) {
                        index = j;
                        break;
                    }
                }
                if(index > -1) {
                    newCollection.splice(index, 1);
                }
            }
        }
        // delete unselected ones;
        for(var i = 0; i < toDelete.length; i++) {
            this.removeItem(toDelete[i]);
        }

        $.merge(this.models, newCollection);
        return this.models;
    }
});

OnTheSide.OntologyFilterCollection = Backbone.Collection.extend({
    model : OnTheSide.OntologyFilter
});

OnTheSide.PivotHierarchyCollection = Backbone.Collection.extend({
    model : OnTheSide.PivotHierarchy
});
/*------------------------------- View Model -------------------------------*/
// each view associate with a template
// let's try put all the view sub components together for now
OnTheSide.BaseView = Backbone.View.extend({

    initialize : function(args) {
        this.model_template = args.model_template;
        this.template = _.template(this.model_template);
        this.partial_templates = args.partial_templates;
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    getRenderHtml : function(renderModel, renderSource) {
        var source = (renderSource == undefined || renderSource == null) ? this.template() : renderSource;
        var compiler = Handlebars.compile(source);
        if(this.partial_templates) {
            var i = 0;
            for( i = 0; i < this.partial_templates.length; i++) {
                Handlebars.registerPartial(this.partial_templates[i].name, this.partial_templates[i].html);
            }
        }
        var handlerBarHtml = compiler(renderModel.toJSON());
        return handlerBarHtml;
    }
});

// Layout display the DataView Specification
OnTheSide.DataViewLayout = OnTheSide.BaseView.extend({

    initialize : function(args) {
        this.constructor.__super__.initialize.apply(this, [args]);
        if(this.model_template == undefined || this.model_template == null) {
            $.error('DataViewLayout must have a Mustache Template.');
        }

        this.pivot_hierarchy_layout = args.pivot_hierarchy_layout;
        this.aggregate_attributes_layout = args.aggregate_attributes_layout;
        this.groupby_attributes_layout = args.groupby_attributes_layout;
        this.display_attributes_layout = args.display_attributes_layout;
        this.sort_attributes_layout = args.sort_attributes_layout;

        this.model.bind('change', this.render, this);

        //            this.model.fetch();
    },
    events : {
        "change .pivot_entity_type" : "changeEntityType",
        "click span.groupby_attributes" : "changeGroupByAttributes",
        "click span.aggregate_attributes" : "changeAggregateAttributes",
        "click span.display_attributes" : "changeDisplayAttributes",
        "click span.sort_attributes" : "changeSortAttributes",
        "click span.filter" : "editFilter",
        "change input:checkbox.view_input" : "changeRenderGroupingIcon",
        "change input:radio.view_input" : "changePivotMode",
        "change input:text.view_input" : "changeViewName",
        "change textarea.view_input" : "changeViewDescription",
        "click button.force_reload" : "forceReload"
    },
    render : function(model) {
        // compile and render the "basic info" section
        var args = [model];
        var source = this.model_template;
        args.push(source);
        var renderHtml = this.constructor.__super__.getRenderHtml.apply(this, args);

        this.$el.find("div.base_info").html(renderHtml);

        var anchor = this.$el.find("div.base_info").find("div.view_description");
        var toggleContent = anchor.siblings('div.view_description_details');

//        anchor.togglify(toggleContent, true);

        // render grouping icon
        var renderIcon = this.model.get("render_grouping_icons");
        if(renderIcon) {
            this.$el.find("input:checkbox.view_input").attr("checked", renderIcon);
        }
        // set "PivotMode" value
        var pivotMode = this.model.get("pivot_mode");
        this.$el.find("input:radio.view_input").filter("[value=" + pivotMode + "]").attr("checked", true);
        return this;
    },    
    raiseError : function(model, response, options) {
        alert("An Error has occured.\n\nDetails:[" + response.responseText + "].");
    },    
    saveDataView : function() {
        show_busy_indicator(this.$el.parent());
        // update model with collection values
        this.model.updateAttributes();

        this.model.save(null, {
            silent : true,
            success : function(model, response) {
                hide_busy_indicator();
                console.log("View with ID = [" + model.get("id") + "] has been saved successfully");
                window.location.href = document.URL.replace("Edit/", "");
            },
            error : function(model, response) {
                hide_busy_indicator();
                alert("An Error has occured while saving the View Definition.\n\nDetails:[" + response.responseText + "].");
            }
        });
    },
    cancelEditing : function() {
        // /DataViews/Edit/{view_id}
        this.remove();
        window.location.href = document.URL.replace("Edit/", "");
    },
    changeEntityType : function(event) {
        var selectedOption = $(event.target).find("option:selected");
        var newValue = {
            entity_type_id : $(selectedOption).attr("data-entyid"),
            entity_type_name : $(selectedOption).attr("data-entyname")
        };
        console.log("Change entity Type -> [" + newValue.entity_type_name + "]");

        this.model.set({
            pivot_entity_type : newValue,
            pivot_hierarchy : {
                child_entity_type : newValue,
                children : null,
                filter_defs : new OnTheSide.FilterCombination
            },
            groupby_attributes : [],
            aggregate_attributes : [],
            display_attributes : [],
            sort_attributes : []
        });
        this.model.pivot_entity_type.set(newValue);
        this.model.pivot_hierarchy.set({
            child_entity_type : newValue,
            children : null,
            filter_defs : new OnTheSide.FilterCombination
        }, {
            silent : true
        });
        // turn off the "render" trigger

        this.pivot_hierarchy_layout.populateRelatedEntityTypes();
        // manually invoke "populateRelatedEntityTypes()"

        this.model.groupby_attributes.reset();
        this.model.aggregate_attributes.reset();
        this.model.display_attributes.reset();
        this.model.sort_attributes.reset();
        event.preventDefault();
        return false;
    },
    changeGroupByAttributes : function(event) {
        var fetchUrl = this.model.getCollectionFetchUrl(this.model.groupby_attributes);
        var dialog_element = this.createDialog(this.model.groupby_attributes, function(refCollection, attributeCollection) {
            for(var i = 0; i < attributeCollection.length; i++) {
                var attrModel = new OnTheSide.GroupByAttribute({
                    attribute : attributeCollection[i]
                });
                attributeCollection[i] = attrModel;
            }
            var newCollection = refCollection.mergeCollection(attributeCollection);
            refCollection.reset(newCollection);
        });
        var allAvailableAttributes = new OnTheSide.EntityTypeCollection;
        var allAvailableAttrLayout = new OnTheSide.EntityTypeAttrsLayout({
            model : OnTheSide.EntityType,
            collection : allAvailableAttributes,
            tagName : "ul",
            el : dialog_element,
            model_template : $("#entitytype-attribute-template").html(),
            ref_collection : this.model.groupby_attributes,
        });

        allAvailableAttributes.fetch({
            url : fetchUrl,
            success : function(jsonObj) {
                dialog_element.dialog("open");
            },
            error : function(collection, response) {
                alert("An Error has occured while requesting All Available GroupBy Attributes.\n\nDetails:[" + response.responseText + "].");
            }
        });

        event.preventDefault();
        return false;
    },
    changeDisplayAttributes : function(event) {
        var fetchUrl = this.model.getCollectionFetchUrl(this.model.display_attributes);
        var dialog_element = this.createDialog(this.model.display_attributes, function(refCollection, attributeCollection) {
            for(var i = 0; i < attributeCollection.length; i++) {
                var attrModel = new OnTheSide.DisplayAttribute({
                    attribute : attributeCollection[i]
                });
                attributeCollection[i] = attrModel;
            }
            var newCollection = refCollection.mergeCollection(attributeCollection);
            for(var i = 0; i < newCollection.length; i++) {
                var attr = newCollection[i].get("attribute");
                newCollection[i].set({
                    fully_qualified_display_columnName : attr.entity_type_name + "." + attr.attribute_name,
                    display_name : attr.attribute_name,
                    display_index : i
                });
            }
            refCollection.reset(newCollection);
        });
        var allAvailableAttributes = new OnTheSide.EntityTypeCollection;
        var allAvailableAttrLayout = new OnTheSide.EntityTypeAttrsLayout({
            model : OnTheSide.EntityType,
            collection : allAvailableAttributes,
            tagName : "ul",
            el : dialog_element,
            model_template : $("#entitytype-attribute-template").html(),
            ref_collection : this.model.display_attributes,
        });

        allAvailableAttributes.fetch({
            url : fetchUrl,
            success : function(jsonObj) {
                dialog_element.dialog("open");
            },
            error : function(collection, response) {
                alert("An Error has occured while requesting All Available Display Attributes.\n\nDetails:[" + response.responseText + "].");
            }
        });

        event.preventDefault();
        return false;
    },
    changeAggregateAttributes : function(event) {
        var fetchUrl = this.model.getCollectionFetchUrl(this.model.aggregate_attributes);
        var dialog_element = this.createDialog(this.model.aggregate_attributes, function(refCollection, attributeCollection) {
            for(var i = 0; i < attributeCollection.length; i++) {
                var attrModel = new OnTheSide.AggregateAttribute({
                    attribute : attributeCollection[i],
                    aggregate_function : "COUNT"
                });
                attributeCollection[i] = attrModel;
            }
            var newCollection = refCollection.mergeCollection(attributeCollection);
            refCollection.reset(newCollection);
        });
        var allAvailableAttributes = new OnTheSide.EntityTypeCollection;
        var allAvailableAttrLayout = new OnTheSide.EntityTypeAttrsLayout({
            model : OnTheSide.EntityType,
            collection : allAvailableAttributes,
            tagName : "ul",
            el : dialog_element,
            model_template : $("#entitytype-attribute-template").html(),
            ref_collection : this.model.aggregate_attributes,
        });

        allAvailableAttributes.fetch({
            url : fetchUrl,
            success : function(jsonObj) {
                dialog_element.dialog("open");
            },
            error : function(collection, response) {
                alert("An Error has occured while requesting All Available Aggregate Attributes.\n\nDetails:[" + response.responseText + "].");
            }
        });

        event.preventDefault();
        return false;
    },
    changeSortAttributes : function(event) {
        var fetchUrl = this.model.getCollectionFetchUrl(this.model.sort_attributes);
        var dialog_element = this.createDialog(this.model.sort_attributes, function(refCollection, attributeCollection) {
            for(var i = 0; i < attributeCollection.length; i++) {
                var attrModel = new OnTheSide.SortAttribute({
                    attribute : attributeCollection[i]
                });
                attributeCollection[i] = attrModel;
            }
            var newCollection = refCollection.mergeCollection(attributeCollection);
            refCollection.reset(newCollection);
        });
        var allAvailableAttributes = new OnTheSide.EntityTypeCollection;
        var allAvailableAttrLayout = new OnTheSide.EntityTypeAttrsLayout({
            model : OnTheSide.EntityType,
            collection : allAvailableAttributes,
            tagName : "ul",
            el : dialog_element,
            model_template : $("#entitytype-attribute-template").html(),
            ref_collection : this.model.sort_attributes,
        });

        allAvailableAttributes.fetch({
            url : fetchUrl,
            success : function(jsonObj) {
                dialog_element.dialog("open");
            },
            error : function(collection, response) {
                alert("An Error has occured while requesting All Available Sort Attributes.\n\nDetails:[" + response.responseText + "].");
            }
        });

        event.preventDefault();
        return false;
    },
    createDialog : function(refCollection, updateCallback) {
        var dialog_element = $('<div class="enty_attrs_dialog"><ul class="enty_attrs"></ul></div>');
        this.$el.append(dialog_element);
        dialog_element.dialog({
            resizable : false,
            modal : true,
            width : 800,
            height : 500,
            resizable : true,
            draggable : true,
            autoOpen : false,
            close : function() {
                dialog_element.remove();
            },
            buttons : {
                "OK" : function() {
                    var selectedCollection = [];
                    $(this).find("input:checked").each(function(event) {
                        var entyName = $(this).attr('data-entyname');
                        var entyId = $(this).attr('data-entyid');
                        var attrName = $(this).attr('data-attrname');
                        var attrId = $(this).attr('data-attrid');
                        var attr = {
                            entity_type_name : entyName,
                            entity_type_id : entyId,
                            attribute_name : attrName,
                            attribute_id : attrId
                        };
                        selectedCollection.push(attr);
                    });
                    updateCallback.call(this, refCollection, selectedCollection);

                    $(this).dialog("close");
                },
                "Cancel" : function() {
                    $(this).dialog("close");
                }
            }
        });
        return dialog_element;
    },
    changeRenderGroupingIcon : function(event) {
        var newValue = event.target.checked;
        this.model.set({
            render_grouping_icons : newValue
        });
        console.log("change [render_grouping_icons] -> " + newValue);
        event.preventDefault();
        return false;
    },
    changePivotMode : function(event) {
        var newValue = $(event.target).val();
        this.model.set({
            pivot_mode : newValue
        });
        console.log("change [pivot_mode] -> " + newValue);
        event.preventDefault();
        return false;
    },
    changeViewName : function(event) {
        var newValue = $(event.target).val();
        this.model.set({
            name : newValue
        });
        console.log("change [name] -> " + newValue);
        event.preventDefault();
        return false;
    },
    changeViewDescription : function(event) {
        var newValue = $(event.target).val();
        this.model.set({
            description : newValue
        });
        console.log("change [description] -> " + newValue);
        event.preventDefault();
        return false;
    },
    forceReload : function() {
        show_busy_indicator(this.$el.parent());
        this.model.fetch({
            url : this.model.getUrl() + "?Condition=ClearCache",
            success : function(model, response) {
                hide_busy_indicator();
                console.log("Server cache has been cleared successfully.  The View Description is up-to-date. ");
            },
            error : function(model, response) {
                hide_busy_indicator();
                alert("An Error has occured while clearing the server cache.  The View Description is out-of-date.");
            }
        });
    },
    editFilter : function(event) {
        var $this = this;
        var control = $(event.target).parents("span.allowFilters:first").prev();
        if(!control) {
            this.raiseError("No Entity Type is associated with this filter.");
            return;
        }

        if(control.prop("type") != "checkbox") {
            control = $(event.target).parents("div.pivot_type_filter").find("option:selected");
        }

        var filterType = new OnTheSide.EntityType({
            id : $(control).attr("data-entyid"),
            entity_type_id : $(control).attr("data-entyid"),
            entity_type_name : $(control).attr("data-entyname")
        });
        var curHierarchy = this.model.pivot_hierarchy;
        var curFilterCombo = curHierarchy.getFilterCombination(filterType);
        var fetchUrl = this.model.getFilterAttributesFetchUrl(filterType);
        fetchUrl = "data/FilterAttrs.json"

        var allAvailableAttributes = new OnTheSide.EntityTypeCollection;
        allAvailableAttributes.fetch({
            url : fetchUrl,
            success : function(available_attributes) {
        
                var dialog_content = $('<div></div>');
                $('body').append(dialog_content);

                dialog_content.filter_builder({
                    filterables : available_attributes.toJSON(),
                    view_def_filter : curFilterCombo
                });

                dialog_content.dialog({
                    width : 900,
                    height : 650,
                    modal : true,
                    buttons : {
                        'Ok' : function() {
                            var filterCombo = $(dialog_content).filterBuilder('get_filter_data');
                            curHierarchy.updateFilterCombination(filterType, filterCombo);
                            if(control.prop("type") == "checkbox") {
                                $this.pivot_hierarchy_layout.renderFilters($(control).parents("li:first"));
                            } else {
                                $this.pivot_hierarchy_layout.renderFilters($(control).parents("div.pivot_type_filter"));
                            }

                            $(this).dialog('close');
                        },
                        'Cancel' : function() {
                            $(this).dialog('close');
                        }
                    },
                    close : function() {
                        dialog_content.remove();
                    }
                });
            },
            error : function(collection, response) {
                alert("An Error has occured while requesting All Available Filter Attributes.\n\nDetails:[" + response.responseText + "].");
            }
        });

        event.preventDefault();
        return false;
    }
});
// Attribute Layout used by GroupBy, Aggregate, Display, Sort
OnTheSide.AttrLayout = OnTheSide.BaseView.extend({

    initialize : function(args) {
        this.constructor.__super__.initialize.apply(this, [args]);
        if(this.model_template == undefined || this.model_template == null) {
            $.error('AttrLayout must have a Mustache Template.');
        }

        this.collection.bind('reset', this.renderAllAttributes, this);
    },
    events : {
        "sortupdate" : "sortUpdate",
        "click span.ui-icon-close" : "removeAttribute",
        "click span.ui-icon-pencil" : "editAggregate",
        "click span.ui-icon-arrowthick-1-n" : "changeSortDirection",
        "click span.ui-icon-arrowthick-1-s" : "changeSortDirection"
    },

    renderAllAttributes : function() {
        this.$el.html("");
        this.collection.each(this.renderOneAttribute, this);
        this.$el.sortable();
        // make the <ul> sortable
    },
    renderOneAttribute : function(item) {
        // register "sort_direction_icon" helper.  It render icon based on sorting direction.
        Handlebars.registerHelper("sort_direction_icon", function() {
            if(this.SortDirection == "Ascending") {
                return "<span class=\"ui-icon ui-icon-arrowthick-1-n end\" ></span>";
            } else {
                return "<span class=\"ui-icon ui-icon-arrowthick-1-s end\" ></span>";
            }
        });
        var source = this.template();
        var compiler = Handlebars.compile(source);
        var data = item.toJSON();
        var handlerBarHtml = compiler(data);
        this.$el.append(handlerBarHtml);
        this.$el.find("li:last").data(item);
        return this.$el;
    },
    sortUpdate : function(event, ui) {
        var addIndex = ui.item.index();
        var removeItem = ui.item.data();
        this.collection.moveItem(removeItem, addIndex);
        console.log("Change [Order]: [" + removeItem.get("attribute").entity_type_name + "." + removeItem.get("attribute").attribute_name + "] -> [" + ui.item.index() + "]");
        return this;
    },
    removeAttribute : function(event) {
        var attr = $(event.target).parent().data();
        this.collection.removeItem(attr);
        $(event.target).parent().remove();
        return this;
    },
    changeSortDirection : function(event) {
        var attr = $(event.target).parent().data();
        if($(event.target).hasClass("ui-icon-arrowthick-1-n")) {
            attr.set({
                "sort_direction" : "Descending"
            });
            $(event.target).removeClass("ui-icon-arrowthick-1-n");
            $(event.target).addClass("ui-icon-arrowthick-1-s");
        } else {
            attr.set({
                "sort_direction" : "Ascending"
            });
            $(event.target).removeClass("ui-icon-arrowthick-1-s");
            $(event.target).addClass("ui-icon-arrowthick-1-n");
        }
        console.log("change [sort_direction] -> " + attr.get("sort_direction"));
        event.preventDefault();
        return false;
    },
    editAggregate : function(event) {
        var $this = this;
        var attr = $(event.target).parent().data();
        var curFunc = attr.get("aggregate_function");
        var dialog_element = $("<div class=\".aggregate_dialog\">Please enter Aggregate Function: <input type=\"text\" name=\"aggr_func\" class=\"view_input\"/> <br/><br />" + "<input type=\"checkbox\" name=\"apply_sort\" class=\"view_input\" value=\"ApplySort\">Enable Sorting on this Aggregate</input> <br />" + "<input type=\"radio\" name=\"sort_direction\" class=\"view_input\" value=\"Ascending\" disabled=\"diabled\" checked=\"checked\"/> Ascending" + "<input type=\"radio\" name=\"sort_direction\" class=\"view_input\" value=\"Descending\" disabled=\"diabled\"/> Descending<br /></div>");

        $(dialog_element).find("input:text.view_input").attr("value", curFunc);
        $(dialog_element).find("input:checkbox").click(function(event) {
            if($(event.target).attr("checked") == "checked") {
                $(dialog_element).find("input:radio.view_input").removeAttr("disabled");
            } else {
                $(dialog_element).find("input:radio.view_input").attr("disabled", "disabled");
            }
        });
        if(attr.get("apply_sort")) {
            $(dialog_element).find("input:checkbox.view_input").attr("checked", true);
            $(dialog_element).find("input:radio.view_input").removeAttr("disabled");
            $(dialog_element).find("input:radio.view_input").filter("[value=" + attr.get("SortDirection") + "]").attr("checked", true);
        }

        $this.$el.append(dialog_element);
        $(dialog_element).dialog({
            resizable : false,
            modal : true,
            width : 500,
            height : 200,
            draggable : true,
            close : function() {
                $(dialog_element).remove();
            },
            buttons : {
                "OK" : function() {
                    var aggrFunc = $(dialog_element).find("input:text.view_input").attr("value");
                    var applySort = $(dialog_element).find("input:checkbox.view_input").attr("checked") == "checked";
                    var sortDirection = $(dialog_element).find("input:radio.view_input:checked").val();
                    attr.set({
                        aggregate_function : aggrFunc,
                        apply_sort : applySort,
                        sort_direction : sortDirection
                    });
                    console.log("change [aggregate_function] -> " + attr.get("aggregate_function") + "apply_sort = [" + attr.get("apply_sort") + "], sort_direction = [" + attr.get("sort_direction") + "]");
                    $this.renderAllAttributes();
                    $(this).dialog("close");
                },
                "Cancel" : function() {
                    $(this).dialog("close");
                }
            }
        });

        $(dialog_element).dialog("open");
    }
});

OnTheSide.PivotLayout = OnTheSide.BaseView.extend({

    initialize : function(args) {
        this.constructor.__super__.initialize.apply(this, [args]);
        if(this.model_template == undefined || this.model_template == null) {
            $.error('PivotLayout must have a Mustache Template.');
        }

        this.model.bind('change', this.render, this);
    },
    events : {
        "change input:checkbox" : "updateHierarchy"
    },

    render : function(model) {

        var renderHtml = this.constructor.__super__.getRenderHtml.apply(this, [model]);
        this.$el.html(renderHtml);
        var view = this;

        // Get All Entity Types
        this.populateAllEntityTypes(this.$el);

        // Get All Related Entity Types
        this.populateRelatedEntityTypes(this.$el);
        return this;
    },
    renderFilters : function(section) {
        if(!section) {
            section = this.$el;
        }

        var $this = this;

        $.each($(section).find(".allowFilters"), function(index, value) {
            if($(this).prev().prop("type") != "checkbox") {
                $this.addFilter($(this).prev());
            } else {
                if($(this).prev().attr("checked") != "checked") {
                    $this.removeFilter($(this).prev());
                }
            }
        });

        $.each($(section).find("input:checked"), function(index, value) {
            $this.addFilter(this);
        });
        return this;
    },
    addFilter : function(section) {
        $.each($(section).next().find(".hasFilters"), function(index, value) {
            $(this).remove();
        });
        var toFind;
        if($(section).prop("type") == "checkbox") {
            toFind = new OnTheSide.EntityType({
                id : $(section).attr("data-entyid"),
                entity_type_id : $(section).attr("data-entyid"),
                entity_type_name : $(section).attr("data-entyname")
            });
        } else {
            toFind = new OnTheSide.EntityType({
                id : this.model.get("child_entity_type").entity_type_id,
                entity_type_id : this.model.get("child_entity_type").entity_type_id,
                entity_type_name : this.model.get("child_entity_type").entity_type_name
            });
        }
        var curFilterCombo = this.model.getFilterCombination(toFind);

        if(!$(section).next().hasClass("allowFilters")) {
            $(section).next().addClass("allowFilters");
        } else {
            $.each($(section).next().find(".filter"), function(index, value) {
                $(this).remove();
            });
        }

        if(curFilterCombo.filters == null || curFilterCombo.filters.length == 0) {
            $(section).next().append("<span class=\"filter filter_text\">Filters</span><span class=\"ui-icon ui-icon-plus filter\"></span>");
        } else {
            var filters = curFilterCombo.filters;
            var filterNum = filters ? filters.length : 0;
            $(section).next().append("<span class=\"ui-state-active hasFilters\"><span class=\"filter\">Filters</span><span class=\"ui-icon ui-icon-pencil filter\"></span></span>");
        }
    },
    removeFilter : function(section) {
        var element = $(section).parent().find(".allowFilters");
        $.each($(element).find(".filter"), function(index, value) {
            $(this).remove();
        });
        $(element).removeClass("allowFilters");
        $(element).removeClass("hasFilters");
    },
    populateAllEntityTypes : function(section) {
        var entityType = new OnTheSide.EntityType({
            resource_mode : "Index"
        });
        var entityTypeUrl = entityType.getUrl();
        entityTypeUrl = "data/EntityTypes.json"; // use the local json file for debugging.
        // "/EntityTypes"
        var allEntityTypes = new OnTheSide.EntityTypeCollection;
        //            show_busy_indicator(section);
        allEntityTypes.fetch({
            url : entityTypeUrl,
            success : function(response, xhr) {
                //                    hide_busy_indicator(section);
                $.each(allEntityTypes.models, function(key, value) {
                    $(section).find("select.pivot_entity_type").append($("<option></option>").attr("value", value.get("entity_type_id")).attr("data-entyid", value.get("entity_type_id")).attr("data-entyname", value.get("entity_type_name")).text(value.get("entity_type_name")));
                });
            },
            error : function(response, xhr) {
                //                    hide_busy_indicator(section);
                alert("Requesting all entity types failed.\n\nDetails:[" + response.responseText + "]");
            }
        });
        // need to style the filter if it exists
        this.addFilter($(section).find("select.pivot_entity_type"));
    },
    populateRelatedEntityTypes : function(section) {
        var pivotLayout = this;
        if(!section) {
            section = pivotLayout.el;
        }
        var pivotType = this.model.get("child_entity_type");
        if(pivotType == undefined || pivotType == null) {
            alert("No valid Pivot Type is defined for this view.  Please Select a valid Pivot Type first.");
            return;
        }

        var pivotType = new OnTheSide.EntityType({
            id : pivotType.entity_type_id,
            entity_type_id : pivotType.entity_type_id,
            entity_type_name : pivotType.entity_type_name,
            resource_mode : "RelatedEntityTypes"
        });

        if($(section).find("div.related_entity_types").length == 0) {
            $(section).append("<div class='related_entity_types'><ul></ul></div>")
        }
        $(section).find("div.related_entity_types").data("selected_entity_type", []);
        // "/EntityTypes/705ddac0-91c7-483e-a041-5163169e63cb/RelatedEntityTypes?Level=5"
        var treeviewSection = $(section).find("div.related_entity_types");
        $(treeviewSection).data("selected_entity_types", []);
        $(treeviewSection).data("requested_entity_types", []);
        $(treeviewSection).data("missing_entity_types", []);
        $(treeviewSection).data("all_entity_types", this.model.getAllChildrenEntityTypes());
            
        this.lazyPopulateRelatedEntityTypes(pivotType, $(treeviewSection), $(treeviewSection));
//        this.lazyPopulateRelatedEntityTypes(pivotType, $(section).find("div.related_entity_types"), $(section).find("div.related_entity_types"))
    },
    lazyPopulateRelatedEntityTypes : function(reqtype, element, section) {
        console.log("LazyPopulateRelatedEntityTypes: Req type name=[" + reqtype.get("entity_type_name") + "], id=[" + reqtype.get("entity_type_id") + "]");
        var pivotLayout = this;

        var exclusiveIds = [];
        exclusiveIds.push(this.model.get("child_entity_type").entity_type_id);
        exclusiveIds.push(reqtype.get("entity_type_id"));

        var url = reqtype.getUrl(true);
        url = "data/RelatedEntityTypes.json";
        var reqid = reqtype.get("entity_type_id");
        
        reqtype.fetch({
            url : url,
            success : function(response, xhr) {
                // save requested entitytype id
                if (reqid != pivotLayout.model.get("child_entity_type").entity_type_id) {
                    var allTypes = $(section).data("all_entity_types");
                    var requestedTypes = $(section).data("requested_entity_types");
                    requestedTypes = (requestedTypes == undefined || requestedTypes == null) ? []: requestedTypes;
                    requestedTypes.push(reqtype);
                    console.log("all_entity_types = " + allTypes.length + "; requested_entity_types = " + requestedTypes.length);
                    $(section).data("requested_entity_types", requestedTypes);
                }
                // compile the source template to html
                pivotLayout.renderRelatedEntityTypes(element, response);

                // remove the recursive one
                pivotLayout.removeRecursiveElements(element, exclusiveIds);

                // build treeview
                $(element).treeview({
                    collapsed : true,
                    toggle : function() {
                        var $this = $(this);
                        if($this.children("input:checkbox").attr("disabled") == "disabled") {
                            $this.find(".placeholder").remove();
                            return;
                        }
                        var newReqType = new OnTheSide.EntityType({
                            id : $this.children("input:checkbox").attr("data-entyid"),
                            entity_type_id : $this.children("input:checkbox").attr("data-entyid"),
                            entity_type_name : $this.children("input:checkbox").attr("data-entyname"),
                            resource_mode : "RelatedEntityTypes"
                        });

                        if(!$this.hasClass("hasChildren")) {
                            console.log("Request Child: new Req type name=[" + newReqType.get("entity_type_name") + "], id=[" + newReqType.get("entity_type_id") + "]");
                            pivotLayout.lazyPopulateRelatedEntityTypes(newReqType, $this, section);
                        }
                    }
                });
                // disable/pre-select necessary ones.
                pivotLayout.initCurrentElements(element, section,  $(section).data("all_entity_types"));  
                    
                // delay check missing types.  Make sure the lazyPopulating has enough time to request the type first
                setTimeout(function() {
                        pivotLayout.checkMissingTypes($(section));
                }, 1000);
            },
            error : function(response, xhr) {
                //                    hide_busy_indicator(section);
                alert("Failed to request Related EntityTypes from EntityType [." + reqType.entity_type_name + "]");
            }
        });
    },
    renderRelatedEntityTypes : function(element, response) {
        if(response.get("related_entity_types").length > 0) {
            // compile the source template to html
            if(this.partial_templates == undefined || this.partial_templates == null || this.partial_templates.length == 0) {
                Alert("No Partial Template is defined for Related Entity Types.  Please defined a partial template first before using the lazy loading.");
            }

            var source = this.partial_templates[0].html;
            var compiler = Handlebars.compile(source);
            Handlebars.registerPartial("related_partial", source);
            var handlerBarHtml = compiler(response.toJSON());
            $(element).find("ul").html(handlerBarHtml);
            $(element).addClass("hasChildren");
        }
    },
    removeRecursiveElements : function(element, exclusiveIds) {
        // remove the chidlren has same id as current request type id
        $.each(exclusiveIds, function(index, value) {
            var toDelete = $(element).find("ul").find("input:checkbox#" + value);
            if($(toDelete).length > 0) {
                $(toDelete).parent("li").remove();
            }
        });
        // remove the children has the same id as the current <li>'s parents' checkbox ids
        $(element).parents("li").each(function(index, value) {
            var chkbox = $(this).children("input:checkbox");
            if($(chkbox).length > 0) {
                var toDelete = $(element).find("ul").find("input:checkbox#" + $(chkbox).attr("id"));
                if($(toDelete).length > 0) {
                    $(toDelete).parent("li").remove();
                }
            }
        });
    },
    initCurrentElements : function(element, section, allTypes) {
        var $this = this;
        // disable "selected ones from other hierarchy" ones
        var disableIds = $(section).data("selected_entity_types");
        disableIds = (disableIds == undefined || disableIds == null) ? [] : disableIds;
        for(var i = 0; i < disableIds.length; i++) {
            var chkbox = $(element).find("ul").find("input:checkbox#" + disableIds[i]);
            if($(chkbox).length == 1) {
                $(chkbox).attr("disabled", true);
                //$(chkbox).prev().remove(); // remove the "+"/"-" sign since it shouldn't be selected.
                var index = $.inArray(disableIds[i], allTypes);
                if(index > -1) {
                    allTypes.splice(index, 1);
                }
            }
        }
        // pre-select chosen entity types
        var notFoundChildrenEntityTypes = allTypes;
        for(var i = 0; i < allTypes.length; i++) {
            var selectedId = allTypes[i].entity_type_id;
            var chkbox = $(section).find("ul").find("input:checkbox#" + selectedId);
            if($(chkbox).length == 1) {
                $(chkbox).attr("checked", true);
                // this won't trigger checkbox's "change" event, we need to manually add filters
                $this.addFilter(chkbox);
                $(section).data("selected_entity_type").push(selectedId);
                notFoundChildrenEntityTypes =  Array().slice.call(notFoundChildrenEntityTypes, 1);
            }
        }

        // save "potential" missing entity type id.
        if(notFoundChildrenEntityTypes.length > 0) {
            var missingIds = $(section).data("missing_entity_types");
            missingIds = (missingIds == undefined || missingIds == null) ? []: missingIds;

            for (var i =0; i< notFoundChildrenEntityTypes.length; i++) {
                var typeId = notFoundChildrenEntityTypes[i].EntityTypeId;
                if ($.inArray(typeId, missingIds) == -1) {
                    missingIds.push(typeId);
                }
            }
            $(section).data("missing_entity_types", missingIds);
        }

        $(element).find("ul").find("input:checked").each(function(i, val) {
            $(this).prev().click();
            // this toggle a treeview node (expand the selected entity types)
        });
    },        
    // warn user if there're defined "Related Pivot Types" not found in the treeview.
    // TestType.CheckInit() function overwrites EntityTypes' Relationships
    // Some 'relationship to base type' might not be able to showup in the web. 
    checkMissingTypes: function(section) {
        var requestedTypes = $(section).data("requested_entity_types");
        var missingIds = $(section).data("missing_entity_types");
        var allTypes = $(section).data("all_entity_types");
        if (allTypes.length  > requestedTypes.length) {
            for (var i = 0; i < missingIds.length; i ++) {
                var missingId = missingIds[i];
                for (var j = 0; j < requestedTypes.length; j ++) {
                    if (requestedTypes[j].get("entity_type_id") == missingId) {
                        missingIds.splice(i, i+1);
                    }
                }
            }
            $(section).data("missing_entity_types", missingIds);
            if (missingIds.length > 0) {
                var names = "";
                for (var i =0; i< allTypes.length; i++) {
                    names = "'" + allTypes[i].entity_type_name + "',"
                }
                alert ("Related Entity Types: \n\t" + names.substring(0, names.length - 1) + "\ncan't be found in the current hierarchy tree view.\nData displayed might not be correct.");
            }                
        }                  
    },
    updateHierarchy : function(event) {
        var target = $(event.target);
        var selected = $(target).attr("checked");
        console.log("[" + $(target).attr("data-entyname") + "] is changed!  checkbox.checked = " + selected);
        // select =>
        // 1. push the selected one into hierarchy. (include it's upstream ones)
        // 2. disable other checkbox with the same id.
        // 3. update the <div.related_entity_types>.data("selected_entity_type")
        if(selected == "checked") {
            this.selectAndUpdateHierarchy(target);
            // add a filter
            this.addFilter(target);
        }
        // unselected =>
        // 1. delete the unselected one from the hierarchy.  (include it's downstream ones)
        // 2. enable all the disabled ones.
        // 3. update the <div.related_entity_types>.data("selected_entity_type")
        else {
            // update model to remove the unselected item
            this.unselectAndUpdateHierarchy(target);
            // remove a filter
            this.removeFilter(target);
        }
    },
    selectAndUpdateHierarchy : function(target) {
        var toAdd = {
            "entity_type_id" : $(target).attr("data-entyid"),
            "entity_type_name" : $(target).attr("data-entyname")
        }
        // update model to add newly selected item
        var allParents = $(target).parent("li").parents("li");
        // all the parents needs to be selected as well
        for(var i = allParents.length - 1; i >= 0; i--) {
            var chkbox = $(allParents[i]).children("input:checkbox:first");
            if($(chkbox).attr("checked") != "checked") {
                $(chkbox).trigger('click');
                // trigger "updateHierarchy"
            }
        }
        var parentId;
        if(allParents.length > 0) {
            parentId = $(allParents[0]).children("input:checkbox:first").attr("data-entyid");
        }
        if(allParents.length == 0) {
            parentId = this.model.get("child_entity_type").entity_type_id;
        }
        this.model.addChildEntityType(toAdd, parentId);
        // recursive adding is done inside the PivotHierarchy Model.  (So we need to add filter as well)
        this.updateUIComponents(toAdd, true);
    },
    unselectAndUpdateHierarchy : function(target) {
        var toDelete = {
            "entity_type_id" : $(target).attr("data-entyid"),
            "entity_type_name" : $(target).attr("data-entyname")
        }
        // update model to add newly selected item
        var allChildren = $(target).parent("li").find("li");

        for(var i = allChildren.length - 1; i >= 0; i--) {
            var chkbox = $(allChildren[i]).children("input:checkbox:first");
            if($(chkbox).attr("checked") == "checked") {
                $(chkbox).trigger('click');
                // trigger "updateHierarchy"
            }
        }
        this.model.removeChildEntityType(toDelete);
        this.updateUIComponents(toDelete, false);
    },
    updateUIComponents : function(target, isSelect) {
        this.updateIds(target.entity_type_id, isSelect);
        // update "selected_entity_types" data in ul
        this.updateCheckboxes(target, !isSelect);
        // disable/enable other checkbox with the same id;
    },
    updateIds : function(value, isAdd) {
        // update "selected_entity_types" data in ul
        var selectedIds = this.$el.find("div.related_entity_types").data("selected_entity_type");
        var index = $.inArray(value, selectedIds);
        if(isAdd) {
            if(index == -1) {
                selectedIds.push(value);
            }
        } else {
            if(index > -1) {
                selectedIds.splice(index, 1);
            }
        }
        this.$el.find("div.related_entity_types").data("selected_entity_type", selectedIds);
    },
    updateCheckboxes : function(target, isEnable) {
        var targetId = target.entity_type_id;
        var targetName = target.entity_type_name;

        if(isEnable) {
            // enable disabled ones.
            this.$el.find("input:checkbox[disabled='true']").each(function(i, val) {
                if(($(this).attr("data-entyid") == targetId) && ($(this).attr("data-entyname") == targetName)) {
                    $(this).removeAttr("disabled");
                    if($(this).prev().hasClass("collapsable-hitarea")) {
                        $(this).prev().click();
                    }
                    //$('<div class="hitarea expandable-hitarea lastExpandable-hitarea"></div>').insertBefore($(this));
                }
            });
        } else {
            // disable other checkbox with the same id
            this.$el.find("input:checkbox#" + targetId).each(function(i, val) {
                if(($(this).attr("data-entyid") == targetId) && ($(this).attr("data-entyname") == targetName)) {
                    if($(this).attr("checked") != "checked") {
                        $(this).attr("disabled", true);
                        $(this).parent("li").children("ul").empty();
                        $(this).parent("li").removeClass("hasChildren");
                        //$(this).prev().remove();
                    }
                }
            });
        }
    }
});

// Layout to display EntityTypes with its Attributes in a TreeView
OnTheSide.EntityTypeAttrsLayout = OnTheSide.BaseView.extend({

    initialize : function(args) {
        this.constructor.__super__.initialize.apply(this, [args]);
        if(this.model_template == undefined || this.model_template == null) {
            $.error('AttrLayout must have a Mustache Template.');
        }

        if(args.ref_collection != undefined && args.ref_collection != null) {
            this.ref_collection = args.ref_collection;
        }
        this.collection.bind('reset', this.renderAll, this);
    },
    events : {
    },

    renderAll : function(model) {
        this.$el.find("ul.enty_attrs").html("")
        this.collection.each(this.renderOne, this);
        var htmlElement = this.$el.find("ul.enty_attrs");
        this.ref_collection.each(function(modelItem) {
            var attr = modelItem.get("attribute");
            if(attr != null && attr.attribute_id != null) {
                htmlElement.find("input:checkbox#" + attr.attribute_id).attr("checked", true);
            }
        });
        this.$el.find("ul.enty_attrs").treeview({
            collapsed : true
        });
        return this.$el;
    },
    renderOne : function(item) {
        var source = this.template();
        var compiler = Handlebars.compile(source);
        var data = item.toJSON();
        var handlerBarHtml = compiler(data);
        this.$el.find("ul.enty_attrs").append(handlerBarHtml);
        return this.$el;
    }
});

