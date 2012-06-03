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


	YUI().use("test","node","console", "node-event-simulate", function (Y) {
		window.Y = Y;
		Y.one('body').addClass('yui3-skin-sam');
		Y.one('body').append('<div id="testlogger"></div>')
		var suite = new Y.Test.Suite("ListView");

		var S=KISSY;
		var $=S.all;

		var view = new ListView({
            el:'#container'
		}).render();
	 	
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
			testAdd: function () {
				
				view.add([{
					value:'xxx'
				},{
					value:'yyy'
				}])
				var result = S.all('#container .item').length;
				Y.Assert.areNotEqual(result,0,'#container should have .item element after view added//')
				Y.assert($('#container .text').text()==='xxx','.item should have text "xxx"')
			}//,
			// testRotate:function(){
			// 	var curHeight = 40;
			// 	var timeVar = setInterval(function(){
			// 		curHeight--;
			// 		if(curHeight==-1){
			// 			clearInterval(timeVar);
			// 			return;
			// 		}
			// 		view.set('height',curHeight);
			// 	},30)
			// 	this.wait(function(){

			// 		Y.assert(window.confirm('looks right?')===true,'tester said it failed!')
			// 	},2000)
			// }
		}); 

	 	var testTriggerEvents = new Y.Test.Case({
	 		name:'Trigger Events Test',
	 		testClickOnText:function(){
	 			Y.one('li.item span.text').simulate('click');
				Y.Assert.areSame(1, $('#container input').length, 'should be one input el after click');
				Y.Assert.areSame(document.activeElement, $('#container input').getDOMNode(), 'input node should be focused');
				Y.Assert.areSame('none', $('#container span.text').css('display'),'after edit(), text node should be hidden');
				Y.Assert.areNotEqual('none', $('#container input').css('display'),'after edit(), input node should be visible');
	 		},
	 		testBlur:function(){

	 			// Y.one('body').simulate('click');
	 			// Y.one('#container input').simulate('blur');
	 			Y.one('#fakefocus').focus();
				Y.Assert.areSame(0, $('#container input').length, 'should be no input el after click');
				// Y.Assert.areSame(document.activeElement, $('#container input').getDOMNode(), 'input node should be focused');
				Y.Assert.areNotEqual('none', $('#container span.text').css('display'),'after edit(), text node should be visible');
				// Y.Assert.areNotEqual('none', $('#container input').css('display'),'after edit(), input node should be visible');
	 		}
	 	})
		
		
		suite.add(testDefault);
		suite.add(testTriggerEvents);

	    var r = new Y.Console({
		    verbose : true,
		    newestOnTop : false,
		    height:'90%',
		    top:"100px"
		});
		
		r.render('#testlogger');
		$('#testlogger').style({
			'top':'100px',
			'position':'relative'
		})
		

		Y.Test.Runner.add(suite);
	 
		Y.Test.Runner.run();
	});

});	