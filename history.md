# 更新记录
## 2.5.1 - 2017-12-27
* [FIX] 修复 滚动组件在 firefox 情况下 会出现 系统 默认滚动条 和 模拟滚动条 2个 的问题
* [FIX] 暂时 取消 IE 下 `bubble`, `bubbleTarget` 参数设置

## 2.5.0 - 2017-12-20
* [FIX] 修复 组件 `onscroll(scrollTop, direction)` 中 `direction` 在用鼠标滚动时始终为 `0` 的问题
* [FIX] 修复 组件 在同一个模块同时绑定横向和纵向滚动条时，ui显示会出现系统纵向滚动条 的问题
* [EDIT] 更加精确地计算滚动条宽度 `cnt.scrollWidth - cnt.offsetWidth`
* [ADD] 新增 参数 `bubble`, `bubbleTarget` 用来设置 组件滚动是否触发 滚动冒泡, 默认为 `true`

## 2.4.0 - 2017-12-12
* [EDIT] 增加 `module.exports` 模式支持

## 2.3.3 - 2017-09-06
* [FIX] 修复 滚动组件使用 scrollTo 方法时如数值超标会导致滚动条超出 滚动框范围问题

## 2.3.2 - 2017-06-13
* [FIX] 修复 滚动组件会让页面本来元素 多出 barwidth 那么多的 padding 问题

## 2.3.1 - 2017-06-12
* [FIX] 修复 options.onresize 会返回奇怪的 比例问题 如 (0.99531125442)

## 2.3.0 - 2016-12-07
* [EDIT] 将模拟滚动条展现形式改成 真实滚动条 + 遮盖 + 模拟滑块实现

## 2.2.0 - 2016-12-07
* [ADD] 新增滚动内容刷新间隙会根据内容高度改变， 内容越长，滚动间隙约大

## 2.1.1 - 2016-11-28
* [FIX] 修复滚动组件在resize 时 如在最下方会出现 空白问题
* [FIX] 修复滚动组件初始化时 如内容小于 滚动层时能向上滚动问题

## 2.1.0 - 2016-11-28
* [EDIT] 针对图片长列表对组件做性能优化

## 2.0.0 - 2016-11-21
* [EDIT] 将组件从 通过 scrollTop/scrollLeft 方式模拟滚动条 改为性能更好的 通过 top/ left 方式改变内容位置
* [EDIT] 优化 mac 下糟糕的 滚动体验

## 1.4.2 - 2016-06-22
* [FIX] 修复 鼠标滚轮在 firefox 下不正常问题

## 1.4.1 - 2016-05-11
* [FIX] 修复 滚动时每次都触发 onend 事件 bug

## 1.4.0 - 2016-04-15
* [ADD] 添加 op.onscroll(scrollTop, direction) 中 direction 属性

## 1.3.2 - 2016-04-14
* [FIX] 修复 每次滚动鼠标滚轮 内容滚动距离 不等于 op.distance 问题
* [FIX] 当没有设置 op.onend op.onbegin 时 滚动条滚到最初| 最底之后 应触发执行父级的滚动

## 1.3.1 - 2016-04-05
* [EDIT] 调整代码
* [FIX] 修复 在 ie 浏览器 被 windows 组件遮挡时 无法出发 mouseup 事件 问题

## 1.3.0
* [ADD] 新增 op.onresize 事件，用于在组件每次初始化 滚动条高度的时候触发

## 1.2.4 - 2016-02-24
* [FIX] 修复 在ie11下滚动条区域滚动鼠标，滚动存在问题问题

## 1.2.3 - 2016-02-16
* [FIX] 修复 在滚动条区域滚动鼠标时，会触发页面滚动问题

## 1.2.2 - 2016-01-29
* [FIX] 修复 触发 iScroll.resize() 时， op.onscroll(scrollTop) scrollTop 数值不对问题

## 1.2.1 - 2016-01-29
* [FIX] 修复 firefox 下鼠标滚动内容区域没响应问题

## 1.2.0 - 2016-01-27
* [ADD]  op.onscroll    设置滚动条时触发的函数
* [ADD]  op.endDistance 设定 触发 onend 事件时距离 内容底部的距离
* [EDIT] op.onend       调整函数触发条件为 每次触发 onscroll 事件时， 达到内容底部or 设定的 endDistance 距离即触发

## 1.1.0 - 2016-01-08
* [ADD] op.transition 滚动动画过渡时长
* [ADD] op.onbegin 当滚动条移动至最左/上 时触发的函数
* [ADD] op.onend 当滚动条移动至最右/下 时触发的函数
* [ADD] iScroll.scrollTo(num) 滚动当前内容到指定位置

## 1.0.0 - 2016-01-06
* [ADD] 诞生
