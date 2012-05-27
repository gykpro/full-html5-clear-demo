global_static_root = '/full-html5-clear-demo'
KISSY.config({
   map: [
           [/(.+)-min\.(.+)?$/, '$1.$2']
       ],
       packages:[
	       {
	            name: 'mods',
	            tag: '20110515', 
	            path: global_static_root, 
	            charset: 'utf-8' 
	       }
       ]
});
KISSY.use('mods/listview',function(S, ListView){

		var S=KISSY;
		var $=S.all;

		var view = new ListView({
            el:'#container'
		});

				
		view.add({
			value:'xxx'
		})
		$('#container li.item').on('swipe',function(ev){
			alert('success');
		})
		$('#container li.item').on('longTap',function(ev){
			console.log(ev.currentTarget)
		})

});	