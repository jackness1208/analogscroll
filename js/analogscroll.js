/**
 * Copyright 2016, jackness.org
 * Creator: Jackness Lau
 * $Author: Jackness Lau $
 * $Date: 2016.05.11 $
 * $Version: 1.4.1 $
 */
// 'use strict';
(function($, window, document, undefined){
    var
        options = {
            // 方向 x|y
            direction: 'y',
            // 滚动条区域
            scrollbar: undefined,
            // 滚动条滑块一次点击的移动距离
            distance: 20,
            // 向下/右 滚按钮
            forward: undefined,
            // 向上/左 滚按钮
            back: undefined,
            // 滚动动画过渡
            transition: 500,

            // 距离 底部多少像素时开始触发 onend
            endDistance: 40,

            onend: undefined,

            onbegin: undefined,

            onscroll: undefined,

            onresize: undefined

        },
        fn = {
            preventDefault: function(e){
                e = e || window.event; 
                if(e.preventDefault){
                    e.preventDefault();
                }
                e.returnValue = false;
            },
            stopBubble: function(e){
                e = e || window.event; 
                if(e.stopPropagation){
                    e.stopPropagation();
                }
                e.cancelBubble = true;
            },
            selection: {
                enable: function(){
                    document.onselectstart = null;
                },
                disable: function(){
                    document.onselectstart = function(){
                        return false;
                    };
                    if(window.getSelection){
                        window.getSelection().removeAllRanges();
                        
                    } else {
                        document.selection.empty();
                    }
                }
            },
            getPosition: function(target){
                var contentDocument = document; 
                if(arguments[2]){
                    contentDocument = arguments[2];
                }
                
                var _x = target.offsetLeft; 
                var _y = target.offsetTop; 
                if($(target).css("position") == "fixed"){
                    _x += contentDocument.documentElement.scrollLeft || contentDocument.body.scrollLeft; 
                    _y += contentDocument.documentElement.scrollTop || contentDocument.body.scrollTop; 
                } 
                target = target.offsetParent;
                while(target){
                    _x += target.offsetLeft || 0; 
                    _y += target.offsetTop || 0; 
                    target = target.offsetParent;
                } 
                return {
                    left:_x, 
                    top:_y 
                };
            },

            inertiaMotion: function(So,St,T){
                var sArray = [],
                    //摆动，惯性运动,利用的是sin 的特性,再用次方 加强幅度
                    swingHandle = function(){
                        var S = St - So;
                        
                        for(var i = 0, len = T; i < len; i++){
                            sArray[i] = parseInt(S * Math.pow(Math.sin(i/T*Math.PI/2),3)*100)/100 + So;
                        }

                    };

                swingHandle();

                return{
                    Sn:function(Tn){
                        return Tn > T? St : sArray[Tn];
                    }
                };
            }
            

        },
        // analogscroll 用 私有方法
        sf = {
            b2cMapping: function(ctrl){
                var 
                    she = ctrl,
                    el = she.el,
                    setting = she.setting,
                    attrs = she.attrs,

                    contentPrep = el.target["scroll" + attrs[3]],
                    nowPostion = parseFloat(el.bar.style[attrs[2]], 10);


                setting.contentNow = Math.ceil(nowPostion / setting.b2eScale);

                setting.direction = setting.contentNow - contentPrep;

                el.target["scroll" + attrs[3]] = setting.contentNow;

                sf.positionCheck(she);
            },
            c2bMapping: function(ctrl){
                var 
                    she = ctrl,
                    el = she.el,
                    setting = she.setting,
                    attrs = she.attrs,
                    nowPosition = setting.contentNow = el.target["scroll" + attrs[3]];

                el.bar.style[attrs[2]] = nowPosition * setting.b2eScale + 'px';

                sf.positionCheck(she);
            },

            positionCheck: function(ctrl){
                var she = ctrl,
                    op = she.op,
                    setting = she.setting,
                    isEnd = false,
                    isBegin = false;


                if(op.onscroll){
                    op.onscroll(setting.contentNow, setting.direction);
                }

                if(setting.contentNow + op.endDistance >= setting.contentLimit){
                    if(op.onend){
                        op.onend();
                    }

                    if(setting.contentNow >= setting.contentLimit){
                        isEnd = true;
                    }
                    
                } else if(setting.contentNow === 0){
                    if(op.onbegin){
                        op.onbegin();
                    }
                    isBegin = true;

                } else {

                }

                
                setting.isEnd = isEnd;
                setting.isBegin = isBegin;

                // var nowPosition = el.target["scroll" + attrs[3]];
                // el.bar.style[attr[2]] = nowPosition * nowPosition + 'px';
            }
        };

    var analogscroll = function(target, op){
        return new analogscroll.fn.init(target, op);
    };

    analogscroll.fn = {
        op: {},

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
            }

            var seOffset = el.target["offset" + attrs[1]],
                seScroll = el.target["scroll" + attrs[1]],
                sbOffset = el.scrollbar["offset" + attrs[1]];

            //可视区域与区域总长之间的比例
            setting.scale = 0;

            if(seOffset >= seScroll){
                setting.scale = 1;
            } else {
                setting.scale = seOffset / seScroll;
            }

            //区域与滚动条之间的比例
            setting.b2eScale = sbOffset / seScroll;

            setting.contentLimit = seScroll - seOffset;
            setting.contentNow = el.target["scroll" + attrs[3]];

            el.bar.style[attrs[0]] = sbOffset * setting.scale + "px";
            el.bar.style[attrs[2]] = setting.contentNow * setting.b2eScale + "px";


            if(op.onscroll){
                op.onscroll( setting.contentNow, setting.direction);
            }
            if(op.onresize){
                op.onresize(setting.b2eScale);
            }
        },
        
        back: function(){
            var she = this,
                op = she.op,
                el = she.el,
                attrs = she.attrs,
                So = el.target['scroll' + attrs[3]];


            she.scrollTo(So - op.distance, undefined, true);

            // var nowPosition = parseFloat(el.bar.style[attrs[2]], 10),
            //     myPosition,
            //     moveDistance = op.distance;


            // if(nowPosition - moveDistance > 0){
            //     myPosition =  nowPosition - moveDistance;
            // } else {
            //     myPosition = 0;
            // }

            // el.bar.style[attrs[2]] = myPosition + "px";
            // sf.b2cMapping(she);
        },
        
        forward: function(){
            var she = this,
                op = she.op,
                el = she.el,
                attrs = she.attrs,
                So = el.target['scroll' + attrs[3]];

            she.scrollTo(So + op.distance, undefined, true);

            // var nowPosition = parseFloat(el.bar.style[attrs[2]]),
            //     myPosition,
            //     moveDistance = op.distance,
            //     scrollWidth = el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]],



            // if(nowPosition + moveDistance < scrollWidth){
            //     myPosition = nowPosition + moveDistance;
            // } else {
            //     myPosition = scrollWidth;
            // }

            // el.bar.style[attrs[2]] = myPosition + "px";
            // sf.b2cMapping(she);
        },
        scrollTo: function(d, done, noAni){
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = she.attrs;

            if(d < 0){
                d = 0;
            }
            if(d > setting.contentLimit){
                d = setting.contentLimit;
            }
            
            var 
                interval = 20,
                T = op.transition / interval,
                Tn = 0,
                So = el.target['scroll' + attrs[3]],
                Sn = So,
                St = parseInt(d, 10),
                acc = fn.inertiaMotion(So, St, T);

            if(noAni){
                Tn = T;
            }



            clearTimeout(setting.scrollToKey);
            (function doit(){
                if(Tn < T){
                    setting.isAni = true;
                    Sn = acc.Sn(Tn);
                    el.target['scroll' + attrs[3]] = Sn;

                    setting.direction = Sn - So;

                    sf.c2bMapping(she);

                    Tn++;
                    setting.scrollToKey = setTimeout(doit, interval);

                } else {
                    setting.isAni = false;
                    el.target['scroll' + attrs[3]] = St;

                    if(el.target['scroll' + attrs[3]] != St){
                        setting.contentLimit = el.target['scroll' + attrs[1]];
                    }

                    setting.direction = St - So;

                    sf.c2bMapping(she);
                    if(done){
                        done();
                    }
                }
            })();
        }
        
    };

    var 
        init = analogscroll.fn.init = function(target, o){
            var 
                she = this,
                op = she.op = $.fn.extend(undefined, options, o),

                setting = she.setting = {
                    scale: 1,
                    // 内容区域 上限
                    contentLimit: 0,
                    // 内容区域 位置
                    contentNow: 0,
                    // 滚动条区域 上限
                    barLimit: 0,
                    // 滚动条区域 位置
                    barNow: 0,
                    // 是否处于开始位置
                    isBegin: true,
                    // 是否处于结束位置
                    isEnd: false,
                    // 当前滚动方向（距离）
                    direction: 0
                },
                
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
                        
                        if(setting.isAni){
                            return;
                        }

                        setting.posX = e.clientX - this.offsetLeft;
                        setting.posY = e.clientY - this.offsetTop;

                        fn.selection.disable();


                        $(document).bind('mousemove', mouseEvt.move);
                        $(document).bind('mouseup', mouseEvt.up);
                        $(window).bind('losecapture', mouseEvt.up);
                        $(window).bind('blur', mouseEvt.up);
                    },
                    // for window
                    move: function(e){
                        e = e || window.event;
            
                        fn.preventDefault(e);
                        if(setting.isAni){
                            return;
                        }
                        var nowPostion = e["client" + attrs[4]] - setting["pos" + attrs[4]];

                        if(nowPostion < 0){
                            nowPostion = 0;
                        }

                        if(nowPostion > (el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]])){
                            nowPostion = (el.scrollbar["offset" + attrs[1]] - el.bar["offset" + attrs[1]]);
                        }

                        el.bar.style[attrs[2]] = nowPostion + "px";
                        sf.b2cMapping(she);
                    },
                    // for window
                    up: function(){
                        fn.selection.enable();
                        $(document).unbind('mousemove', mouseEvt.move);
                        $(document).unbind('mouseup', mouseEvt.up);
                        $(window).unbind('losecapture', mouseEvt.up);
                        $(window).unbind('blur', mouseEvt.up);
                    },
                    // content
                    wheel: function(e){
                        var 
                            So = el.target['scroll' + attrs[3]],
                            data = e.originalEvent['wheelDelta' + attrs[4]] || 
                                    -e.originalEvent['delta' + attrs[4]] || 
                                    e.originalEvent.wheelDelta || 
                                    -e.originalEvent.delta;

                        clearTimeout(setting.wheelKey);
                        setting.wheelKey = setTimeout(function(){
                            if(setting.isAni){
                                return;
                            }
                            if(data > 0){
                                she.back();
                            } else {
                                she.forward();
                            }
                        }, 10);

                        if((setting.isBegin && data > 0 && !op.onbegin) || (setting.isEnd && data < 0 && !op.onend)){

                        } else {
                            fn.preventDefault(e);
                            fn.stopBubble(e);
                        }
                    }
                };

            if(op.direction == "x"){
                attrs = she.attrs = ["width","Width","left","Left","X"];
            } else {
                attrs = she.attrs = ["height","Height","top","Top","Y"];
                if("onmousewheel" in el.target){
                    $(el.target).bind('mousewheel', mouseEvt.wheel);
                    $(el.scrollbar).bind('mousewheel', mouseEvt.wheel);

                } else {
                    $(el.target).bind('DOMMouseScroll', mouseEvt.wheel);
                    $(el.scrollbar).bind('DOMMouseScroll', mouseEvt.wheel);

                }
            }

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


                $(document).bind("mouseup", function up(){
                    clearTimeout(setting.downKey);
                    fn.selection.enable();
                    $(document).unbind('mouseup', up);
                });

                var 
                    barWidth = el.bar["offset" + attrs[1]];

                setting.mousePosition = e["client" + attrs[4]] + (document.documentElement["scroll" + attrs[3]] || document.body["scroll" + attrs[3]]) - fn.getPosition(this)[attrs[2]];


                (function move(){
                    clearTimeout(setting.downKey);

                    var barPosition = parseFloat(el.bar.style[attrs[2]], 10),
                        mousePosition = setting.mousePosition;

                    if(mousePosition < barPosition){
                        she.back();

                    } else if( mousePosition > barPosition + barWidth){
                        she.forward();

                    } else {
                        return;

                    }

                    setting.downKey = setTimeout( move, 50);
                })();
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

                (function move(){
                    she.forward();
                    setting.downKey = setTimeout(move,50);
                })();
            });

            $(el.back).bind('mousedown', function(e){
                e = e || window.event;
                clearTimeout(setting.downKey);
                fn.preventDefault(e);

                $(document).bind("mouseup", function up(){
                    clearTimeout(setting.downKey);
                    $(document).unbind('mouseup',up);
                });

                (function move(){
                    she.back();
                    setting.downKey = setTimeout(move,50);
                })();
            });

            return this;
        };

    init.prototype = analogscroll.fn;


    if(typeof define != 'undefined' && define.amd){
        define([], function(){
            return analogscroll;
        });

    } else {
        window.analogscroll = analogscroll;
    }
})($, window, document);



