global_static_root = 'http://localhost/full-html5-clear-demo'
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
KISSY.use('mods/toppinchitemview',function(S, TopPinchViewItem){


	YUI().use("test","node","console", function (Y) {
		window.Y = Y;
		Y.one('body').addClass('yui3-skin-sam');
		Y.one('body').append('<div id="testlogger"></div>')
		var suite = new Y.Test.Suite("pinchview");

		var S=KISSY;
		var $=S.all;

		var view = new TopPinchViewItem({
			parentNode:'#container'
		});
		view.render();
	 	
	 	//---------------------Testcase testDefaultUI Start------------------------------------------
	 	//@testcase testDefault
	 	//@target render并验证元素
	 	//@preset 

		var testDefault = new Y.Test.Case({
			setUp: function () {
			},
			tearDown:function(){

			},
			name: "default ui test",
		 	
		 	//@expect 执行render后元素正常出现
			testInit: function () {
				var result = S.all('#container .pinch-item').length;
				Y.log(result)
				Y.Assert.areNotEqual(result,0,'#container should have .pinch-item element after view inited')
			},
			testRotate:function(){
				var curHeight = 40;
				var timeVar = setInterval(function(){
					curHeight--;
					if(curHeight==-1){
						clearInterval(timeVar);
						return;
					}
					view.set('height',curHeight);
				},30)
				this.wait(function(){

					Y.assert(window.confirm('looks right?')===true,'tester said it failed!')
				},2000)
			}
		}); 

	 	
		
		
		suite.add(testDefault);

	    var r = new Y.Console({
		    verbose : true,
		    newestOnTop : false,
		    height:'90%'
		});
		
		r.render('#testlogger');
		

		Y.Test.Runner.add(suite);
	 
		Y.Test.Runner.run();
	});

});	