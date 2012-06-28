var tiprofiler = tiprofiler || {};
(function() {

	var NO_FILE_SELECTED_MSG = '/*\n\n\tno file selected\n\n*/';

	var Editor = function() {
		var self = this;
		self._editor = ace.edit("ace-editor");
        
        var JavaScriptMode = require("ace/mode/javascript").Mode;
        self._editor.getSession().setMode(new JavaScriptMode());
        self._editor.setTheme("ace/theme/tomorrow_night_blue");
        self._editor.setReadOnly(true);
        self._editor.setHighlightActiveLine(true);

	};

	Editor.prototype.updateFileInfo = function(info) {
		var self = this;
		if (!info || info.url === '') {
            self._editor.getSession().setValue(NO_FILE_SELECTED_MSG);
            return;
        }

        //treeGrid.setTitle('<code>'+ info.url + ':' + info.line + '</code>');
        
        try {
            Ext.Ajax.request({
                url : info.url,
                method: 'GET',
                success: function ( result, request ) {
                    self._editor.getSession().setValue(result.responseText);
                    self._editor.gotoLine(info.line);
                },
                failure: function ( result, request ) {
                    self._editor.getSession().setValue(NO_FILE_SELECTED_MSG);
                    alert('Something went wrong, can\'t open file');
                }
            });
        }
        catch (info) {
            self._editor.getSession().setValue(NO_FILE_SELECTED_MSG);
            alert('Something went wrong: ' + info.message);
        }
	};


    tiprofiler.createEditor = function() {
        return new Editor();
    };


}());