(function(params) {
    Cla.help_push({
        title: _('Run Maven Script'),
        path: 'rules/palette/job/run-remote'
    });
    var data = params.data || {};

    var server = Cla.ui.ciCombo({
        name: 'server',
        class: 'BaselinerX::CI::generic_server',
        fieldLabel: _('Server'),
        value: params.data.server || '',
        allowBlank: false,
    });

    var user = Cla.ui.textField({
        name: 'user',
        fieldLabel: _('User'),
        value: params.data.user
    });

    var args = Cla.ui.comboBox({
        name: 'args',
        fieldLabel: _('Goals'),
        data: [
            ['clean'],
            ['validate'],
            ['initialize'],
            ['generate-sources'],
            ['process-sources'],
            ['generate-resources'],
            ['process-resources'],
            ['compile'],
            ['test'],
            ['package'],
            ['verify'],
            ['install'],
            ['deploy']
        ],
        value: params.data.args || [],
    });

    var paramsDefaults = new Baseliner.ArrayGrid({
        fieldLabel: _('Custom goals'),
        name: 'paramsDefaults',
        value: params.data.paramsDefaults,
        description: 'params',
        default_value: '.'
    });

    var home = Cla.ui.textField({
        name: 'home',
        fieldLabel: _('Home Directory'),
        value: params.data.home || '',
        allowBlank: false
    });

    var errors = new Baseliner.ComboSingle({
        fieldLabel: _('Errors'),
        name: 'errors',
        value: params.data.errors || 'fail',
        data: [
            'fail',
            'warn',
            'custom',
            'silent'
        ]
    });
    var customError = new Ext.Panel({
        layout: 'column',
        fieldLabel: _('Return Codes'),
        frame: true,
        hidden: params.data.errors != 'custom',
        items: [{
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Ok'),
                name: 'rcOk',
                value: params.data.rcOk
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Warn'),
                name: 'rcWarn',
                value: params.data.rcWarn
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Error'),
                name: 'rcError',
                value: params.data.rcError
            }
        }],
        show_hide: function() {
            errors.getValue() == 'custom' ? this.show() : this.hide();
            this.doLayout();
        }
    });

    errors.on('select', function() {
        customError.show_hide()
    });

    return [
        server,
        user,
        args,
        paramsDefaults,
        home,
        errors,
        customError,
        new Baseliner.ErrorOutputTabs({
            data: params.data
        })
    ]
})