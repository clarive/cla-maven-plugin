var reg = require('cla/reg');

reg.register('service.scripting.maven', {
    name: 'Run a maven script',
    icon: 'plugin/cla-maven-plugin/icon/maven.svg',
    form: '/plugin/cla-maven-plugin/form/runMavenScriptForm.js',

    handler: function(ctx, params) {

        var ci = require("cla/ci");
        var regRunRemote = require('cla/reg');
        var fs = require('cla/fs');
        var log = require('cla/log');
        var proc = require("cla/process");

        var claBase = proc.env('CLARIVE_BASE');
        var server = ci.load(params.server);
        var errorsType = params.errors || 'fail';
        var mavenCommand = ' ';
        var executeCommand = 'cd ' + params.home + ';';
        var output = '';

        if (!fs.isDir(claBase + '/' + params.home)) {
            log.error("No such directory");
            throw new Error('No such directory');
        }

        var buildMavenCommand = function(params) {
            var mavenCommand = 'mvn ';
            var args = params.args || [];
            var paramsDefaults = params.paramsDefaults || [];

            if (args && args.length > 0) {
                if (typeof args == 'string') {
                    args = [args];
                }
                mavenCommand += args.join(' ') + ' ';
            }
            for (var i = 0; i < paramsDefaults.length; i++) {

                if (paramsDefaults[i].length <= 1) {
                    continue;
                }
                if (paramsDefaults[i][0] == '.') {
                    mavenCommand += ' ' + paramsDefaults[i].replace('.', '');
                } else {
                    mavenCommand += ' ' + paramsDefaults[i];
                }
            }
            return mavenCommand;
        }

        mavenCommand = buildMavenCommand(params);
        if(mavenCommand == 'mvn '){
            log.error("You have not put any goals");
            throw new Error('You have not put any goals');
        }

        executeCommand += ' ' + mavenCommand;

        output = regRunRemote.launch('service.scripting.remote', {
            name: 'Run a maven script',
            config: {
                errors: errorsType,
                server: params.server,
                user: params.user,
                home: params.home,
                path: executeCommand,
                output_error: params.output_error,
                output_warn: params.output_warn,
                output_capture: params.output_capture,
                output_ok: params.output_ok,
                meta: params.meta,
                rc_ok: params.rcOk,
                rc_error: params.rcError,
                rc_warn: params.rcWarn
            }
        });
        return output;
    }
});