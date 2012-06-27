var tiprofiler = tiprofiler || {};

(function() {

    var ProfilerStore = function () {
        this.loadEnabled = false;

        var profilerModel = Ext.define('Profiler', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'running',     type: 'boolean'}
            ]
        });

        this.store = Ext.create('Ext.data.Store', {
            model: 'Profiler',
            proxy: {
                type: 'ajax',
                //the store will get the content from the .json file
                url: '../profiler/running'
            },
            autoLoad: false
        });

        this.store.on('load', function(store, records, success) {
            tiprofiler.app.fireEvent('profiler:running', {records: records, success: success});
        });
    };

    ProfilerStore.prototype.load = function() {
        this.loadEnabled = true;
        this.store.load();
    };



    tiprofiler.createProfilerStore = function() {
        return new ProfilerStore();
    };
}());
