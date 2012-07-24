var tiprofiler = tiprofiler || {};

(function() {

    var ProfilerDataStore = function () {
        var self = this;

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
                }
            },
            /*
            proxy: {
                type: 'ajax',
                //the store will get the content from the .json file
                url: '../profiler/profiledata'
            },
            */
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            autoLoad: true,
            folderSort: false
        });
    };

    ProfilerDataStore.prototype.load = function(data) {
        if (data) {
            this.store.setRootNode(data);
            //this.store.data = data;
        }
        //this.store.load();
    };



    tiprofiler.createProfilerDataStore = function() {
        return new ProfilerDataStore();
    };
}());