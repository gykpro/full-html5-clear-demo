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
KISSY.Config.debug = true;
KISSY.use('mods/listview,mods/toppinchitemview',function(S, ListView, TopPinchView){

		var S=KISSY;
		var $=S.all;

		var view = new ListView({
            el:'#container'
		}).render();

				
		view.add([{
			value:'xxx'
		},{
			value:'yyy'
		}])

		var toppinchviewinst = new TopPinchView().render();
		view.get('el').prepend(toppinchviewinst.get('el'));
			var curHeight = 0;
			var timeVar = setInterval(function(){
				curHeight++;
				if(curHeight==31){
					clearInterval(timeVar);
					return;
				}
				toppinchviewinst.set('height',curHeight);
			},30)

		// $('#container li.item').on('swipe',function(ev){
		// 	alert('success');
		// })
		// $('#container li.item').on('longTap',function(ev){
		// 	console.log(ev.currentTarget)
		// })

});	