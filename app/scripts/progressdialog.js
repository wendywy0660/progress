;(function( window ) {

	'use strict';

	var loadZone = $('.load-zone');
	var completedZone = $('.completed-zone');
	var progressValue = $('.pd-value');
	var progressBar = $('.progress-bar');
	var pdTitle = $('.pd-title');
	var pdLoading = $('.pd-loading');
	var pdCompleted = $('.pd-completed');

	var interval = 100;
 	var pdTimer;

	function ProgressDialog() {
		this.startvalue = 0;
		this.finishvalue = 100;
		this.getConfiguration = {};
		this.init();
		
		//this.reset();

	}

	function getLocalConfiguration() {
		return $.getJSON( 'config.json', {
			format: 'json'
		});
	}

	ProgressDialog.prototype.init = function () {
		var config = getLocalConfiguration();
		this.getConfiguration = this.readConfiguration(config);
	};

	ProgressDialog.prototype.readConfiguration = function (promise) {
		var self = this;
		var dfd = new $.Deferred();
		promise.done(function(data) {
			self.assignValues(data.dialog);
			dfd.resolve();
		  })
		  .fail(function() {
		    console.log( 'error' );
		  });
		return dfd.promise();
	};

	ProgressDialog.prototype.assignValues = function (settings) {
		var title = settings.messages.title || 'default title';
		var loadingText = settings.messages.loading || 'default loadingText';
		var completedText = settings.messages.completed || 'default completedText';
		var start = settings.config.start || 0;
		var finish = settings.config.finish || 100;
		var duration = settings.config.duration || 2000;

	 	this.startvalue = start;
	 	this.finishvalue = finish;

		interval = duration / 100;

		pdTitle.text(title);
		pdLoading.text(loadingText);
		pdCompleted.text(completedText);

	};

 	ProgressDialog.prototype.start = function () {
 		var self = this;
 		this.getConfiguration.done(function () {
	 		pdTimer = setInterval(function(){updateProgress();},interval);
			var step = self.startvalue*100/self.finishvalue;
			function updateProgress() {
				if (step <100) {
				    step += 1;
				    progressValue.html(step+ ' / 100');
				    progressBar.css('width', step+'%');
				} else {
					loadComplete();
				}
			}
			function loadComplete(){
				 clearInterval(pdTimer);
				 loadZone.fadeOut('slow', function() {
				 	completedZone.fadeIn('fast');
				 });
			}
 		});
 		

 	};

 	ProgressDialog.prototype.reset = function () {
		clearInterval(pdTimer);
 		completedZone.hide();
		loadZone.show();
	    progressBar.css('width', this.startvalue+'%');
 	};

	

	window.ProgressDialog = ProgressDialog;


})( window );
