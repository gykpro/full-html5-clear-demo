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