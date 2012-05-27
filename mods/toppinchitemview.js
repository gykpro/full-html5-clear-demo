KISSY.add('mods/toppinchitemview',function(S, Node, Template, mvc, Anim, PinchItemView, Global){
	var $=Node.all;

	var topPinchItemViewTpl = Template(
	'<li class="pinch-item">' + 
'			<div class="transform-item  top-pinch-item">' + 
'				<span>Drag down to create new item</span>' + 
'			</div>' + 
'		</li>' );
    // console.log(Global.cssConfig.perspective)
	function TopPinchItemView(){
		var self = this;
        TopPinchItemView.superclass.constructor.apply(self, arguments);
	}
    S.extend(TopPinchItemView, PinchItemView, {
        render:function() {
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
            	deg = Math.floor((Math.acos(heightByPx/defHeight)/Math.PI) * 180);
            el.css('height',heightByPx);
            // Y.log(upper.css('-webkit-transform'))
            // upper.css('-webkit-transform','perspective(600) rotateX(-'+ deg +'deg)')
            // bottom.css('-webkit-transform','perspective(600) rotateX('+ deg +'deg)')
            // upper.css('-webkit-transform','rotateX(-'+ deg +'deg)')
            itemEl.css('-webkit-transform','rotateX('+ deg +'deg)')
        },

        destroy:function() {
            this.get("el").remove();
        }
    },{
        ATTRS:{
            height:{
                setter:function(heightByPx){
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