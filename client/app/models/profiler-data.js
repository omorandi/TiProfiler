var tiprofiler = tiprofiler || {};

(function() {

    var ProfilerDataStore = function () {
        var self = this;

        //this is a hack just for effectively disabling autoLoad the first time
        self.loadEnabled = false;

        Ext.define('ProfileData', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'url',     type: 'string'},
                {name: 'file',  type: 'string'},
                {name: 'line',     type: 'int'},
                {name: 'function', type: 'string'},
                {name: 'count',     type: 'int'},
                {name: 'selfMs',     type: 'int'},
                {name: 'selfP',     type: 'float'},
                {name: 'totalMs',     type: 'int'},
                {name: 'totalP',     type: 'float'}
            ]
        });

        self.store = Ext.create('Ext.data.TreeStore', {
            model: 'ProfileData',
            listeners: {
                'load': function(store, records, successful) {
                  console.log('loaded data:');
                  console.log(records);
                },
                beforeload: function(store, op){
                    if (!self.loadEnabled) { return false; }
                }
            },
            proxy: {
                type: 'ajax',
                //the store will get the content from the .json file
                url: '../profiler/stop'
            },
            autoLoad: false,
            folderSort: false
        });
    };

    ProfilerDataStore.prototype.load = function() {
        this.loadEnabled = true;
        this.store.load();
    };



    tiprofiler.createProfilerDataStore = function() {
        return new ProfilerDataStore();
    };
}());