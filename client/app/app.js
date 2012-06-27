var tiprofiler = tiprofiler || {};

(function() {
    Ext.require(['*']);

    Ext.define('App', {
        mixins: {
            observable: 'Ext.util.Observable'
        },
        constructor: function (config) {
            this.mixins.observable.constructor.call(this, config);
            this.addEvents(
                'running-load'
            );
        }
    });
    
    tiprofiler.app = new App();

    tiprofiler.app.on('running-load', function() {
        alert('running-load');
    });


    var NO_FILE_SELECTED_MSG = '/*\n\n\tno file selected\n\n*/';


    Ext.onReady(function(){
        var profilerDataStore = tiprofiler.createProfilerDataStore();
        var profilerStore = tiprofiler.createProfilerStore();

        var appLayout = tiprofiler.createAppLayout(profilerDataStore.store);

        var editor = appLayout.editor;
        var treeGrid = appLayout.treeGrid;

        

        editor.getSession().setValue(NO_FILE_SELECTED_MSG);


        tiprofiler.app.on('profiler:shouldStart', function() {
            tiprofiler.createToast('Ti Profiler', 'Starting...');
        });

        tiprofiler.app.on('profiler:shouldStop', function() {
            tiprofiler.createToast('Ti Profiler', 'Stopping...');
        });

        tiprofiler.app.on('profiler:running', function(e) {
            if (!e.success || !e.records || e.records.length === 0) {
                tiprofiler.createToast('Error!', 'Something went wrong determining if the profiling server is running...', true);
                return;
            }
            var info = e.records[0];
            var running = info.running;

            var text = running ? 'is running...' : 'is not running';
            tiprofiler.createToast('Ti Profiler', text);
        });

        tiprofiler.app.on('treegrid:rowselected', function(e){
            if (e.url === '') {
                editor.getSession().setValue(NO_FILE_SELECTED_MSG);
                return;
            }

            treeGrid.setTitle('<code>'+ e.url + ':' + e.line + '</code>');
            
            try {
                Ext.Ajax.request({
                    url : e.url,
                    method: 'GET',
                    success: function ( result, request ) {
                        editor.getSession().setValue(result.responseText);
                        editor.gotoLine(e.line);
                    },
                    failure: function ( result, request ) {
                        editor.getSession().setValue(NO_FILE_SELECTED_MSG);
                        alert('Something went wrong, can\'t open file');
                    }
                });
            }
            catch (e) {
                editor.getSession().setValue(NO_FILE_SELECTED_MSG);
                alert('Something went wrong: ' + e.message);
            }
        });

        profilerStore.load();
    });


}());