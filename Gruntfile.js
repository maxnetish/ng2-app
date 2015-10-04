module.exports = function (grunt) {
    var paths = {
        buildDir: 'app/build',
        srcDir: 'app/src'
    };

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: [paths.buildDir],

        copy: {
            index: {
                files: [
                    {
                        src: paths.srcDir + '/index.html',
                        dest: paths.buildDir + '/index.html'
                    }
                ]
            },
            'ts-source': {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        src: paths.srcDir + '/**/*.ts',
                        dest: paths.buildDir + '/js/src/'
                    }
                ]
            }
        },

        ts: {
            client: {
                src: [paths.srcDir + '/**/*.ts', paths.srcDir + '/**/*.spec.ts'],
                out: paths.buildDir + '/js/app.js',
                sourceRoot: '/js/src/'
            }
        },

        'http-server': {
            'dev': {
                // the server root directory
                root: paths.buildDir,

                // the server port
                // can also be written as a function, e.g.
                // port: function() { return 8282; }
                port: 8282,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                host: "127.0.0.1",

                showDir: true,
                autoIndex: true,

                // server default file extension
                ext: "html",

                // run in parallel with other tasks
                runInBackground: false
            }
        }

    });

    grunt.registerTask('default', ['clean', 'copy:index', 'copy:ts-source', 'ts:client', 'http-server:dev']);
    grunt.registerTask('build', ['clean', 'copy:index', 'copy:ts-source', 'ts:client']);
    grunt.registerTask('run', ['http-server:dev']);
};