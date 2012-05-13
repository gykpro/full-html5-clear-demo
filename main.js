(function($){
	var startPoint = 0;
	$(window).on('touchstart',function(ev){
		for(item in ev)
			console.log(item)
	})
})(jQuery)