# plugin4kindeditor

## Description
Kindeditor is my favorite visual editor, but lacks the "automatic typesetting" and "find and replace" functions, so I took the time to make this plugin, if you like it, use it.

## Instructions

Introducing css on the page
```html
<link rel="stylesheet" href="plugin.css" />
```

Reference plugin JS on the page
```html
<script src="plugin.js"></script>
```
Initialization
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

