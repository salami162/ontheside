(function(root, factory) {
		console.log("root = ", root);
		console.log("factory = ", factory);
		root.Backbone = factory(root, 123, true, false);
		
 }(this, function(root, Backbone, _, $) {
 		console.log("inside, root = ", root);
 		console.log("inside, backbone = ", Backbone);
 		console.log("inside, _ = ", _);
 		console.log("inside, $ = ", $);
 })
);