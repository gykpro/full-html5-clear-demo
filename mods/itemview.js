KISSY.add('mods/itemview',function(S, Node, Template, mvc, Anim){
	var $=Node.all;

	var ItemViewTpl = Template('<li class="item">{{value}}</li>' );

	function ItemView(){
		var self = this;
        ItemView.superclass.constructor.apply(self, arguments);
	}
    S.extend(ItemView, mvc.View, {
        render:function(data,parentNode) {
            var self = this;
            // if($(parentNode).length!==0){
            //     self.set('parentNode', $(parentNode));
            // }
            // self.get("el").addClass("note").attr("id", self.get("note").getId());
            // self.get("el").html(pinchItemViewTpl.render());
            var el = $(ItemViewTpl.render(data));
            // if(self.get('parentNode')){
            // 	el.appendTo(self.get('parentNode'));
            // }
            self.set('el',el);
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
    requires:['node','template','mvc']
})