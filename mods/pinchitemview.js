KISSY.add('mods/pinchitemview',function(S, Node, Template, mvc, Anim, Global){
	var $=Node.all;

	var pinchItemViewTpl = Template(
	'<li class="pinch-item">' + 
    '   <div class="pinch-wrapper">'+
'			<div class="transform-item upper-item">' + 
'				<span>Pinch apart to create new item</span>' + 
'			</div>' + 
'			<div class="transform-item bottom-item">' + 
'				<span>Pinch apart to create new item</span>' + 
'			</div>' + 
'       </div>'+
'	</li>' );
    // console.log(Global.cssConfig.perspective)
	function PinchItemView(){
		var self = this;
        PinchItemView.superclass.constructor.apply(self, arguments);
	}
    S.extend(PinchItemView, mvc.View, {
        render:function() {
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
            // console.log('trans start');
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
                el.height(defHeight).all('.pinch-wrapper').height(defHeight).style('margin', Math.floor(heightByPx - defHeight) + 'px 0');
            }else{
                deg = Math.floor((Math.acos(heightByPx/defHeight)/Math.PI) * 180);
                el.height(heightByPx).all('.pinch-wrapper').height(heightByPx).style('margin','0')
            }
            // el.css('height',heightByPx);
            // Y.log(upper.css('-webkit-transform'))
            // upper.css('-webkit-transform','perspective(600) rotateX(-'+ deg +'deg)')
            // bottom.css('-webkit-transform','perspective(600) rotateX('+ deg +'deg)')
            upper.css('-webkit-transform','rotateX(-'+ deg +'deg)')
            bottom.css('-webkit-transform','rotateX('+ deg +'deg)')
            // console.log('transend')
        },

        destroy:function() {
            var self = this;
            console.log('destroy start')
            var duration = (self.get('height')/self.get('defHeight')) * 300;
            var timer = S.later(function(){
                var height = self.get('height');
                height-=5;
                if(height<=0){
                    height = 0;
                    self.set('height',0);
                    $(self.get("el")).remove();
                    timer.cancel();
                }else{
                    self.set('height',height);
                }
            }, 1, true);
            console.log('destroy end')
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