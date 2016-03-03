# analogscroll 模拟滚动 组件功能说明

## 组件对 UI 的要求：
* options.scrollbar 为滚动区域对象, 组件要求滚动区域内有且只有 1个 子级元素， 组件会将该子级元素认定为滚动条区域中的滑块
```html
<div class="scroll-area">
    <span class="bar"></span>
</div>
```
* target 为需要添加滚动条的主体内容, 需通过样式设置成 overflow: hidden， 组件才能正常渲染。
```html
<div class="main-area" style="overflow: hidden;">
    <div class="text-cnt">
    some text...
    </div>
</div>
```

## 使用方法
```javascript
var iScroll = analogscroll(
    '#list',
    {
        direction: 'x',
        distance: 20,
        scrollbar: '#vScrollbar',
        forward: '#vBottomBtn',
        back: '#vTopBtn',
        transition: 500,
        onbegin: function(){
            console.log('at bar top');
        },
        onend: function(){
            console.log('at bar foot');

        }
    }
);
```
## 参数说明
```javascript
analogscroll(target, options);
```
|参数|类型|是否必须|说明|
|----|----|--------|----|
|target|{string/object}|是|需要添加滚动条的主体内容|
|options|{object}|是|参数设置|

### options 参数属性说明

|参数|类型|是否必须|说明|
|----|----|--------|----|
|scrollbar|{string/object}|是|滚动区域对象|
|direction|{string}|否|滚动条方向。x 或者 y。默认值为 y|
|distance|{number}|否|鼠标滚轮每滚一下滑移动的距离。默认值为 20|
|forward|{string/object}|否|控制滚动条向右/下 移动的按钮|
|transition|{number}|否|滚动动画过渡时长，默认值为 500 ms|
|back|{string/object}|否|控制滚动条向左/上 移动的按钮|
|onbegin|{function}|否|当滚动条移动至最左/上 时触发的函数|
|onend|{function}|否|当滚动条移动至最右/下 时触发的函数|
|onscroll|{function}|否|当滚动条时触发的函数|
|endDistance|{Number}|否|设定 触发 onend 事件时距离 内容底部的距离, 默认为 0|
|onresize|{function}|否|设定 组件每次初始化 滚动条高度时回调函数|

## 返回对象
```javascript
var iScroll = analogscroll(target, options);
```
### iScroll 参数说明
|参数|类型|说明|
|----|----|----|
|resize()|{function}|滚动条区域大小重新计算|
|back()|{function}|控制滚动条向左/上移动|
|forward()|{function}|控制滚动条向右/下移动|
|scrollTo(num)|{function}|滚动当前内容到指定位置， 单位为 px|

## 例子
例子在[这里](http://www.jackness.org/lab/2016/analogscroll/demo/demo.html)

## 更新记录

### 1.3.0
* [ADD] 新增 op.onresize 事件，用于在组件每次初始化 滚动条高度的时候触发

### 1.2.4 - 2015-02-24
* [FIX] 修复 在ie11下滚动条区域滚动鼠标，滚动存在问题问题

### 1.2.3 - 2015-02-16
* [FIX] 修复 在滚动条区域滚动鼠标时，会触发页面滚动问题

### 1.2.2 - 2015-01-29
* [FIX] 修复 触发 iScroll.resize() 时， op.onscroll(scrollTop) scrollTop 数值不对问题

### 1.2.1 - 2015-01-29
* [FIX] 修复 firefox 下鼠标滚动内容区域没响应问题

### 1.2.0 - 2015-01-27
* [ADD]  op.onscroll    设置滚动条时触发的函数
* [ADD]  op.endDistance 设定 触发 onend 事件时距离 内容底部的距离
* [EDIT] op.onend       调整函数触发条件为 每次触发 onscroll 事件时， 达到内容底部or 设定的 endDistance 距离即触发

### 1.1.0 - 2015-01-08
* [ADD] op.transition 滚动动画过渡时长
* [ADD] op.onbegin 当滚动条移动至最左/上 时触发的函数
* [ADD] op.onend 当滚动条移动至最右/下 时触发的函数
* [ADD] iScroll.scrollTo(num) 滚动当前内容到指定位置

### 1.0.0 - 2015-01-06
* [ADD] 诞生
