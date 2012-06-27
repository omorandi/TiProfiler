var tiprofiler = tiprofiler || {};
(function() {

    tiprofiler.createAppLayout = function(profilerDataStore) {
        var toolbar = tiprofiler.createToolbar();
        var treeGrid = tiprofiler.createTreeGrid(profilerDataStore);
        var appLayout = Ext.create('Ext.Viewport',{
            layout : "border",
            items : [
                {
                    region:'north',
                    defaults: {
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        }
                    },
                    items: [
                        toolbar
                    ]
                },
                {
                    region:'center',
                    //margins:'5 5 5 5',
                    layout:'column',
                    autoScroll:true,
                    defaults: {
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        }
                    },
                    items: [
                    {
                        columnWidth: 2/5,
                        height: '100%',
                        xtype: 'panel',
                        items:[
                            treeGrid
                        ]
                    },
                    {
                        columnWidth: 3/5,
                        height: '100%',
                        baseCls:'x-plain',
                        items:[{
                            title: 'File',
                            html: '<div id="ace-editor"/>'
                        }]
                    }]
                }]
        });
        appLayout.editor = tiprofiler.createEditor();
        appLayout.toolbar = toolbar;
        appLayout.treeGrid = treeGrid;

        return appLayout;
    };
}());