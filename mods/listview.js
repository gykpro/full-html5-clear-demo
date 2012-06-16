KISSY.add('mods/listview',function(S, Node, Template, mvc, ItemView, PinchItemView, TopPinchView){
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
                self.__pinching = true;
                self.__dragging = false;
                // // S.log(1)
                self.pinchViewInst = new PinchItemView().render();
                // $(self.pinchViewInst.get('el')).insertAfter($($(self.get('el')).all('li.item').get(0)));
                // // S.log(2)
                // // S.log(self.pinchViewInst.get('el'))
                $(self.get('el')).append(self.pinchViewInst.get('el'))
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
                            if(!self.topPinchViewInst){
                                self.topPinchViewInst = new TopPinchView().render();
                                self.topPinchViewInst.get('el').prependTo(self.get('el'));

                            }
                            self.topPinchViewInst.set('height',dH);
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
                    if(self.topPinchViewInst){
                        self.topPinchViewInst.destroy();
                        self.topPinchViewInst = null;
                    }
                }

                // if(!e.touches || e.touches.length!==1){
                //     return;
                // }
                // S.log('end1')
                if(e.touches.length === 1){
                    self.__pinching = false;
                }
                if(self.pinchViewInst){
                    self.pinchViewInst.destroy();
                    self.pinchViewInst = null;
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
        },
        destroy:function() {
            this.get("el").remove();
        },
        editItem:function(ev){
            var self = this;
            // // S.log(ev);
            // $(ev.currentTarget).fire('editstart');
            var textEl = $(ev && ev.currentTarget),
                inputEl = $(editInputElTpl.render({value:textEl.text()}));
            textEl.parent('li.item').append(inputEl);
            textEl.hide();
            inputEl.val(textEl.text()).show().getDOMNode().focus();
        },
        endEdit:function(ev){
            // // S.log(ev);
            var self = this,
                // el = self.get('el'),
                inputEl = $(ev.currentTarget),
                textEl = $(inputEl).parent('li.item').all('span.text');
                // inputEl = el.all('input');
            // self.fire('editend');
            inputEl.hide()
            textEl.text(inputEl.val()).show();
            inputEl.detach('blur');
            // // S.log(inputEl && inputEl.getDOMNode())
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
    requires:['node','template','mvc','mods/itemview','mods/pinchitemview', 'mods/toppinchitemview', 'mods/global','./listview.css']
})