var tiprofiler = tiprofiler || {};
(function() {

    tiprofiler.createEditor = function() {
        var editor = ace.edit("ace-editor");
        var JavaScriptMode = require("ace/mode/javascript").Mode;
        editor.getSession().setMode(new JavaScriptMode());
        editor.setTheme("ace/theme/tomorrow_night_blue");
        editor.setReadOnly(true);
        editor.setHighlightActiveLine(true);
        return editor;
    };


}());