KISSY.add('mods/listview',function(S, Node, Template, mvc, ItemView){
	var $=Node.all;

	// var ItemViewTpl = Template('<li class="item">{{value}}</li>' );

	function ListView(el){
		var self = this;
        ListView.superclass.constructor.apply(self, arguments);
        self.set('el',el);
	}
    S.extend(ListView, mvc.View, {
        add:function(data) {
            var self = this;
            $(self.get('el')).append(new ItemView().render(data,self.get('el')).get('el'));
        },
        destroy:function() {
            this.get("el").remove();
        }
    },{
        ATTRS:{
            
        }
    });

    return ListView;	
}, {
    requires:['node','template','mvc','mods/itemview']
})