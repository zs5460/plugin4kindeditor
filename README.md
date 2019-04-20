# plugin4kindeditor

## 说明
kindeditor是我最喜欢的可视化编辑器，不过缺少“自动排版”和“查找替换”功能，于是抽空做了这个插件，喜欢的话就拿去用吧。

## 使用方法

在页面引入css
```html
<link rel="stylesheet" href="plugin.css" />
```

在页面引用插件JS
```html
<script src="plugin.js"></script>
```
初始化
```javascript
var options = {
    items : ['source', '|', 'autoFormat', 'findReplace', 'about']
};

var editor;
KindEditor.ready(function(K) {
    editor = KindEditor.create('#demo', options);
});
```

## License
Licensed under The MIT License

