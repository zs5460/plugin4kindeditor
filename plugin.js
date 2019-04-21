/*******************************************************************************
* 自动排版插件 for KindEditor
* @author zs5460 <zs5460@gmail.com>
*******************************************************************************/
KindEditor.plugin('autoFormat', function (K) {
    var editor = this, name = 'autoFormat';
    editor.clickToolbar(name, function () {
        var txt = editor.text();
        txt = txt.replace(/<img/ig, '\n<img');
        txt = txt.replace(/&emsp;/ig, "");
        txt = txt.replace(/  |　　/ig, "");
        txt = txt.replace(/\r\n/ig, "\n");
        txt = txt.replace(/\t/ig, "");
        txt = txt.replace(/\n\n+/ig, "\n");
        txt = txt.replace(/\s+\n/ig, "\n");
        txt = txt.replace(/\n/ig, "<br />");
        var lines = txt.split("<br />");
        txt = '';
        var afterimg = false;
        for (var i = 0, j = lines.length; i < j; i++) {
            if (lines[i].substring(0, 4) === '<img') {
                txt += '<p align="center">' + lines[i] + '</p>';
                afterimg = true;
            } else if (lines[i] === '') {
                continue;
            } else if (lines[i].substring(0, 10) === '[NextPage]') {
                txt += '<br>' + lines[i] + '<br>';
            } else {
                if (afterimg) {
                    txt += '<p align="center" class="imgcaption">' + lines[i] + '</p>';
                    afterimg = false;
                }
                else {
                    txt += '<p>　　' + lines[i] + '</p>';
                }
            }
        }
        editor.html(txt);

    });

});

/*******************************************************************************
* 查找替换插件 for KindEditor
* @author zs5460 <zs5460@gmail.com>
*******************************************************************************/
KindEditor.plugin('findReplace', function (K) {
    var self = this, name = 'findReplace';

    self.clickToolbar(name, function () {
        var lang = self.lang(name + '.'),
            html = ['<div style="padding:10px 20px;">',
                '<div class="ke-dialog-row">',
                '<label >查找</label>',
                '<input class="ke-input-text" type="text" id="strA" name="strA" value="" style="width:200px;" /><br /><br />',
                '<label >替换</label>',
                '<input class="ke-input-text" type="text" id="strB" name="strB" value="" style="width:200px;" /><br /><br />',
                '<input type="button" name="find" value="查找" /> ',
                '<input type="button" name="findreplace" value="查找替换" /> ',
                '<input type="button" name="replaceall" value="替换所有" /> ',
                '</div>',
                '</div>'].join('');

        dialog = self.createDialog({
            name: name,
            width: 300,
            title: self.lang(name),
            body: html

        }),
            div = dialog.div,
            findBtn = K('[name="find"]', div),
            findreplaceBtn = K('[name="findreplace"]', div),
            replaceallBtn = K('[name="replaceall"]', div),
            input = K('input', dialog.div);

        var cw = K('.ke-edit-iframe')[0].contentWindow;
        var cwt = cw.document;
        var fc;
        var dC;
        if (K.IE) {
            if (cwt.selection.type == "Control") {
                dC = cwt.body.createTextRange();
                dC.collapse(true);
            } else {
                dC = cwt.selection.createRange();
            }
        }
        function check() {
            if (K("#strA").val().length < 1) {
                alert('请输入要查找的字符串');
                return false;
            } else {
                return true;
            }
        };
        // find
        function _find() {
            if (!check()) {
                return;
            }
            var findword = K("#strA").val();
            if (K.IE) {
                dC.collapse(false);
                if (dC.findText(findword, 1000000000, 0)) {
                    dC.select();
                    //C.Release();
                    //C.Save(true);
                } else {
                    var qr = confirm('重新搜？');
                    if (qr) {
                        dC.expand("textedit");
                        dC.collapse();
                        dC.select();
                        _find();
                    }
                }
            } else {
                if (dC) {
                    fc = cw.getSelection();
                    if (fc.rangeCount > 0) {
                        fc.removeAllRanges();
                    }
                    fc.addRange(dC);
                }
                var matchcase = false;
                var matchword = false;
                if (cw.find(findword, matchcase, false, false, matchword)) {
                    fc = cw.getSelection();
                    dC = fc.getRangeAt(0);
                } else {
                    var qr = confirm('重新搜索？');
                    if (qr) {
                        if (fc) {
                            dC = null;
                            fc.removeAllRanges();
                        }
                        _find();
                    }
                }
            }
        };

        // find replace
        function _findreplace() {
            if (!check()) {
                return;
            }
            var replacewith = K("#strB").val();
            if (K.IE) {
                if (dC.text != '') {
                    dC.text = replacewith;
                }
            } else {
                if (dC) {
                    dC.deleteContents();
                    if (replacewith != '') {
                        var n = cwt.createTextNode(replacewith);
                        dC.insertNode(n);
                        dC.selectNode(n);
                        dC.collapse(false);
                    }
                }
            }
            _find();
        };

        // replace all
        function _replaceall() {
            if (!check()) {
                return;
            }
            var findword = K("#strA").val();
            var replacewith = K("#strB").val();
            var count = 0;
            var msg = "";
            if (K.IE) {
                dC.expand("textedit");
                dC.collapse();
                dC.select();
                while (dC.findText(findword, 1000000000, 0)) {
                    dC.select();
                    dC.text = replacewith;
                    count++;
                }
            } else {
                var matchcase = false;
                var matchword = false;
                fc = cw.getSelection();
                fc.removeAllRanges();
                while (cw.find(findword, matchcase, false, false, matchword)) {
                    fc = cw.getSelection();
                    dC = fc.getRangeAt(0);
                    dC.deleteContents();
                    if (replacewith != "") {
                        var n = cwt.createTextNode(replacewith);
                        dC.insertNode(n);
                        dC.selectNode(n);
                        dC.collapse(false);
                    }
                    fc.removeAllRanges();
                    fc.addRange(dC);
                    count++;
                }
            }
            if (count == 0) {
                msg = '未找到';
            } else {
                msg = count + " 项替换完成";
            }
            alert(msg);
        };

        findBtn.click(function (e) {
            _find();
        });

        findreplaceBtn.click(function (e) {
            _findreplace();
        });

        replaceallBtn.click(function (e) {
            _replaceall();
        });




        input[0].focus();
    });
});


KindEditor.lang({
    autoFormat: '自动排版',
    findReplace: '查找替换'
});

