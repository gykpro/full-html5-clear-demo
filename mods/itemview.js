KISSY.add('mods/itemview',function(S, Node, Template, mvc, Anim){
	var $=Node.all;

    // var ItemViewTpl = Template('<li class="item"><span class="text">{{value}}</span><input type="text" value="{{value}}" style="display:none;"></li>' );
	var ItemViewTpl = Template('<li class="item"><div class="itembody"><span class="icon-finish"></span><span class="text">{{value}}</span><input type="text" value=""/><span class="icon-delete"></span></div></li>' );

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
                el.style(cstyle)
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