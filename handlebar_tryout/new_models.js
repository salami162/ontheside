OnTheSide.EntityType = OnTheSide.BaseModel.extend({
    defaults: _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type : "EntityTypes"
    }),
    initialize: function (args) {
        defaults: _.extend({}, this.defaults, args);
        this.set({ 
            attribute_defs: new SkynetWeb.AttributeCollection(),
            related_entity_types: new SkynetWeb.EntityTypeCollection() 
        });
    }
}); 
OnTheSide.EntityTypeCollection = Backbone.Collection.extend({
    model : OnTheSide.EntityType
});

OnTheSide.Attribute = OnTheSide.BaseMode.extend({
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
