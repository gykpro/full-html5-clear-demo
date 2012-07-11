/*
 Combined modules by KISSY Module Compiler : 

 mods/itemview
 mods/global
 mods/pinchitemview
 mods/toppinchitemview
 mods/listview
 main
*/

KISSY.add('mods/itemview',function(S, Node, Template, mvc, Anim){
	var $=Node.all;

    // var ItemViewTpl = Template('<li class="item"><span class="text">{{value}}</span><input type="text" value="{{value}}" style="display:none;"></li>' );
	var ItemViewTpl = Template('<li class="item"><div class="itembody vpart"><span class="icon-finish"></span><span class="text">{{value}}</span><input type="text" value=""/><span class="icon-delete"></span></div></li>' );

	function ItemView(){
		var self = this;
        ItemView.superclass.constructor.apply(self, arguments);
	}
    S.extend(ItemView, mvc.View, {
        render:function(data, node, cstyle) {
            var self = this;
            var tmpNode = $(ItemViewTpl.render(data)),
                el;
            if(node){
                $(node).attr('class','').attr('style','').addClass('item').html(tmpNode.html());
                el = $(node);
            }else{
                el = tmpNode;
            }
            self.set('el',el);
            if(cstyle){
                el.all('.itembody').style(cstyle);
            }
            // el.unselectable();
            el.on('touchstart',function(ev){
                var e=ev.originalEvent;
                if(!e.touches || e.touches.length !== 1){
                    return;
                }
                self.touchStartTimeStamp = S.now();
                // console.log(e.pageX === e.touches[0].pageX)
                self.touchStartPos = self.curTouchPos = {
                    x:e.pageX,
                    y:e.pageY
                }
                self.swiping = null;
                self.swipflag = false;
                self.moveSpeedSacle = 1;
                // ev.preventDefault();
            }).on('touchmove',function(ev){
                var e = ev.originalEvent; 
                if(!e.touches || e.touches.length !== 1){
                    return;
                }

                if(self.swipflag === true && self.swiping === false){
                    return;
                }else{
                    self.swipflag = true;
                    if(self.swiping === null){
                        var dx = e.pageX - self.touchStartPos.x,
                            dy = e.pageY - self.touchStartPos.y;
                        if(Math.abs(dx) > Math.abs(dy))
                            self.swiping = true;                        
                    }
                }
                if(self.swiping === true){
                    ev.halt();
                    var e = ev.originalEvent;
                    self.curTouchPos = {
                        x:e.pageX,
                        y:e.pageY
                    }
                    var dx = e.pageX - self.touchStartPos.x,
                        dy = e.pageY - self.touchStartPos.y;
                    var moveDX;
                    // console.log(e.pageX)
                    if(Math.abs(dx)>40){
                        self.moveSpeedSacle = 0.3;
                        moveDX = ((Math.abs(dx) - 40)*self.moveSpeedSacle + 40)*(Math.abs(dx)/dx);
                    }else{
                        moveDX = dx;
                    }
                    el.all('.itembody').style('-webkit-transform','translateX('+moveDX+'px)');
                }
            }).on('touchend',function(ev){
                // var self = this;
                S.log('itemview touchend start')
                var e = ev.originalEvent;
                if(!e.touches || e.touches.length !==0)
                    return;
                // console.log(e.touches.length)
                S.log('itemview touchend touches length:'+e.touches.length)
                S.log(self)
                S.log(self.swiping || 'null')
                if(self.swiping === true){
                    var dx = self.curTouchPos.x - self.touchStartPos.x,
                        dy = self.curTouchPos.y - self.touchStartPos.y;
                    S.log('itemview touchend 1')
                    var itemBody =  el.all('.itembody');
                    itemBody.style('-webkit-transition','all 0.1s linear');
                    itemBody.style('-webkit-transform','translate(0px)');
                    S.later(function(){
                        itemBody.style('-webkit-transition','')
                    },210)
                }
                S.log('itemview touchend end')
            })
            return self;
        },
        destroy:function() {
            this.get("el").remove();
        }
    },{
        ATTRS:{

        }
    });

    return ItemView;	
}, {
    requires:['node','template','mvc','anim','./itemview.css','./global.css']
})

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
			itemHeight:60,
			swipeThreshold:60
		}
	})
	return Global;
},{
	requires:['node','event']
})

KISSY.add('mods/pinchitemview',function(S, Node, Template, mvc, Anim, Global){
	var $=Node.all;

	var pinchItemViewTpl = Template(
	'<li class="pinch-item">' + 
    '   <div class="pinch-wrapper">'+
'			<div class="transform-item upper-item vpart">' + 
'				<span>双指放大新建条目</span>' + 
'			</div>' + 
'			<div class="transform-item bottom-item vpart">' + 
'				<span>双指放大新建条目</span>' + 
'			</div>' + 
'       </div>'+
'	</li>' );
    // S.log(Global.cssConfig.perspective)
	function PinchItemView(){
		var self = this;
        PinchItemView.superclass.constructor.apply(self, arguments);
	}
    S.extend(PinchItemView, mvc.View, {
        render:function(cstyle) {
            var self = this;
            // dom 节点添加标志 , dom 代理事件需要
            // self.get("el").addClass("note").attr("id", self.get("note").getId());
            // self.get("el").html(pinchItemViewTpl.render());
            var el = $(pinchItemViewTpl.render());
            if(self.get('parentNode')){
            	el.appendTo(self.get('parentNode'));
                $(self.get('parentNode')).css('-webkit-perspective',Global.cssConfig.perspective);
            }
            self.set('el',el);
            if(cstyle){
                el.all('.vpart').style(cstyle)
            }
            self.set('height',0)
            return self;
        },
        appendTo:function(parentNode){
            var self = this;
            if(self.get('el')){
                $(parentNode).append(self.get('el'));
            }else{
                $(parentNode).append(self.render().get('el'));
            }
            $(parentNode).css('-webkit-perspective',Global.cssConfig.perspective);
        },
        _transHeightTo:function(heightByPx){
            // S.log('trans start');
            var self = this;
            var	el = self.get('el'),
            	upper = el.all('.upper-item'),
            	bottom = el.all('.bottom-item'),
            	// halfHeight = Math.floor(heightByPx/2),
            	defHeight = self.get('defHeight'),
                // deg = Math.floor((Math.acos((heightByPx===0?0:(heightByPx+1))/defHeight)/Math.PI) * 180);
            	deg;
            if(heightByPx > defHeight){
                deg = 0;
                el.height('auto').all('.pinch-wrapper').height(defHeight).style('margin', Math.floor(heightByPx - defHeight)/2 + 'px 0');
            }else{
                deg = Math.floor((Math.acos(heightByPx/defHeight)/Math.PI) * 180);
                el.height(heightByPx).all('.pinch-wrapper').height(heightByPx).style('margin','0');
                el.all('.vpart').style('opacity', (heightByPx+20)/80*1);
                
                var actualHeight = 60 * Math.abs(Math.cos(deg*Math.PI/180));
                var delta = actualHeight - heightByPx;
                bottom.style('bottom',-delta+'px')
            }
            // el.css('height',heightByPx);
            // Y.log(upper.css('-webkit-transform'))
            // upper.css('-webkit-transform','perspective(600) rotateX(-'+ deg +'deg)')
            // bottom.css('-webkit-transform','perspective(600) rotateX('+ deg +'deg)')
            upper.css('-webkit-transform','rotateX(-'+ deg +'deg)');
            bottom.css('-webkit-transform','rotateX('+ deg +'deg)');
            // S.log('transend')
        },

        destroy:function(cb) {
            var self = this;
            S.log('destroy start');
            var curHeight = self.get('height'),
                defHeight = self.get('defHeight'),
                el = self.get('el');
            var dH1 = curHeight - defHeight;
            console.log('height:'+curHeight)
            console.log('dh:'+dH1)
            if(dH1 > 0){
                var speed = dH1/5;
                el.all('.pinch-wrapper').addClass('intransition');
                S.later(function(){
                    el.all('.pinch-wrapper').css('margin', 0)
                }, 1, false, self)
                S.later(function(){
                    // el.remove();
                    if(cb){
                        cb();
                    }
                }, 150, false, self)
                
                // S.later(function(){
                //     el.removeClass('intransition')
                // }, 100, false, self);
                // var timer = S.later(function(){
                //     var height = self.get('height');
                //     height-=speed;
                //     if(height<=defHeight){
                //         height = defHeight;
                //         self.set('height',defHeight);
                //         // $(self.get("el")).remove();
                //         timer.cancel();
                //         // callback();
                //     }else{
                //         self.set('height',height);
                //     }
                // }, 1, true, self);               
            }else{
                callback();
            }
            function callback(){
                var timer = S.later(function(){
                    var height = self.get('height');
                    height-=5;
                    if(height<=0){
                        height = 0;
                        self.set('height',0);
                        $(self.get("el")).remove();
                        timer.cancel();
                        el.remove();
                        if(cb){
                            cb();
                        }
                    }else{
                        self.set('height',height);
                    }
                }, 1, true, self);               
            }


            S.log('destroy end')
        }
    },{
        ATTRS:{
            height:{
                setter:function(heightByPx){
                    try{
                    	this._transHeightTo(heightByPx);
                    }catch(ex){}
                	// return this.get('height');
                },
                value:function(){
                	return this.get('el').css('height');
                }
            },
            defHeight:{
            	value: Global.cssConfig.itemHeight || 60
            }
        }
    });

    return PinchItemView;	
}, {
    requires:['node','template','mvc','anim', 'mods/global', './pinchitemview.css']
})

KISSY.add('mods/toppinchitemview',function(S, Node, Template, mvc, Anim, PinchItemView, Global){
	var $=Node.all;

	var topPinchItemViewTpl = Template(
	'<li class="pinch-item">' + 
'			<div class="transform-item  top-pinch-item vpart">' + 
'				<span>下拉新建条目</span>' + 
'			</div>' + 
'		</li>' );
    // console.log(Global.cssConfig.perspective)
	function TopPinchItemView(){
		var self = this;
        TopPinchItemView.superclass.constructor.apply(self, arguments);
        S.log('toppinchview created')
	}
    S.extend(TopPinchItemView, PinchItemView, {
        render:function(data, node, cStyle) {
            var self = this;
            // dom 节点添加标志 , dom 代理事件需要
            // self.get("el").addClass("note").attr("id", self.get("note").getId());
            // self.get("el").html(pinchItemViewTpl.render());
            var el = $(topPinchItemViewTpl.render());
            if(self.get('parentNode')){
            	// el.appendTo(self.get('parentNode'));
                $(self.get('parentNode')).prepend(el);
                $(self.get('parentNode')).css('-webkit-perspective',Global.cssConfig.perspective);
            }
            self.set('el',el);
            if(cStyle){
                el.all('.transform-item').style(cStyle)
            }
            return self;
        },
        appendTo:function(parentNode){
            var self = this;
            if(self.get('el')){
                $(parentNode).prepend(self.get('el'));
            }else{
                $(parentNode).prepend(self.render().get('el'));
            }
            $(parentNode).css('-webkit-perspective',Global.cssConfig.perspective);
        },
        _transHeightTo:function(heightByPx){
            var self = this;
            var	el = self.get('el'),
                itemEl = el.all('.transform-item'),
            	// upper = el.all('.upper-item'),
            	// bottom = el.all('.bottom-item'),
            	// halfHeight = Math.floor(heightByPx/2),
            	defHeight = self.get('defHeight'),
                // deg = Math.floor((Math.acos((heightByPx===0?0:(heightByPx+1))/defHeight)/Math.PI) * 180);
            	deg = ((Math.acos( Math.min(heightByPx + 3, defHeight) /defHeight)/Math.PI) * 180);
                if(deg<0)deg = 0
                S.log('rotating '+deg+'deg')
            el.css('height',heightByPx);
            // Y.log(upper.css('-webkit-transform'))
            // upper.css('-webkit-transform','perspective(600) rotateX(-'+ deg +'deg)')
            // bottom.css('-webkit-transform','perspective(600) rotateX('+ deg +'deg)')
            // upper.css('-webkit-transform','rotateX(-'+ deg +'deg)')
            itemEl.css('-webkit-transform','rotateX('+ deg +'deg)')
            itemEl.style('opacity',Math.min(heightByPx+20, 80)/80 *1);
        },
        destroy:function(cb){
             var self = this;
            S.log('destroy start');
            var curHeight = self.get('height'),
                defHeight = self.get('defHeight'),
                el = self.get('el');
            var dH1 = curHeight - defHeight;
            console.log('height:'+curHeight)
            console.log('dh:'+dH1)
            if(dH1 > 0){
                var speed = dH1/10;
                el.addClass('intransition');
                S.later(function(){
                    el.height(defHeight);
                }, 1, false, self)
                S.later(function(){
                    el.removeClass('intransition');
                    if(cb){
                        cb();
                    }
                }, 150, false, self)
            }else{
                callback();
            }
            function callback(){
                var timer = S.later(function(){
                    var height = self.get('height');
                    height-=5;
                    if(height<=0){
                        height = 0;
                        self.set('height',0);
                        el.remove();
                        // $(self.get("el")).remove();
                        timer.cancel();
                        if(cb){
                            cb()
                        }
                    }else{
                        self.set('height',height);
                    }
                }, 1, true, self);               
            }


            S.log('destroy end')           
        }
        // ,

        // destroy:function() {
        //     this.get("el").remove();
        //     S.log('toppinchview destroy')
        // }
    },{
        ATTRS:{
            height:{
                setter:function(heightByPx){
                    S.log('setting height to '+heightByPx)
                	this._transHeightTo(heightByPx);
                	// return this.get('height');
                },
                value:function(){
                	return this.get('el').css('height');
                }
            }
        }
    });

    return TopPinchItemView;	
}, {
    requires:['node','template','mvc','anim','mods/pinchitemview' ,'mods/global', './toppinchitemview.css']
})

KISSY.add('mods/listview',function(S, Node, Template, mvc, ItemView, PinchItemView, TopPinchView, Global){
	var $=Node.all;
    var editInputElTpl = Template('<input type="text" value="{{value}}"/>');
	function ListView(el){
		var self = this;
        ListView.superclass.constructor.apply(self, arguments);
        return self;
        // self.set('el',el);
	}
    S.extend(ListView, mvc.View, {
        render:function(data){
            var self = this;
            // ListView.superclass.render.apply(self,arguments);
            // // S.log(self.get('el'));
            function setTopPinchViewHeight(height){
                var dH = height;
                if(!self.topPinchViewInst){
                    self.topPinchViewInst = new TopPinchView().render(null, null, {
                        'background-color':self.getColorOfIndex(0, self.get('el').all('li').length)
                    });
                    self.topPinchViewInst.get('el').prependTo(self.get('el'));
                    self._newElIndex = 0;

                }
                self.topPinchViewInst.set('height',dH);
            }
            self.__setTopPinchViewHeight = S.throttle(setTopPinchViewHeight, 50, self);
            $(self.get('el')).on('touchstart',function(ev){
                // try{
                // // S.log(1)
                console.log('touchstart')
                var e = ev.originalEvent;
                // self.fingers = e.touches.length;
                //handle one finger dragging
                self.dragging = self.dragflag = false;
                if(e.touches && e.touches.length === 1){
                    self.__dragging = true;
                    self.startPos1 = {
                        x:e.touches[0].pageX,
                        y:e.touches[0].pageY
                    };
                    self.startWinScrollTop = $(window).scrollTop();
                }

                if(!e.touches || e.touches.length!==2){
                    return;
                }

                //sometimes here trigger twice, both has e.touches.length===2

                if(self.pinchViewInst)
                    return;

                var el = self.get('el'),
                    topPos = el.offset().top,
                    elCount = el.all('li').length,
                    middleX = (e.touches[0].pageY + e.touches[1].pageY)/2,
                    newElIndex = elCount - 1,
                    theoIndex = parseInt(middleX / Global.cssConfig.itemHeight) + 1;
                // console.log((middleX - topPos) % Global.cssConfig.itemHeight)

                self._newElIndex = newElIndex = (theoIndex > elCount - 1)?elCount :theoIndex;
                // if(newElIndex < elCount - 1){
                //     newElIndex++;
                // }

                    // bottomPos = topPos + el.height();
                // console.log('topPos:'+topPos);
                // console.log('bottomPos:'+bottomPos);
                self.__pinching = true;
                self.__dragging = false;
                // // S.log(1)
                self.pinchViewInst = new PinchItemView().render({
                    // 'background-color':'hsl(' + (353+newElIndex*10)+ ', 95%, 53%)'
                    'background-color':'hsl(' + (353+newElIndex*Math.min(70/elCount,10)) + ',95%,' + (newElIndex==0 ? '48%':'53%') + ')'
                });
                // $(self.pinchViewInst.get('el')).insertAfter($($(self.get('el')).all('li.item').get(0)));
                // // S.log(2)
                // // S.log(self.pinchViewInst.get('el'))
                self.pinchViewInst.get('el').insertAfter(el.all('li')[newElIndex - 1]);
                // $(self.get('el')).append(self.pinchViewInst.get('el'))
                // // S.log(3)
                self.startPos1 = {
                    x:e.touches[0].pageX,
                    y:e.touches[0].pageY
                };
                self.startPos2 = {
                    x:e.touches[1].pageX,
                    y:e.touches[1].pageY
                }
                // // S.log(4)
                self.startDistX = self.curDistX = Math.abs(self.startPos1.x - self.startPos2.x);
                self.startDistY = self.curDistY = Math.abs(self.startPos1.y - self.startPos2.y);
                self.curPos1 = {
                    x:e.touches[0].pageX,
                    y:e.touches[0].pageY
                };
                self.curPos2 = {
                    x:e.touches[1].pageX,
                    y:e.touches[1].pageY
                }
                // // S.log(5)
                ev.halt();
            // }catch(ex){}
            }).on('touchmove',function(ev){
                // try{
                var e = ev.originalEvent;
                // S.log('movestart');
                // S.log(e.touches.length);

                //handle one finger grag
                if(e.touches && e.touches.length===1 && self.__dragging === true){
                    self.curWinScrollTop = $(window).scrollTop();
                    self.curPos1 = {
                        x:e.touches[0].pageX,
                        y:e.touches[0].pageY
                    };
                    var dy = self.curPos1.y - self.startPos1.y;
                    var dx = self.curPos1.x - self.startPos1.x;
                    var dH = 0;
                    if(self.curWinScrollTop <= 0){
                        dH = dy - ( self.startWinScrollTop - self.curWinScrollTop);
                        // S.log('dH:' + dH);
                        if(dH>0){
                            ev.halt();
                            self.__setTopPinchViewHeight(dH);
                        }else{
                        }
                        
                        S.log('dx'+dx)
                        S.log('dy'+dy)
                        S.log('dH'+dH)
                        S.log(self.curWinScrollTop)
                        
                    }
                }

                if(!e.touches || e.touches.length!==2){
                    return;
                }
                // // S.log(4)
                self.curPos1 = {
                    x:e.touches[0].pageX,
                    y:e.touches[0].pageY
                };
                self.curPos2 = {
                    x:e.touches[1].pageX,
                    y:e.touches[1].pageY
                }

                self.curDistX = Math.abs(self.curPos1.x - self.curPos2.x);
                self.curDistY = Math.abs(self.curPos1.y - self.curPos2.y);
                var scaleX = self.curDistX - self.startDistX;
                var scaleY = self.curDistY - self.startDistY;
                if(scaleY > 0){
                    if(self.pinchViewInst){
                        self.pinchViewInst.set('height',scaleY)
                    }
                }
                // S.log('moveend')
            // }catch(ex){}
            }).on('touchend',function(ev){
                // alert(1)
                // try{
                // S.log('endstart')
                var e = ev.originalEvent;
                // S.log(e.touches.length)
                // length === 1 means touches changes from 2 to 1

                if(e.touches && e.touches.length ===0){
                    self.__dragging = false;
                    // if(self.topPinchViewInst){
                    //     var topPinchEl = self.topPinchViewInst.get('el');

                    //     self.topPinchViewInst.destroy();
                    //     self.topPinchViewInst = null;
                    // }
                }

                // if(!e.touches || e.touches.length!==1){
                //     return;
                // }
                // S.log('end1')
                if(e.touches.length === 1){
                    self.__pinching = false;
                }
                var curPinchViewInst = self.pinchViewInst || self.topPinchViewInst;
                if(curPinchViewInst){
                    var curPinchEl = curPinchViewInst.get('el');
                    if(curPinchViewInst.get('height') >= 60){
                        var newItemViewInst = new ItemView().render({
                            value:'我是一个新条目！'
                        }, curPinchEl, {
                            'background-color':self.getColorOfIndex(self._newElIndex, self.get('el').all('li').length)
                        });
                        newItemEl = newItemViewInst.get('el');
                        // newItemEl.hide();
                        // newItemEl.insertAfter(curPinchEl);
                        self.editItem(newItemEl.all('span.text'));                        
                    }

                    curPinchViewInst.destroy(function(){

                        self.refreshColor();
                        
                        // console.log(newItemViewInst.get('el').all('span.text').text())
                        // newItemEl.show();
                    });
                    self.pinchViewInst = null;
                    self.topPinchViewInst = null;
                    
                }
                // S.log('endend')
            // }catch(ex){}
            });
            return self;
        },
        add:function(data) {
            var self = this;
            if(S.isArray(data)){
                S.each(data,function(oneData){
                    var newItemView = new ItemView().render(oneData);
                    $(self.get('el')).append(newItemView.get('el'));
                    newItemView.set('parentNode',$(self.get('el')));
                })
            }else if(S.isObject(data)){
                    var newItemView = new ItemView().render(data);
                    $(self.get('el')).append(newItemView.get('el'));
                    newItemView.set('parentNode',$(self.get('el')));                
            }
            self.refreshColor();
        },
        destroy:function() {
            this.get("el").remove();
        },
        edit:function(ev){
            this.editItem(ev.currentTarget);
        },
        editItem:function(itemEl){
            var self = this;

            // $(ev.currentTarget).fire('editstart');
            var textEl = $(itemEl),
                inputEl = $(itemEl).parent('div.itembody').all('input');
            inputEl.val(textEl.text()).show().getDOMNode().focus();
            var parentLiEl = $(itemEl).parent('li');
            var listElLiChildren = self.get('el').all('li');
            listElLiChildren.addClass('intransition-medium');
            parentLiEl.removeClass('intransition-medium');
            S.later(function(){
                listElLiChildren.addClass('half-transparent');
                parentLiEl.removeClass('half-transparent');
            },25)
                // inputEl = $(editInputElTpl.render({value:textEl.text()}));
            // textEl.parent('div.itembody').append(inputEl);
            textEl.hide();
            // inputEl.val(textEl.text()).show().getDOMNode().focus();
        },
        endEdit:function(ev){
            // // S.log(ev);
            var self = this,
                // el = self.get('el'),
                inputEl = $(ev.currentTarget),
                textEl = $(inputEl).parent('li.item').all('span.text');
            textEl.show();
            textEl.text(inputEl.val());
                // inputEl = el.all('input');
            // self.fire('editend');
            // inputEl.hide()
            // alert($(inputEl).parent('li.item').html())
            inputEl.detach('blur');
            // // S.log(inputEl && inputEl.getDOMNode())
            inputEl.hide();
            self.get('el').all('li').removeClass('half-transparent');
        },
        onSwipe:function(ev){

        },
        refreshColor:function(){
            var self = this;
            var allEl = self.get('el').all('li');
            var totalLength = allEl.length;
            console.log(totalLength)
            S.each(allEl ,function(oneItem, i){
                var colorStr = self.getColorOfIndex(i, totalLength);
                // console.log(colorStr)
                $(oneItem).all('.vpart').style('background-color', colorStr);
                // $(oneItem).all('.transform-item').style('background-color', colorStr);
            })            
        },
        getColorOfIndex:function(index, length){
            return 'hsl(' + (353+index*Math.min(70/length,10)) + ',95%,' + (index==0 ? '48%':'53%') + ')';
        }
    },{
        ATTRS:{
             events:{
                value:{
                    'span.text':{
                        "click":"edit"
                    },
                    'input':{
                        'blur':'endEdit'
                    },
                    '.item':{
                        'swipe':'onSwipe'
                    }
                }
            }
        }
    });

    return ListView;	
}, {
    requires:['node','template','mvc','mods/itemview','mods/pinchitemview', 'mods/toppinchitemview', 'mods/global','./listview.css']
})

KISSY.add("main", function() {
}, {requires:["mods/listview"]});
KISSY.config({map:[[/(.+)-min\.(.+)?$/, "$1.$2"]], packages:[{name:"mods", tag:"20110515", path:"./", charset:"utf-8"}]});
KISSY.use("mods/listview", function(S, ListView) {
  var S = KISSY;
  var $ = S.all;
  var view = (new ListView({el:"#container"})).render();
  view.add([{value:"Full html5 clear demo"}, {value:"drag down or"}, {value:"pinch apart to add"}])
});


