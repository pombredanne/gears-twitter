/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-recess');

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		min: {
            dialog: {
                src: ['<banner:meta.banner>', 'dist/dialog.js'],
                dest: 'dist/dialog.min.js'
            },
            gear: {
                src: ['<banner:meta.banner>', 'dist/gear.js'],
                dest: 'dist/gear.min.js'
            }
		},
		qunit: {
			tests: ['test/**/*.html']
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: ['grunt.js', 'lib/**', 'src/**', 'test/**'],
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true,
				define: true,
				require: true
			}
		},
		uglify: {},
		requirejs: {
			combine: {
				options: {
					appDir: 'src',
					baseUrl: '.',
					dir: 'dist',
					optimize: 'none',
					optimizeCss: 'none',
					paths: {
                        'fuelux-gearapi': '../dist',
                        'postmonger': '../lib/postmonger'
					},
					modules: [
                        {
                            create: true,
                            name: 'dialog',
                            include: ['postmonger', 'fuelux-gearapi/dialog']
                        },
                        {
                            create: true,
                            name: 'gear',
                            include: ['postmonger', 'fuelux-gearapi/gear']
                        }
                    ]
				}
			}
		},
		recess: {},
		clean: {
			dist: ['dist/build.txt', 'dist/fuelux-gearapi.zip'],
			zipsrc: ['dist/fuelux-gearapi']
		},
		copy: {
			zipsrc: {
				options: {
					basePath: 'dist'
				},
				files: {
					'dist/fuelux-gearapi': 'dist/**'
				}
			}
		},
		compress: {
			zip: {
				files: {
					'dist/fuelux-gearapi.zip': 'dist/fuelux-gearapi/**'
				},
				options: {
					mode: 'zip',
					basePath: 'dist/'
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint requirejs clean:dist min copy:zipsrc compress clean:zipsrc');

    // Helper for running shell scripts
    grunt.registerHelper('exec_shell_script', function (path, done) {
        var cmd = require('child_process').spawn('bash', [path]);

        cmd.stderr.on('data', function(data) {
            grunt.log.write(data.toString());
        });

        cmd.stdout.on('data', function(data) {
            grunt.log.write(data.toString());
        });

        cmd.on('exit', function(code) {
            done(code);
        });
    });

    grunt.registerTask('updateLibraries', 'Updates the lib folder.', function () {
        var done = this.async();
        grunt.helper('exec_shell_script', 'util/update-libraries.sh', done);
    });
};
