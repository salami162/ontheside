//     inventory.js 0.1.0
//     (c) [2012 - current] Limin Shen.
//     This file contains inventory UI models.  I am testing out doT.js templates in this prototype.  


// platform model
OnTheSide.Entity = OnTheSide.BaseModel.extend({
    // Default entity type attributes
    defaults: _.extend({}, OnTheSide.BaseModel.prototype.defaults, {
        resource_type: "Entity",
        entity_type_id: null,
        entity_type_name: null,
        entity_id: null,
        entity_name: null
    }),
    initialize: function (args) {
        defaults: _.extend({}, this.defaults, args);
    }
});

OnTheSide.Platform = OnTheSide.Entity.extend({
    // Default entity type attributes
    defaults: _.extend({}, OnTheSide.Entity.prototype.defaults, {
        resource_type: "Platform",
        entity_type_id: null,
        entity_type_name: "Platform",
        entity_id: null,
        entity_name: null,
        num_of_sockets: 0,
        num_of_pcies: 0,
        num_of_satas: 0,
        num_of_dcts: 0,
        num_of_dimms: 0
    }),
    initialize: function (args) {
        defaults: _.extend({}, this.defaults, args);
    }
});

OnTheSide.EntityView = Backbone.View.extend({
    
    initialize: function (args) {
        this.template_def = args.template_def;
        this.model_template = args.model_template;
        this.template = doT.template(this.model_template, undefined, this.template_def);

        // subscribe the model.change event, invoke the render function.
        this.model.bind('change', this.render, this);
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    getRenderHtml: function (renderModel, renderSource) {
        var source = (!renderSource)? this.ModelTempalte : renderSource;
        var doTtemplate = doT.template(source, undefined, this.template_def);
        var html = doTtemplate(renderModel.toJSON());
        return html;            
    },
    
    render: function(model) {      
        console.log("Render EntityView");      
        // compile and render the "basic info" section  
        var args = [model];
        var source = this.model_template;
        args.push(source);
        var renderHtml = this.getRenderHtml.apply(this, args);

        $(this.el).html(renderHtml);
    }
    
});
