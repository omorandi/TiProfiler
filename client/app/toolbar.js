var tiprofiler = tiprofiler || {};

(function() {

    var StartStopButton = function() {
        var onItemToggle = function(item, pressed){
            if (pressed) {
                tiprofiler.app.fireEvent('profiler:shouldStart');
            }
            else {
                tiprofiler.app.fireEvent('profiler:shouldStop');
            }

        };

        this.view =  Ext.create('Ext.button.Button', {
            id: 'start_stop_btn',
            text: 'Start profiler',
            enableToggle: true,
            toggleHandler: onItemToggle,
            pressed: false
        });
    };

    StartStopButton.prototype._setPressed = function(value, suppressEvent) {
        this.view.toggle(value, suppressEvent);
    };

    StartStopButton.prototype._setText = function(value) {
        this.view.setText(value);
    };


    StartStopButton.prototype.setNormal = function() {
        this._setPressed(false, true);
        this._setText('Start Profiler');
    };

    StartStopButton.prototype.setPressed = function() {
        this._setPressed(true, true);
        this._setText('Stop Profiler');
    };

    

    tiprofiler.createToolbar = function() {
        var button = new StartStopButton();
        var tb = Ext.create('Ext.toolbar.Toolbar');
        tb.add(
            '-',
            button.view,
            '-'
        );

        tb.startStopButton = button;
        return tb;
    };

}());