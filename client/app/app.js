var tiprofiler = tiprofiler || {};

(function() {
    Ext.require(['*']);

    Ext.define('App', {
        mixins: {
            observable: 'Ext.util.Observable'
        },
        constructor: function (config) {
            this.mixins.observable.constructor.call(this, config);
        }
    });
    
    //this is used as an application-wide event bus
    tiprofiler.app = new App();


    Ext.onReady(function(){
        var profilerDataStore = tiprofiler.createProfilerDataStore();
        var appLayout = tiprofiler.createAppLayout();

        appLayout.toolbarView = tiprofiler.createToolbar();
        appLayout.treeGridView = tiprofiler.createTreeGrid(profilerDataStore.store);

        appLayout.createView();

        var editor = tiprofiler.createEditor();
        editor.updateFileInfo();


        var socket = io.connect('http://localhost');

        var timeout = null;

        var clearTimer = function() {
            if (timeout) {
                clearTimeout(timeout);
            }
        };

        var setTimer = function(cb) {
            clearTimer();
            timeout = setTimeout(function() {
                timeout = null;
                cb.call();
            }, 4000);
        };


        tiprofiler.app.on('profiler:shouldStart', function() {
            tiprofiler.createToast('Ti Profiler', 'Starting...');
            socket.emit('TiProfiler:start');
            setTimer(function() {
                appLayout.toolbarView.startStopButton.setNormal();
                tiprofiler.createToast('Ti Profiler', 'the profiler didn\'t respond...');
            });
        });

        tiprofiler.app.on('profiler:shouldStop', function() {
            tiprofiler.createToast('Ti Profiler', 'Stopping...');
            socket.emit('TiProfiler:stop');
            setTimer(function() {
                appLayout.toolbarView.startStopButton.setPressed();
                tiprofiler.createToast('Ti Profiler', 'the profiler didn\'t respond...');
            });
        });

        socket.on('connect', function() {
            console.log('socket.io connected...');
            socket.emit('TiProfiler:isRunning');
        });

        socket.on('profiler:didStart', function (data) {
            console.log('profiler:didStart - ' + data);
            clearTimer();
            tiprofiler.createToast('Ti Profiler', 'running');
            appLayout.toolbarView.startStopButton.setPressed();
        });

        socket.on('profiler:didStop', function (data) {
            console.log('profiler:didStop - ' + JSON.stringify(data));
            clearTimer();
            if (data.profileInfo) {
                profilerDataStore.load(JSON.parse(data.profileInfo));
            }
            tiprofiler.createToast('Ti Profiler', 'stopped');
            appLayout.toolbarView.startStopButton.setNormal();
        });

        tiprofiler.app.on('treegrid:rowselected', function(e){
            editor.updateFileInfo(e);
        });

    });


}());