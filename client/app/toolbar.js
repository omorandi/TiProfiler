var tiprofiler = tiprofiler || {};    

(function() {

    function onItemToggle(item, pressed){
        if (pressed) {
            item.setText('Stop profiler');
            tiprofiler.app.fireEvent('profiler:shouldStart');
        }
        else {
            item.setText('Start profiler');
            tiprofiler.app.fireEvent('profiler:shouldStop');
        }

    }

    tiprofiler.createToolbar = function() {
        var tb = Ext.create('Ext.toolbar.Toolbar');
        tb.add(
            '-',
            {
                id: 'start_stop_btn',
                text: 'Start profiler',
                enableToggle: true,
                toggleHandler: onItemToggle,
                pressed: false
            },
            '-'
        );
        return tb;
    };
}());