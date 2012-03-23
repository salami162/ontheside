// create SkynetWeb namespace
function SkynetWeb() {
}

SkynetWeb.GuidPattern = new RegExp("^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$");

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
SkynetWeb.methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
};

SkynetWeb.logicFilter = {
    "EQUAL" : "EQUAL",
    "LIKE"  : "LIKE",
    "NOT_LIKE"  : "NOT_LIKE",
    "NOT_EQUAL" : "NOT_EQUAL",
    "LESS_THAN" : "LESS_THAN",
    "GREATER_THAN"  : "GREATER_THAN",
    "IN"    : "IN",
    "NOT_IN"    : "NOT_IN",
    "BETWEEN"   : "BETWEEN",
    "NOT_BETWEEN"   : "NOT_BETWEEN",
    "GREATER_THAN_OR_EQUAL" : "GREATER_THAN_OR_EQUAL",
    "LESS_THAN_OR_EQUAL"    : "LESS_THAN_OR_EQUAL",
    "IS_NULL"   : "IS_NULL",
    "IS_NOT_NULL"   : "IS_NOT_NULL"
};

// base model
SkynetWeb.BaseModel = Backbone.Model.extend({
    // Default entity type attributes
    defaults : {
        resource_type : null,
        resource_mode : null
    },
    initialize : function(args) { defaults:
        _.extend({}, this.defaults, args);
    },
    // compose URL.  Sample: /DataViews/id/Description/
    getUrl : function(useName) {
        if(this.get("resource_type") == undefined) {
            this.raiseError('A "resource_type" property must be specified')
        }

        var returnUrl = site_root() + encodeURIComponent(this.get("resource_type"));

        if(useName) {
            var name = this.name();
            if(name != undefined && name != null) {
                returnUrl = returnUrl + "/" + encodeURIComponent(name);
            }
        } else {
            if(this.id != undefined && this.id != null) {
                returnUrl = returnUrl + "/" + encodeURIComponent(this.id);
            }
        }

        if(this.get("resource_mode") != undefined && this.get("resource_mode") != null) {
            returnUrl = returnUrl + "/" + encodeURIComponent(this.get("resource_mode"));
        }

        return returnUrl;
    },
    raiseError : function(errorMessage) {
        throw new Error(errorMessage);
    },
    name : function() {
        this.raiseError("[name] is not implemented in BaseModel.");
    }
});


Backbone.sync = function(method, model, options) {

    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;
    var response;    
    var type = SkynetWeb.methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = model.getUrl() || model.raiseError('Failed to compose request URL from Name and Id');
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
/*      params.beforeSend = function(xhr) {
            xhr.setRequestHeader('X-HTTP-Method-Override', type);
        }; */
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }
    
    // If C++ object exists, call QT controller
    if (!(typeof requestor === "undefined")) {
        requestor.request(params.url, params.type, params.data, function (response) {
            var jsonObj = $.parseJSON(response);
            if (jsonObj != null) {
            options.success(jsonObj);
            } else {
            options.error("Request to Server Failed.");
            }           
        });
    }
    else {
        response = $.ajax(params);
    }
    
    return response;
};
 
 