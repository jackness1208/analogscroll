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
        back: '#vTopBtn'
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
|back|{string/object}|否|控制滚动条向左/上 移动的按钮|

## 返回对象
```javascript
var iScroll = analogscroll(target, options);
```
### iScroll 参数说明
|参数|类型|说明|
|----|----|----|
|resize|{function}|滚动条区域大小重新计算|
|back|{function}|控制滚动条向左/上移动|
|forward|{function}|控制滚动条向右/下移动|
