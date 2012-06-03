/**
	adapted code of zepto.js
 **/

KISSY.add('mods/global',function(S, Node, Event){
	(function($){
	  var touch = {}, touchTimeout;

	  function parentIfText(node){
	    return 'tagName' in node ? node : node.parentNode;
	  }

	  function swipeDirection(x1, x2, y1, y2){
	  	// console.log('s1')
	    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
	    // console.log('s2')
	    if (xDelta >= yDelta) {
	      return (x1 - x2 > 0 ? 'Left' : 'Right');
	    } else {
	      return (y1 - y2 > 0 ? 'Up' : 'Down');
	    }
	  }

	  var longTapDelay = 750;
	  function longTap(){
	    if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
	      $(touch.target).fire('longTap');
	      touch = {};
	    }
	  }

	  S.ready(function(){
	    $(document.body).on('touchstart', function(ev){
	    	var e=ev.originalEvent;
	    	// console.log(e.touches)
	    	// console.log('start')
	      var now = S.now(), delta = now - (touch.last || now);
	      // console.log('1')
	      // console.log(e)
	      // console.log(e.touches)
	      // console.log(e.touches[0])
	      touch.target = parentIfText(e.touches[0].target);
	      // console.log('2')
	      touchTimeout && clearTimeout(touchTimeout);
	      // console.log('3')
	      touch.x1 = e.touches[0].pageX;
	      // console.log('4')
	      touch.y1 = e.touches[0].pageY;
	      // console.log('5')
	      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
	      // console.log('6')
	      touch.last = now;
	      setTimeout(longTap, longTapDelay);
	    }).on('touchmove', function(ev){
	      var e = ev.originalEvent;
	      touch.x2 = e.touches[0].pageX;
	      touch.y2 = e.touches[0].pageY;
	    }).on('touchend', function(ev){
	      var e = ev.originalEvent;
	      if (touch.isDoubleTap) {
	      	// console.log('7')
	        $(touch.target).fire('doubleTap');
	        // console.log('8')
	        touch = {};
	      } else if (touch.x2 > 0 || touch.y2 > 0) {
	      	// console.log('9')
	      	// console.log(touch.target)
	      	// console.log(swipeDirection)
	      	// console.log(Math.abs)
	      	var b1 = Math.abs(touch.x1 - touch.x2) > 30;
	      	// console.log(b1);
	      	var b2 = Math.abs(touch.y1 - touch.y2) > 30;
	      	// console.log(b2);
	        (b1 || b2) &&
	          $(touch.target).fire('swipe') && $(touch.target).fire('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
	          // console.log('10')
	        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
	      } else if ('last' in touch) {
	        touchTimeout = setTimeout(function(){
	          touchTimeout = null;
	          $(touch.target).fire('tap')
	          touch = {};
	        }, 250);
	      }
	    }).on('touchcancel', function(){ touch = {} });
	  });

	  // ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
	  //   $.fn[m] = function(callback){ return this.bind(m, callback) }
	  // });
	})(Node.all);
	function Global(){
		Global.superclass.constructor.apply(this,arguments);
	}
	S.extend(Global, S.Base,{},{
		cssConfig:{
			perspective:600,
			itemHeight:80,
			swipeThreshold:80
		}
	})
	return Global;
},{
	requires:['node','event']
})