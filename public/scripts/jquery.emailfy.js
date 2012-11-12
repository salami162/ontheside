(function( $ ){
  const NAMESPACE = 'emailfy';

	var methods = {
		init : function( options ) {

			return this.each(function(){
        var self = $(this),
            settings = self.data(NAMESPACE);

        options = (options == undefined) ? {} : options;
         
				// If the plugin hasn't been initialized yet
				if (!settings ) {
				  methods["initUIComponents"].apply(self);
				  settings = self.data(NAMESPACE);                   
				}

				$.extend(true, settings, options );
				self.data(NAMESPACE, settings);
      });
    },
     
    destroy : function( ) {

      return this.each(function(){
      	var self = $(this),
            settings = self.data(NAMESPACE);

         // Namespacing FTW
         $(window).unbind('.emailfy');
         settings.mailWrap.remove();
         settings.alertWrap.remove();
         $this.removeData(NAMESPACE);
       })

    },
			
		initUIComponents : function() {
     	var self = $(this);
			
			var mailWrap = $('<div class="mailWrap">')
				.append('<label for="email" class="inside">email@address.com</label>')
				.append('<input type="text" name="email" id="email" class="newsletterInput" />')
				.append('<input type="submit" name="Submit" value="Go" class="btn btn-primary btn-large" />')
				.append('<span class="loader"><img src="images/loading.gif" alt="loading" /></span>');
			mailWrap.find('.loader').hide();
			
			var alertWrap = $('<div class="alert alert-block" style="margin: 10px 36px 10px 36px;">')	
			alertWrap.hide();
			
			self.append(mailWrap).append(alertWrap);
			
			self.data(NAMESPACE, {
				target : self,
				mailWrap : self.find('.mailWrap'),
				alertWrap : self.find('.alert'),
				messages : {
					invalidMail : "Please enter a valid email.",
					duplicateMail : "The email is already in the list.",
					systemError	: "An error occurred. Please try again.",
					success : "Your email is added to the list."
				}				
			});
			
			var settings = self.data(NAMESPACE);
			
			// setup events
			settings.mailWrap.find('input.btn-primary').click(function (e) {
				methods['validateEmail'].apply(self);
			});
			settings.mailWrap.find('input.newsletterInput').focus(function () {
				if (settings.alertWrap.css('display') == 'block') {
					settings.alertWrap.hide();
				}
			});
			
    },
   
	  validateEmail : function () {
	   	var self = $(this);
	   	settings = self.data(NAMESPACE);
			settings.mailWrap.find(".loader").show();
	   	var inputEmail = self.find('input.newsletterInput').val();
	   	var validRegex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)");
	   	if (!validRegex.test(inputEmail)) {
	   		settings.alertWrap.html(settings.messages.invalidMail);
	   		settings.alertWrap.addClass('alert-error');
	   		settings.alertWrap.fadeIn('slow').show('slow');
				settings.mailWrap.find(".loader").hide();
	   	}
	   	else {
				$.ajax({
					type: 'POST',
					url: 'newsletter.php',
					data: { email : inputEmail },
					success: function(response){						
						if (theResponse == 1) {
				   		settings.alertWrap.html(settings.messages.success);
				   		settings.alertWrap.addClass('alert-success');
				   		settings.alertWrap.fadeIn('slow').show('slow');
						}
						if (theResponse == 2) {
				   		settings.alertWrap.html(settings.messages.invalidMail);
				   		settings.alertWrap.addClass('alert-error');
				   		settings.alertWrap.fadeIn('slow').show('slow');
						}
						if (theResponse == 3) {
				   		settings.alertWrap.html(settings.messages.duplicateMail);
				   		settings.alertWrap.addClass('alert-error');
				   		settings.alertWrap.fadeIn('slow').show('slow');
						}
						settings.mailWrap.find(".loader").hide();
					},
					error: function(){
			   		settings.alertWrap.html(settings.messages.systemError);
			   		settings.alertWrap.addClass('alert-error');
			   		settings.alertWrap.fadeIn('slow').show('slow');
						settings.mailWrap.find(".loader").hide();
					}		
				});
	   	}
	  }
     
  };

  $.fn.emailfy = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.emailfy' );
    }    
  
  };

})( jQuery );