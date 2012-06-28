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
        var profilerStore = tiprofiler.createProfilerStore();

        var appLayout = tiprofiler.createAppLayout();

        appLayout.toolbarView = tiprofiler.createToolbar();
        appLayout.treeGridView = tiprofiler.createTreeGrid(profilerDataStore);

        appLayout.createView();

        var editor = tiprofiler.createEditor();
        editor.updateFileInfo();

        tiprofiler.app.on('profiler:shouldStart', function() {
            tiprofiler.createToast('Ti Profiler', 'Starting...');
        });

        tiprofiler.app.on('profiler:shouldStop', function() {
            tiprofiler.createToast('Ti Profiler', 'Stopping...');
        });

        tiprofiler.app.on('profiler:running', function(e) {
            if (!e.success || !e.records || e.records.length === 0) {
                tiprofiler.createToast('Error!', 'Something went wrong: is the app running?', true);
                return;
            }
            var info = e.records[0].data;
            var running = info.running;

            var text = running ? 'is running...' : 'is not running';
            tiprofiler.createToast('Ti Profiler', text);
        });

        tiprofiler.app.on('treegrid:rowselected', function(e){
            editor.updateFileInfo(e);
        });

        profilerStore.load();

        var socket = io.connect('http://localhost');
        socket.on('profiler:didStart', function (data) {
            console.log('profiler:didStart - ' + data);
        });
    });


}());