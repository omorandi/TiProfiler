var tiprofiler = tiprofiler || {};

(function() {

    tiprofiler.createTreeGrid = function(store) {
        //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
        var tree = Ext.create('Ext.tree.Panel', {
            title: 'Profiling data',
            width: '100%',
            height: '100%',
            //renderTo: Ext.getBody(),
            collapsible: false,
            useArrows: true,
            rootVisible: false,
            store: store,
            multiSelect: false,
            singleExpand: false,
            //the 'columns' property is now 'headers'
            columns: [
            {
                text: 'Self(ms)',
                flex: 0.8,
                sortable: true,
                dataIndex: 'selfMs',
                align: 'right'
            },
            {
                text: 'Total(ms)',
                flex: 0.8,
                sortable: false,
                dataIndex: 'totalMs',
                align: 'right'
            },
            {
                text: 'Count',
                flex: 0.8,
                sortable: false,
                dataIndex: 'count',
                align: 'right'
            },
            {
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Function',
                flex: 3,
                sortable: false,
                dataIndex: 'function',
                renderer: function(value, p, r) {
                    return '<span class="functionname">' + r.data['function'] + '</span>';
                }
            },
            {
                text: 'File',
                flex: 3,
                sortable: false,
                dataIndex: 'file',
                renderer: function(value, p, r) {
                    if (!r.data.file) { return ''; }
                    return '<span class="filelink">' + r.data.file + ':' + r.data.line + '</span>';
                }
            }]
        });

        // little bit of feedback
        tree.on('selectionchange', function(view, nodes){
            var node = nodes[0];
            tiprofiler.app.fireEvent('treegrid:rowselected', {url: node.data.url, line: node.data.line});
        });
        return tree;
    };

}());