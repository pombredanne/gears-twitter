'use strict';

var path = require( 'path' );

// From yeoman
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (express, dir) {
    return express.static(require('path').resolve(dir));
};


module.exports = function( grunt ) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configuration
    var appPathsConfig = {
        src: '',
        dist: 'optimized',
        client: 'public',
        clientConfig: 'public/web-config',
        tests: 'tests'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        pathConfig: appPathsConfig,
        express: {
            livereload: {
                options: {
                    port: 9000,
                    bases: path.resolve( '<%= pathConfig.client %>' ),
                    monitor: {},
                    debug: true,
                    server: path.resolve( '<%= pathConfig.src %>/app.js' )
                }
            },
            test: {
                options: {
                    hostname: 'localhost',
                    port: 9000,
                    bases: 'src/public',
                    middleware: function( express ) {
                        return [
                            lrSnippet,
                            mountFolder( express, '.tmp' ),
                            mountFolder( express, 'tests' )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    hostname: 'localhost',
                    port: 9000,
                    bases: 'dist',
                    middleware: function ( express ) {
                        return [
                            mountFolder( express, 'dist' )
                        ];
                    }
                }
            },
            src: {
                options: {
                    hostname: 'localhost',
                    port: 9000,
                    bases: '<%= pathConfig.client %>',
                    middleware: function ( express ) {
                        return [
                            mountFolder( express, 'src' )
                        ];
                    }
                }
            }
        },
        watch: {
            reload: {
                files: '<config:lint.files>',
                tasks: 'reload lint jshint recess:compile mocha'
            }
        },
        lint: {
            files: [
                'Gruntfile.js',
                '<%= pathConfig.src %>/**/*.js',
                '<%= pathConfig.tests %>/**/*.js'
            ],
            options: {
                banner: '/*! <%= pkg.name %> <% grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all_files: [
                'Gruntfile.js',
                '<%= pathConfig.src %>app.js',
                '<%= pathConfig.src %>lib/**/*.js',
                '<%= pathConfig.src %>config/**/*.js',
                '<%= pathConfig.client %>/views/**/*.js',
                '<%= pathConfig.client %>/data/**/*.js'
            ]
        },
        mocha: {
            options: {
                run: true
            },
            index: ['<%= pathConfig.tests %>/index.html']
        },
        requirejs: {
            compile: {
                options: {
                    appDir: '<%= pathConfig.client %>/',
                    baseUrl: 'vendor',
                    dir: '<%= pathConfig.dist %>/',
                    optimize: 'uglify2',
                    optimizeCss: 'standard.keepLines',
                    mainConfigFile: '<%= pathConfig.clientConfig %>/main.js',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    paths: {
                        config: 'empty:',
                        router: '../web-config/router'
                    },
                    modules: [
                        { name: '../web-config/main' }
                    ],
                    nodeRequire: require
                }
            }
        },
        recess: {
            compile: {
                src: ['<%= pathConfig.client %>/less/styles.less'],
                dest: '<%= pathConfig.client %>/css/styles.css',
                options: {
                    compile: true
                }
            },
            compress: {
                src: ['<%= pathConfig.client %>/less/styles.less'],
                dest: '<%= pathConfig.dist %>/<%= pkg.version %>/css/styles.css',
                options: {
                    compile: true,
                    compress: true
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= pathConfig.src %>',
                    src: '*.html',
                    dest: '<%= pathConfig.dist %>'
                }]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                }
            },
            files: {
                '<%= pathConfig.dist %>/<%= pkg.version %>/public/img/appSprite.png': '<%= pathConfig.client %>/img/appSprite.png'
            }
        },
        nodeunit: {
            tests: ['nodetests/*_test.js']
        },
        open: {
            server: {
                path: 'http://localhost:<%= express.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= pathConfig.dist %>/<%= pkg.version %>*'],
            server: '.tmp'
        }
    });

    // Register tasks
    grunt.registerTask( 'default', [
        'jshint',
        'test',
        'build',
        'watch'
    ]);

    grunt.registerTask('build', [
        'test',
        'requirejs',
        'imagemin',
        'htmlmin'
    ]);


    grunt.registerTask( 'test', [
        'clean',
        'jshint',
        'mocha',
        'nodeunit'
        //'express:test',
        //'express-keepalive'
    ]);

    grunt.registerTask( 'package', [
        'build'
    ]);

    grunt.registerTask( 'server', [
        'livereload-start',
        'express',
        'express-keepalive',
    ]);

    grunt.registerTask( 'cleanDist', ['clean:dist'] );

    grunt.registerTask( 'clientSideTests', [
        'clean:server',
        'jshint',
        'mocha'
    ]);

    grunt.registerTask( 'serverSideTests', [
        'jshint',
        'nodeunit'
    ]);

    // Debug task, don't warn about console statements
    grunt.registerTask( 'development', 'Development Task', function() {
        grunt.config( 'jshint.options.devel', true );
        grunt.config( 'requirejs.compile.options.optimize', 'none' );
        grunt.task.run( 'default' );
    });
};
