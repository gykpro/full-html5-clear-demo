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