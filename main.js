// global_static_root = './'
// KISSY.config({
//    map: [
//            [/(.+)-min\.(.+)?$/, '$1.$2']
//        ]
// });
// KISSY.Config.debug = false;

KISSY.add(function(){},{
	requires:['mods/listview']
})
KISSY.config({
   map: [
           [/(.+)-min\.(.+)?$/, '$1.$2']
       ]
       ,
       packages:[
	       {
	            name: 'mods',
	            tag: '20110515', 
	            path: './', 
	            charset: 'utf-8' 
	       }
       ]
});
KISSY.use('mods/listview',function(S, ListView){

		var S=KISSY;
		var $=S.all;

		var view = new ListView({
            el:'#container'
		}).render();

				
		view.add([{
			value:'Full html5 clear demo'
		},{
			value:'drag down or'
		},{
			value:'pinch apart to add'
		}])

		// $('#container li.item').on('swipe',function(ev){
		// 	alert('success');
		// })
		// $('#container li.item').on('longTap',function(ev){
		// 	console.log(ev.currentTarget)
		// })

});	