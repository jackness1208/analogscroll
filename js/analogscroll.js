!function($, window, document, undefined){
    var
        options = {
            // 方向 x|y
            direction: 'y',
            // 滚动条区域
            scrollbar: undefined,
            //滚动条滑块一次点击的移动距离
            distance: 20,
            // 向下/右 滚按钮
            forward: undefined,
            // 向上/左 滚按钮
            back: undefined
        },
        fn = {
            preventDefault: function(e){
                e = e || window.event; 
                e.preventDefault && e.preventDefault();
                e.returnValue = false;
            },
            stopBubble: function(e){
                e = e || window.event; 
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
            },
            selection: {
                enable: function(){
                    document.onselectstart = null;
                },
                disable: function(){
                    document.onselectstart = function(){
                        return false;
                    }
                    window.getSelection
                        ? window.getSelection().removeAllRanges()
                        : document.selection.empty()
                        ;
                }
            },
            getPosition: function(target){var contentDocument = document; arguments[2]? contentDocument = arguments[2]:""; var _x = target.offsetLeft; var _y = target.offsetTop; if($(target).css("position") == "fixed"){_x += contentDocument.documentElement.scrollLeft||contentDocument.body.scrollLeft; _y += contentDocument.documentElement.scrollTop||contentDocument.body.scrollTop; } while(target = target.offsetParent){_x += target.offsetLeft||0; _y += target.offsetTop||0; } return{left:_x, top:_y } }
            
        };

    var analogscroll = function(target, op){
        return new analogscroll.fn.init(target, op);
    };

    analogscroll.fn = analogscroll.prototype = {
        op: {},

        el: {
            target: undefined,
            scrollbar: undefined,
            bar: undefined
        },

        setting: {
            limitHeight: 0,
            scale: 1
        },
        attrs: [],
        resize: function(){
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = [];

            if( op.direction == "x" ){
                attrs = ["width","Width","left","Left"];

            } else {
                attrs = ["height","Height","top","Top"];
            };

            var seOffset = el.target["offset" + attrs[1]],
                seScroll = el.target["scroll" + attrs[1]],
                sbOffset = el.scrollbar["offset" + attrs[1]];

            //可视区域与区域总长之间的比例
            setting.scale = 0;

            seOffset >= seScroll
                ? setting.scale = 1 
                : setting.scale = seOffset / seScroll
                ;


            //区域与滚动条之间的比例
            setting.b2eScale = sbOffset / seScroll;

            el.bar.style[attrs[0]] = sbOffset * setting.scale + "px";
            el.bar.style[attrs[2]] = el.target["scroll" + attrs[3]] * setting.b2eScale + "px";
        },
        mapping: function(){
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = she.attrs;


            var nowPostion = parseFloat(el.bar.style[attrs[2]], 10);
			el.target["scroll" + attrs[3]] = nowPostion / setting.b2eScale;
        },
        back: function(){
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = she.attrs;

            var nowPosition = parseFloat(el.bar.style[attrs[2]], 10),
                myPosition,
                moveDistance = op.distance;


            nowPosition - moveDistance > 0
                ? myPosition =  nowPosition - moveDistance
                : myPosition = 0
                ;

            el.bar.style[attrs[2]] = myPosition + "px";
            she.mapping();
        },
        
        forward: function(){
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = she.attrs;

            var nowPosition = parseFloat(el.bar.style[attrs[2]]),
                myPosition,
                moveDistance = op.distance,
                scrollWidth = el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]];


            nowPosition + moveDistance < scrollWidth
                ? myPosition = nowPosition + moveDistance
                : myPosition = scrollWidth
                ;

            el.bar.style[attrs[2]] = myPosition + "px";
            she.mapping();
        }
    };

    var 
        init = analogscroll.fn.init = function(target, op){
            var 
                she = this,
                op = she.op = $.fn.extend(undefined, options, op),
                setting = she.setting,
                el = she.el = {
                    target: $(target)[0],
                    scrollbar: $(she.op.scrollbar)[0],
                    bar: $(she.op.scrollbar).children()[0],
                    back: $(she.op.back),
                    forward: $(she.op.forward)
                };

            if(!el.target || !el.scrollbar){
                return;
            }

            she.resize();

            //滚动条-mousemove事件
            var attrs = [],
                mouseEvt = {
                    // for scrollbar
                    down: function(e){
                        e = e || window.event;
                        fn.preventDefault(e);
                        fn.stopBubble(e);
                        setting.posX = e.clientX - this.offsetLeft;
                        setting.posY = e.clientY - this.offsetTop;

                        fn.selection.disable();


                        $(document).bind('mousemove', mouseEvt.move);
                        $(document).bind('mouseup', mouseEvt.up);
                    },
                    // for window
                    move: function(e){
                        e = e || window.event;
            
                        fn.preventDefault(e);
                        var nowPostion = e["client" + attrs[4]] - setting["pos" + attrs[4]],
                            scale = 0;

                        nowPostion < 0? nowPostion = 0:"";

                        nowPostion > (el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]])
                            ? nowPostion = (el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]])
                            : ""
                            ;

                        el.bar.style[attrs[2]] = nowPostion + "px";
                        she.mapping();
                    },
                    // for window
                    up: function(){
                        fn.selection.enable();
                        $(document).unbind('mousemove', mouseEvt.move);
                        $(document).unbind('mouseup', mouseEvt.up);
                    },
                    // content
                    wheel: function(e){
                        e = window.event;
                        setting.wheelKey = setTimeout(function(){
                            var myPosition = parseFloat(el.bar.style[attrs[2]], 10),
                                limitWidth = el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]],
                                moveDistance = op.distance,
                                data = e.wheelDelta || -e.detail;

                            data > 0? myPosition -= moveDistance : myPosition += moveDistance;
                            
                            if(myPosition < 0){ 
                                myPosition = 0;
                            } else if(myPosition > limitWidth){
                                myPosition = limitWidth;
                            };
                            el.bar.style[attrs[2]] = myPosition + "px";
                            she.mapping();
                        }, 10);
                        fn.preventDefault(e);
                        fn.stopBubble(e);
                        
                    }
                };

            if(op.direction == "x"){
                attrs = she.attrs = ["width","Width","left","Left","X"];
            } else {
                attrs = she.attrs = ["height","Height","top","Top","Y"];
                if("onmousewheel" in el.target){
                    $(el.target).bind('mousewheel', mouseEvt.wheel);

                } else {
                    $(el.target).bind('DOMMouseScroll', mouseEvt.wheel);

                }
            };

            //滚动条滑块初始化
            el.bar.style[attrs[2]] = 0;

            $(el.scrollbar).bind('mousedown', function(e){
                var self = this;

                e = e || window.event;
                fn.preventDefault(e);
                fn.stopBubble(e);
                fn.selection.disable();

                setting.posX = e.clientX - self.offsetLeft;
                setting.posY = e.clientY - self.offsetTop;


                $(document).bind("mouseup", function up(e){
                    clearTimeout(setting.downKey);
                    fn.selection.enable();
                    $(document).unbind('mouseup', up);
                });

                var distance = op.distance;
                barWidth = el.bar["offset" + attrs[1]];

                var myPosition;
                setting.mousePosition = e["client" + attrs[4]] + (document.documentElement["scroll" + attrs[3]] || document.body["scroll" + attrs[3]]) - fn.getPosition(this)[attrs[2]];


                !function move(){
                    clearTimeout(setting.downKey);

                    var barPosition = parseFloat(el.bar.style[attrs[2]], 10),
                        mousePosition = setting.mousePosition;

                    if(mousePosition < barPosition){
                        she.back();

                    } else if( mousePosition > barPosition + barWidth){
                        she.forward();

                    } else {
                        return;

                    };

                    setting.downKey = setTimeout( move, 50);
                }();
            });

            $(el.bar).bind('mousedown', mouseEvt.down);

            $(el.forward).bind('mousedown', function(e){
                e = e || window.event;
                clearTimeout(setting.downKey);
                fn.preventDefault(e);

                $(document).bind("mouseup", function up(){
                    clearTimeout(setting.downKey);
                    $(document).unbind('mouseup',up);
                });

                !function move(){
                    she.forward();
                    setting.downKey = setTimeout(move,50);
                }();
            });

            $(el.back).bind('mousedown', function(e){
                e = e || window.event;
                clearTimeout(setting.downKey);
                fn.preventDefault(e);

                $(document).bind("mouseup", function up(){
                    clearTimeout(setting.downKey);
                    $(document).unbind('mouseup',up);
                });

                !function move(){
                    she.back();
                    setting.downKey = setTimeout(move,50);
                }();
            });

            return this;
        };

    init.prototype = analogscroll.fn;


    if(typeof define != 'undefined' && defined.amd){
        define([], function(){
            return analogscroll;
        });

    } else {
        window.analogscroll = analogscroll;
    }
}(jQuery, window, document);
