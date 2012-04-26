$(function() {
    var section = $(".wizard");
    
    // model    
    var current_wizard = new OnTheSide.Wizard({
        id: "d442f749-261c-4d32-8542-f932cc12224b",
        resource_mode: "Description"
    });

    var wizard_view = new OnTheSide.WizardView({
        model: current_wizard,
        el: $(section),
        template: $("#wizard-template").html(),
        partial_templates: [{name: "related_partial", html: $("#entity-type-partial-template").html()}]
    });
    
/*    current_wizard.fetch({
        url: site_root() + "/data/DataView.json",
        success: function(response, status, xhr) {
        }
    });*/
    wizard_view.render();
});


OnTheSide.Type = OnTheSide.BaseModel.extend({
    defaults: _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "Types"
    }),
    initialize: function (args) {
        defaults: _.extend({}, this.defaults, args);
        this.set({ 
            attribute_defs: new OnTheSide.AttributeCollection(),
            related_entity_types: new OnTheSide.TypeCollection() 
        });
    }
}); 
OnTheSide.TypeCollection = Backbone.Collection.extend({
    model : OnTheSide.Type
});

OnTheSide.Attribute = OnTheSide.BaseModel.extend({
    defaults:  _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "Attributes"
    }),
    initialize: function (args) {
        defaults: _.extend({}, this.defaults, args);        
    }
});

OnTheSide.AttributeCollection = Backbone.Collection.extend({
    model : OnTheSide.Attribute
});

/*
OnTheSide.GroupByAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "GroupByAttributes",
        enable_percentage_on_aggregate : false
    }),
    initialize : function(args) { 
        defaults: _.extend({}, this.defaults, args);
        this.set({attribute: new SkynetWeb.Attribute()});
    }
});

// display_attribute model
OnTheSide.DisplayAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "DisplayAttributes",
        fully_qualified_display_columnName : "",
        display_name : "",
        display_index : -1,
        visible : true,
        width : 0
    }),
    initialize : function(args) { 
        defaults: _.extend({}, this.defaults, args);
        this.set({attribute: new SkynetWeb.Attribute()});        
    }
});

// sort_attribute model
OnTheSide.SortAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "SortAttributes",
        sort_direction : "Ascending"
    }),
    initialize : function(args) { 
        defaults: _.extend({}, this.defaults, args);
        this.set({attribute: new SkynetWeb.Attribute()});
    }
});

// aggregate_attribute model
OnTheSide.AggregateAttribute = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "SortAttributes",
        aggregate_function : null,
        apply_sort : false,
        sort_direction : "Ascending"
    }),
    initialize : function(args) { 
        defaults: _.extend({}, this.defaults, args);
        this.set({attribute: new SkynetWeb.Attribute()});
    }
});
*/

// hierarchy
OnTheSide.Hierarchy = OnTheSide.BaseModel.extend({
    // Default entity type attributes
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "Hierarchy",
        child_type : null,
        children : null,
        filter_defs : null
    }),
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    },

    getUrl : function() {
        var fetchUrl = "Type=" + encodeURIComponent(this.get("child_type").entity_type_id);
/*        var allEntityTypes = this.getAllChildrenEntityTypes();

        if(allEntityTypes.length > 0) {
            var params = [];
            for(var iType = 0; iType < allEntityTypes.length; iType++) {
                var param = "ChildType" + iType + "=" + encodeURIComponent(allEntityTypes[iType].entity_type_id);
                params.push(param);
            }
            fetchUrl = fetchUrl + "&" + params.join("&");
        }*/
        return fetchUrl;
    }
});

// wizard model
OnTheSide.Wizard = OnTheSide.BaseModel.extend({
    defaults : _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "Wizards"
    }),

    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
        this.set({
            type : new OnTheSide.Type(),
            hierarchy : new OnTheSide.Hierarchy(),
            g_attributes : new OnTheSide.AttributeCollection({url: "/" + this.get("resource_type") + "/g_attributes/"}),
            a_attributes : new OnTheSide.AttributeCollection({url: "/" + this.get("resource_type") + "/a_attributes/"}),
            d_attributes : new OnTheSide.AttributeCollection({url: "/" + this.get("resource_type") + "/d_attributes/"}),
            s_attributes : new OnTheSide.AttributeCollection({url: "/" + this.get("resource_type") + "/s_attributes/"}),
        });
    },
    parse : function(response, xhr, options) {
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
});

OnTheSide.WizardView = OnTheSide.BaseView.extend({

    initialize : function(args) {
        this.constructor.__super__.initialize.apply(this, [args]);
        if(!this.template) {
            $.error('Wizard View must have a Mustache Template.');
        }

        this.model.bind('change', this.render, this);

        //            this.model.fetch();
    },
    events : {
    },
    render : function(model) {
        // compile and render the "basic info" section
        console.log("render smart");
        var args = [model];
        var renderHtml = this.constructor.__super__.getRenderHtml.apply(this, args);
        this.$el.html(renderHtml);
        
        this.$el.find(".swMain").smartWizard({
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
        return this;
    }
});    
