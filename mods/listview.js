KISSY.add('mods/listview',function(S, Node, Template, mvc, ItemView){
	var $=Node.all;

	// var ItemViewTpl = Template('<li class="item">{{value}}</li>' );
    var editInputElTpl = Template('<input type="text" value="{{value}}"/>');
	function ListView(el){
		var self = this;
        ListView.superclass.constructor.apply(self, arguments);
        // self.set('el',el);
	}
    S.extend(ListView, mvc.View, {
        add:function(data) {
            var self = this;
            var newItemView = new ItemView().render(data);
            $(self.get('el')).append(newItemView.get('el'));
            newItemView.set('parentNode',$(self.get('el')));
        },
        destroy:function() {
            this.get("el").remove();
        },
        editItem:function(ev){
            var self = this;
            // console.log(ev);
            // $(ev.currentTarget).fire('editstart');
            var textEl = $(ev && ev.currentTarget),
                inputEl = $(editInputElTpl.render({value:textEl.text()}));
            textEl.parent('li.item').append(inputEl);
            textEl.hide();
            inputEl.val(textEl.text()).show().getDOMNode().focus();
        },
        endEdit:function(ev){
            // console.log(ev);
            var self = this,
                // el = self.get('el'),
                inputEl = $(ev.currentTarget),
                textEl = $(inputEl).parent('li.item').all('span.text');
                // inputEl = el.all('input');
            // self.fire('editend');
            inputEl.hide()
            textEl.text(inputEl.val()).show();
            inputEl.detach('blur');
            // console.log(inputEl && inputEl.getDOMNode())
            inputEl.remove();
        },
        onSwipe:function(ev){

        }
    },{
        ATTRS:{
             events:{
                value:{
                    'span.text':{
                        "click":"editItem"
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
    requires:['node','template','mvc','mods/itemview','mods/global']
})