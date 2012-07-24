var tiprofiler = tiprofiler || {};
(function() {

    var AppLayout = function() {

    };

    AppLayout.prototype.createView = function() {
        var self = this;
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
                        self.toolbarView
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
                        columnWidth: 1/2,
                        height: '100%',
                        xtype: 'panel',
                        items:[
                            self.treeGridView
                        ]
                    },
                    {
                        columnWidth: 1/2,
                        height: '100%',
                        baseCls:'x-plain',
                        items:[{
                            title: 'File',
                            html: '<div id="ace-editor"/>'
                        }]
                    }]
                }]
        });

        return appLayout;
    };


    tiprofiler.createAppLayout = function() {
        return new AppLayout();
    };
}());